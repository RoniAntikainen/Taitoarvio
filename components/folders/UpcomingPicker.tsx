"use client";

import { useEffect, useMemo, useState } from "react";

type SportId = "football" | "dance" | string;

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  location?: string;
  href?: string;
  details?: string;
};

type UpcomingContent = {
  mode: "calendar" | "manual";
  selected: CalendarEvent[];
  manualText: string;
};

function safeParse<T>(s: string, fallback: T): T {
  try {
    const v = JSON.parse(s);
    return (v ?? fallback) as T;
  } catch {
    return fallback;
  }
}

function sortByDateThenTitle(a: CalendarEvent, b: CalendarEvent) {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return a.title.localeCompare(b.title);
}

function normalizeInitialUpcoming(initialJson: string | null | undefined): UpcomingContent {
  const fallback: UpcomingContent = { mode: "manual", selected: [], manualText: "" };
  const raw = String(initialJson ?? "").trim();

  // ✅ tärkein: tyhjä tai "{}" -> ei näytetä "{}" tekstikentässä
  if (!raw || raw === "{}") return fallback;

  const parsed = safeParse<any>(raw, fallback);

  // jos joskus tallessa pelkkä string -> se on manualText
  if (typeof parsed === "string") {
    const t = parsed.trim();
    return { mode: "manual", selected: [], manualText: t === "{}" ? "" : t };
  }

  // jos joskus tallessa { text: "..." } (meidän safeJsonStringFromForm tekee tätä)
  if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
    const t = parsed.text.trim();
    return { mode: "manual", selected: [], manualText: t === "{}" ? "" : t };
  }

  // normaali muoto
  return {
    mode: parsed?.mode === "calendar" ? "calendar" : "manual",
    selected: Array.isArray(parsed?.selected) ? parsed.selected : [],
    manualText: typeof parsed?.manualText === "string" ? parsed.manualText : "",
  };
}

export default function UpcomingPicker({
  sportId,
  initialJson,
  readOnly,
}: {
  sportId: SportId;
  initialJson: string;
  readOnly: boolean;
}) {
  const initial = useMemo<UpcomingContent>(
    () => normalizeInitialUpcoming(initialJson),
    [initialJson]
  );

  const [panelOpen, setPanelOpen] = useState(false);
  const [content, setContent] = useState<UpcomingContent>(initial);
  const [loading, setLoading] = useState(false);
  const [calendarAvailable, setCalendarAvailable] = useState<boolean | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // jos initialJson muuttuu (esim. folder vaihtuu), päivitetään state
  useEffect(() => {
    setContent(initial);
  }, [initial]);

  useEffect(() => {
    if (!panelOpen) return;
    let aborted = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/calendars/${sportId}.json`, { cache: "no-store" });
        if (!res.ok) {
          if (!aborted) setCalendarAvailable(false);
          return;
        }
        const data = (await res.json()) as CalendarEvent[];
        if (!aborted) {
          setCalendarAvailable(true);
          setEvents((data ?? []).sort(sortByDateThenTitle));
          setContent((c) => ({ ...c, mode: "calendar" }));
        }
      } catch {
        if (!aborted) setCalendarAvailable(false);
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    load();
    return () => {
      aborted = true;
    };
  }, [panelOpen, sportId]);

  const selectedIds = useMemo(
    () => new Set(content.selected.map((e) => e.id)),
    [content.selected]
  );

  const filteredEvents = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return events;
    return events.filter((e) =>
      `${e.date} ${e.title} ${e.location ?? ""} ${e.details ?? ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [events, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of filteredEvents) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEvents]);

  function toggleEvent(e: CalendarEvent) {
    if (readOnly) return;
    setContent((c) =>
      c.selected.some((x) => x.id === e.id)
        ? { ...c, selected: c.selected.filter((x) => x.id !== e.id) }
        : { ...c, mode: "calendar", selected: [...c.selected, e].sort(sortByDateThenTitle) }
    );
  }

  const payload = JSON.stringify(content);

  return (
    <div className="upcoming">
      <input type="hidden" name="upcomingJson" value={payload} />

      <div className="upcoming-selected">
        {content.selected.length === 0 ? (
          <div className="muted">Ei valittuja tapahtumia.</div>
        ) : (
          content.selected.map((e) => (
            <div key={e.id} className="selected-card">
              <div>
                <div className="title">{e.title}</div>
                <div className="meta">
                  {e.date}
                  {e.location && ` · ${e.location}`}
                </div>
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      selected: c.selected.filter((x) => x.id !== e.id),
                    }))
                  }
                >
                  Poista
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="upcoming-toolbar">
        <div className="muted">Klikkaa tapahtumaa valitaksesi / poistaaksesi.</div>
        <button type="button" onClick={() => setPanelOpen((v) => !v)} disabled={readOnly}>
          {panelOpen ? "Sulje valitsin" : "Valitse tulevat kilpailut / pelit"}
        </button>
      </div>

      {panelOpen && (
        <div className="panel">
          {loading && <div>Haetaan kalenteria…</div>}
          {calendarAvailable === true && (
            <>
              <input
                className="search"
                placeholder="Hae (päivä, nimi, paikka)…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              {grouped.map(([date, list]) => (
                <div key={date} className="group">
                  <div className="group-date">{date}</div>
                  {list.map((e) => {
                    const picked = selectedIds.has(e.id);
                    return (
                      <div
                        key={e.id}
                        className={`event-card ${picked ? "picked" : ""}`}
                        onClick={() => toggleEvent(e)}
                      >
                        <div className="event-head">
                          <div>
                            <div className="title">{e.title}</div>
                            <div className="meta">{e.location}</div>
                          </div>
                          <div className="meta">{picked ? "Valittu" : "Ei valittu"}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          {calendarAvailable === false && (
            <div className="muted">Kalenteria ei löytynyt tälle lajille.</div>
          )}
        </div>
      )}

      {/* jos sulla on manuaalinen textarea jossain toisessa komponentissa, tämä content.manualText pysyy nyt "" eikä "{}" */}
    </div>
  );
}
