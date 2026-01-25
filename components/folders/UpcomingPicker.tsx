"use client";

import { useEffect, useMemo, useState } from "react";

type SportId = "football" | "dance" | string;

type CalendarEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  location?: string;
  href?: string;
  details?: string;
};

type UpcomingContent =
  | {
      mode: "calendar";
      selected: CalendarEvent[];
      manualText: string;
    }
  | {
      mode: "manual";
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
  const da = a.date || "";
  const db = b.date || "";
  if (da < db) return -1;
  if (da > db) return 1;
  return (a.title || "").localeCompare(b.title || "");
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
  const initial = useMemo<UpcomingContent>(() => {
    const fallback: UpcomingContent = { mode: "manual", selected: [], manualText: "" };
    const parsed = safeParse<any>(initialJson || "", fallback);

    if (typeof parsed === "string") {
      return { mode: "manual", selected: [], manualText: parsed };
    }

    const mode = parsed?.mode === "calendar" ? "calendar" : "manual";
    const selected = Array.isArray(parsed?.selected) ? parsed.selected : [];
    const manualText = typeof parsed?.manualText === "string" ? parsed.manualText : "";

    return { mode, selected, manualText };
  }, [initialJson]);

  const [panelOpen, setPanelOpen] = useState(false);
  const [content, setContent] = useState<UpcomingContent>(initial);

  const [loading, setLoading] = useState(false);
  const [calendarAvailable, setCalendarAvailable] = useState<boolean | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!panelOpen) return;

    let aborted = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/calendars/${sportId}.json`, { cache: "no-store" });
        if (!res.ok) {
          if (!aborted) {
            setCalendarAvailable(false);
            setEvents([]);
          }
          return;
        }

        const data = (await res.json()) as CalendarEvent[];
        const normalized = Array.isArray(data) ? data : [];

        if (!aborted) {
          setCalendarAvailable(true);
          setEvents(normalized.sort(sortByDateThenTitle));
          setContent((c) => ({ ...c, mode: "calendar" }));
        }
      } catch {
        if (!aborted) {
          setCalendarAvailable(false);
          setEvents([]);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    load();
    return () => {
      aborted = true;
    };
  }, [panelOpen, sportId]);

  const selectedIds = useMemo(() => new Set(content.selected.map((e) => e.id)), [content.selected]);

  const filteredEvents = useMemo(() => {
    const query = q.trim().toLowerCase();
    const base = events;

    if (!query) return base;

    return base.filter((e) => {
      const hay = `${e.date} ${e.title} ${e.location ?? ""} ${e.details ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [events, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of filteredEvents) {
      const key = e.date || "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  }, [filteredEvents]);

  function toggleEvent(e: CalendarEvent) {
    if (readOnly) return;

    setContent((c) => {
      const exists = c.selected.some((x) => x.id === e.id);
      if (exists) {
        return { ...c, selected: c.selected.filter((x) => x.id !== e.id) };
      }
      return { ...c, mode: "calendar" as const, selected: [...c.selected, e].sort(sortByDateThenTitle) };
    });
  }

  function removeEvent(id: string) {
    if (readOnly) return;
    setContent((c) => ({ ...c, selected: c.selected.filter((x) => x.id !== id) }));
  }

  function setManualText(v: string) {
    setContent((c) => ({ ...c, manualText: v }));
  }

  function toggleExpanded(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  function onCardKeyDown(ev: React.KeyboardEvent, e: CalendarEvent) {
    if (readOnly) return;
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      toggleEvent(e);
    }
  }

  const payload = JSON.stringify(content);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <input type="hidden" name="upcomingJson" value={payload} />

      {/* Selected list */}
      <div style={{ display: "grid", gap: 8 }}>
        {content.selected.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Ei valittuja tapahtumia.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {content.selected.map((e) => (
              <div
                key={e.id}
                style={{
                  padding: 10,
                  borderRadius: 14,
                  background: "rgba(0,0,0,.04)",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "grid", gap: 2 }}>
                  <div style={{ fontWeight: 800 }}>{e.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    {e.date}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                </div>

                {!readOnly ? (
                  <button type="button" onClick={() => removeEvent(e.id)} style={{ padding: "8px 10px", borderRadius: 12 }}>
                    Poista
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open panel */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Klikkaa tapahtumaa valitaksesi / poistaaksesi valinnan.</div>

        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          style={{ padding: "10px 12px", borderRadius: 12 }}
          disabled={readOnly}
        >
          {panelOpen ? "Sulje valitsin" : "Valitse tulevat kilpailut / pelit"}
        </button>
      </div>

      {panelOpen ? (
        <div style={{ padding: 12, borderRadius: 16, background: "rgba(0,0,0,.04)", display: "grid", gap: 10 }}>
          {loading ? <div>Haetaan kalenteria…</div> : null}

          {calendarAvailable === false ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ fontWeight: 800 }}>Lajillesi ei ole valitettavasti kisa-/pelikalenteria saatavilla.</div>
              <div style={{ opacity: 0.75 }}>Sori — sinun pitää kirjoittaa ne itse.</div>

              <textarea
                rows={6}
                value={content.manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Kirjoita tulevat tapahtumat (yksi per rivi)."
                style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
                disabled={readOnly}
              />
            </div>
          ) : calendarAvailable === true ? (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Hae (päivä, nimi, paikka)…"
                  style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)", minWidth: 280 }}
                />
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontSize: 12, opacity: 0.75 }}>Lisämuistiinpanot (valinnainen)</div>
                <textarea
                  rows={4}
                  value={content.manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Esim. matkustus, varusteet, aikatauluhuomiot…"
                  style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
                  disabled={readOnly}
                />
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {grouped.length === 0 ? (
                  <div style={{ opacity: 0.75 }}>Ei tapahtumia hakuehdoilla.</div>
                ) : (
                  grouped.map(([date, list]) => (
                    <div key={date} style={{ display: "grid", gap: 8 }}>
                      <div style={{ fontWeight: 800 }}>{date}</div>

                      <div style={{ display: "grid", gap: 8 }}>
                        {list.map((e) => {
                          const picked = selectedIds.has(e.id);
                          const hasDetails = Boolean(e.details && String(e.details).trim().length > 0);
                          const isOpen = Boolean(expanded[e.id]);

                          return (
                            <div key={e.id} style={{ display: "grid", gap: 6 }}>
                              {/* ✅ CARD IS NOW A DIV (no nested button issue) */}
                              <div
                                role={readOnly ? undefined : "button"}
                                tabIndex={readOnly ? -1 : 0}
                                onClick={() => toggleEvent(e)}
                                onKeyDown={(ev) => onCardKeyDown(ev, e)}
                                aria-pressed={picked}
                                style={{
                                  textAlign: "left",
                                  padding: 10,
                                  borderRadius: 14,
                                  border: "1px solid rgba(0,0,0,.12)",
                                  background: picked ? "rgba(0,0,0,.08)" : "white",
                                  display: "grid",
                                  gap: 6,
                                  cursor: readOnly ? "default" : "pointer",
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                                  <div>
                                    <div style={{ fontWeight: 800 }}>{e.title}</div>
                                    <div style={{ fontSize: 12, opacity: 0.75 }}>{e.location ?? ""}</div>
                                  </div>

                                  <div style={{ fontSize: 12, opacity: 0.75 }}>{picked ? "Valittu" : "Ei valittu"}</div>
                                </div>

                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                  {hasDetails ? (
                                    <button
                                      type="button"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation(); // ✅ ei togglea valintaa
                                        toggleExpanded(e.id);
                                      }}
                                      style={{ padding: "8px 10px", borderRadius: 12 }}
                                    >
                                      {isOpen ? "Piilota" : "Lue lisää"}
                                    </button>
                                  ) : (
                                    <div style={{ fontSize: 12, opacity: 0.6 }}>Ei lisätietoja</div>
                                  )}

                                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                                    {readOnly
                                      ? "Luku"
                                      : picked
                                      ? "Klikkaa korttia poistaaksesi valinnan"
                                      : "Klikkaa korttia valitaksesi"}
                                  </div>
                                </div>
                              </div>

                              {hasDetails && isOpen ? (
                                <div
                                  style={{
                                    padding: 10,
                                    borderRadius: 14,
                                    background: "rgba(255,255,255,.7)",
                                    border: "1px solid rgba(0,0,0,.10)",
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {e.details}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.75 }}>Avaa valitsin ladataksesi kalenterin.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
