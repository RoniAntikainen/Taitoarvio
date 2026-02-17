"use client";

import { useMemo, useState } from "react";

type AnyObj = Record<string, any>;

function safeParseJson(input: unknown): any {
  if (input == null) return null;
  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return null;
    try {
      return JSON.parse(s);
    } catch {
      return { text: s };
    }
  }
  return input;
}

function normalizeRows(raw: unknown): any[] {
  const v = safeParseJson(raw);

  // suoraan array
  if (Array.isArray(v)) return v;

  // muodot: { rows: [...] } / { items: [...] } / { results: [...] }
  if (v && typeof v === "object") {
    const o = v as AnyObj;
    if (Array.isArray(o.rows)) return o.rows;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.results)) return o.results;

    // joskus tallennettu muodossa { text: "..." } -> ei rivejä
    return [];
  }

  // null / string / muu -> ei rivejä
  return [];
}

function stringifyResults(rows: any[]) {
  // pidetään tallennusformaatti yksiselitteisenä jatkossa
  return JSON.stringify({ rows });
}

export default function ResultsEditor(props: {
  folderId: string;
  sportId: "football" | "dance";
  // vanha data voi tulla monessa muodossa
  initialJson?: any;
  onSave?: (json: string) => void;
}) {
  const { folderId, sportId, initialJson, onSave } = props;

  const initialRows = useMemo(() => normalizeRows(initialJson), [initialJson]);

  const [rows, setRows] = useState<any[]>(initialRows);

  function addRow() {
    // tee tyhjä rivi – pidetään sport-specific kentät ennallaan jos sulla oli ne
    if (sportId === "dance") {
      setRows((prev) => [
        ...prev,
        {
          date: "",
          topic: "",
          notes: "",
          rating: "",
        },
      ]);
      return;
    }

    setRows((prev) => [
      ...prev,
      {
        date: "",
        topic: "",
        notes: "",
        score: "",
      },
    ]);
  }

  function updateRow(idx: number, patch: AnyObj) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...(r ?? {}), ...patch } : r)));
  }

  function removeRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    const json = stringifyResults(rows);
    onSave?.(json);
  }

  return (
    <div className="reWrap">
      <div className="reHeader">
        <div className="reTitle">Tulokset</div>

        <div className="reActions">
          <button type="button" onClick={addRow}>
            Lisää rivi
          </button>
          <button type="button" onClick={handleSave}>
            Tallenna
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="reEmpty">Ei rivejä vielä. Lisää ensimmäinen.</div>
      ) : (
        <div className="reList">
          {rows.map((row: any, idx: number) => (
            <div key={idx} className="reCard">
              {sportId === "dance" ? (
                <>
                  <div className="reRow">
                    <label>Päivä</label>
                    <input
                      value={String(row?.date ?? "")}
                      onChange={(e) => updateRow(idx, { date: e.target.value })}
                      placeholder="2026-02-16"
                    />
                  </div>

                  <div className="reRow">
                    <label>Teema</label>
                    <input
                      value={String(row?.topic ?? "")}
                      onChange={(e) => updateRow(idx, { topic: e.target.value })}
                      placeholder="Esim. perusasento / rytmi"
                    />
                  </div>

                  <div className="reRow">
                    <label>Muistiinpanot</label>
                    <textarea
                      value={String(row?.notes ?? "")}
                      onChange={(e) => updateRow(idx, { notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="reRow">
                    <label>Arvio</label>
                    <input
                      value={String(row?.rating ?? "")}
                      onChange={(e) => updateRow(idx, { rating: e.target.value })}
                      placeholder="0–10"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="reRow">
                    <label>Päivä</label>
                    <input
                      value={String(row?.date ?? "")}
                      onChange={(e) => updateRow(idx, { date: e.target.value })}
                      placeholder="2026-02-16"
                    />
                  </div>

                  <div className="reRow">
                    <label>Teema</label>
                    <input
                      value={String(row?.topic ?? "")}
                      onChange={(e) => updateRow(idx, { topic: e.target.value })}
                      placeholder="Esim. syötöt / laukaukset"
                    />
                  </div>

                  <div className="reRow">
                    <label>Muistiinpanot</label>
                    <textarea
                      value={String(row?.notes ?? "")}
                      onChange={(e) => updateRow(idx, { notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="reRow">
                    <label>Pisteet</label>
                    <input
                      value={String(row?.score ?? "")}
                      onChange={(e) => updateRow(idx, { score: e.target.value })}
                      placeholder="0–10"
                    />
                  </div>
                </>
              )}

              <div className="reCardActions">
                <button type="button" onClick={() => removeRow(idx)}>
                  Poista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
