"use client";

import { useEffect, useMemo, useState } from "react";

type SportId = "football" | "dance";

type Props = {
  sportId: SportId;
  initialJson?: string;
  readOnly?: boolean;
  name?: string; // hidden input name (default "json")
};

type ResultRow = {
  date?: string;
  title?: string;
  place?: string;
  notes?: string;
};

function safeParseArray(s: string | undefined): ResultRow[] {
  const t = String(s ?? "").trim();
  if (!t) return [];
  try {
    const j = JSON.parse(t);
    return Array.isArray(j) ? (j as ResultRow[]) : [];
  } catch {
    return [];
  }
}

export default function ResultsEditor({ sportId, initialJson, readOnly = false, name = "json" }: Props) {
  const [rows, setRows] = useState<ResultRow[]>(() => safeParseArray(initialJson));

  useEffect(() => {
    setRows(safeParseArray(initialJson));
  }, [initialJson]);

  const json = useMemo(() => {
    try {
      return JSON.stringify(rows);
    } catch {
      return "[]";
    }
  }, [rows]);

  const labels =
    sportId === "dance"
      ? { title: "Kilpailu", place: "Sijoitus" }
      : { title: "Peli/Tapahtuma", place: "Tulos" };

  function updateRow(idx: number, patch: Partial<ResultRow>) {
    setRows((prev) => {
      const copy = prev.slice();
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  function addRow() {
    setRows((prev) => [...prev, { date: "", title: "", place: "", notes: "" }]);
  }

  function removeRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <input type="hidden" name={name} value={json} />

      {rows.length === 0 ? (
        <div className="fd-muted">Ei tuloksia vielä.</div>
      ) : (
        <div className="fd-list" style={{ gap: 12 }}>
          {rows.map((r, i) => (
            <div key={i} className="fd-card" style={{ padding: 12 }}>
              <div className="fd-row" style={{ marginBottom: 8 }}>
                <input
                  className="input"
                  type="date"
                  value={r.date ?? ""}
                  onChange={(e) => updateRow(i, { date: e.target.value })}
                  disabled={readOnly}
                />
                <input
                  className="input"
                  value={r.title ?? ""}
                  onChange={(e) => updateRow(i, { title: e.target.value })}
                  placeholder={labels.title}
                  disabled={readOnly}
                />
                <input
                  className="input"
                  value={r.place ?? ""}
                  onChange={(e) => updateRow(i, { place: e.target.value })}
                  placeholder={labels.place}
                  disabled={readOnly}
                />
              </div>

              <textarea
                className="input"
                rows={2}
                value={r.notes ?? ""}
                onChange={(e) => updateRow(i, { notes: e.target.value })}
                placeholder="Huomiot"
                disabled={readOnly}
              />

              {!readOnly && (
                <div className="fd-formActions">
                  <button type="button" className="btn btn--danger" onClick={() => removeRow(i)}>
                    Poista rivi
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
        <div className="fd-formActions">
          <button type="button" className="btn btn--secondary" onClick={addRow}>
            + Lisää rivi
          </button>
        </div>
      )}
    </div>
  );
}
