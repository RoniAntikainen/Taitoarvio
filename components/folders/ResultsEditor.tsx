"use client";

import { useMemo, useState } from "react";

type SportId = "football" | "dance";

type FootballRow = {
  date: string;
  opponent: string;
  homeAway: "Koti" | "Vieras";
  scoreFor: string;
  scoreAgainst: string;
  role: string;
  notes: string;
};

type DanceRow = {
  date: string;
  event: string;
  category: string;
  placement: string;
  notes: string;
};

function safeParse<T>(s: string, fallback: T): T {
  try {
    const v = JSON.parse(s);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export default function ResultsEditor({
  sportId,
  initialJson,
  readOnly,
}: {
  sportId: SportId;
  initialJson: string;
  readOnly: boolean;
}) {
  const initial = useMemo(() => {
    if (sportId === "dance") return safeParse<DanceRow[]>(initialJson || "[]", []);
    return safeParse<FootballRow[]>(initialJson || "[]", []);
  }, [sportId, initialJson]);

  const [rows, setRows] = useState<any[]>(initial);

  const addRow = () => {
    setRows((r) => {
      if (sportId === "dance") {
        return [...r, { date: "", event: "", category: "", placement: "", notes: "" } satisfies DanceRow];
      }
      return [
        ...r,
        {
          date: "",
          opponent: "",
          homeAway: "Koti",
          scoreFor: "",
          scoreAgainst: "",
          role: "",
          notes: "",
        } satisfies FootballRow,
      ];
    });
  };

  const removeRow = (idx: number) => setRows((r) => r.filter((_: any, i: number) => i !== idx));

  const setCell = (idx: number, key: string, value: string) => {
    setRows((r) => r.map((row: any, i: number) => (i === idx ? { ...row, [key]: value } : row)));
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <input type="hidden" name="resultsJson" value={JSON.stringify(rows)} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Lisää rivejä ja tallenna.</div>
        {!readOnly ? (
          <button type="button" onClick={addRow} style={{ padding: "10px 12px", borderRadius: 12 }}>
            + Lisää rivi
          </button>
        ) : null}
      </div>

      {rows.length === 0 ? <div style={{ opacity: 0.7 }}>Ei tuloksia vielä.</div> : null}

      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((row: any, idx: number) => (
          <div
            key={idx}
            style={{
              padding: 12,
              borderRadius: 16,
              background: "rgba(0,0,0,.04)",
              display: "grid",
              gap: 10,
            }}
          >
            {sportId === "dance" ? (
              <>
                <Grid2>
                  <Field label="Päivä" value={row.date} onChange={(v) => setCell(idx, "date", v)} readOnly={readOnly} />
                  <Field
                    label="Kilpailu"
                    value={row.event}
                    onChange={(v) => setCell(idx, "event", v)}
                    readOnly={readOnly}
                  />
                </Grid2>

                <Grid2>
                  <Field
                    label="Luokka"
                    value={row.category}
                    onChange={(v) => setCell(idx, "category", v)}
                    readOnly={readOnly}
                  />
                  <Field
                    label="Sijoitus"
                    value={row.placement}
                    onChange={(v) => setCell(idx, "placement", v)}
                    readOnly={readOnly}
                  />
                </Grid2>

                <Field label="Huomiot" value={row.notes} onChange={(v) => setCell(idx, "notes", v)} readOnly={readOnly} />
              </>
            ) : (
              <>
                <Grid2>
                  <Field
                    label="Päivä"
                    value={row.date}
                    onChange={(v) => setCell(idx, "date", v)}
                    readOnly={readOnly}
                  />
                  <Field
                    label="Vastustaja"
                    value={row.opponent}
                    onChange={(v) => setCell(idx, "opponent", v)}
                    readOnly={readOnly}
                  />
                </Grid2>

                <Grid2>
                  <Select
                    label="Koti/Vieras"
                    value={row.homeAway}
                    options={["Koti", "Vieras"]}
                    onChange={(v) => setCell(idx, "homeAway", v)}
                    readOnly={readOnly}
                  />
                  <Field
                    label="Rooli / minuutit"
                    value={row.role}
                    onChange={(v) => setCell(idx, "role", v)}
                    readOnly={readOnly}
                  />
                </Grid2>

                <Grid2>
                  <Field
                    label="Omat"
                    value={row.scoreFor}
                    onChange={(v) => setCell(idx, "scoreFor", v)}
                    readOnly={readOnly}
                  />
                  <Field
                    label="Vastustaja"
                    value={row.scoreAgainst}
                    onChange={(v) => setCell(idx, "scoreAgainst", v)}
                    readOnly={readOnly}
                  />
                </Grid2>

                <Field label="Huomiot" value={row.notes} onChange={(v) => setCell(idx, "notes", v)} readOnly={readOnly} />
              </>
            )}

            {!readOnly ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => removeRow(idx)} style={{ padding: "8px 10px", borderRadius: 12 }}>
                  Poista rivi
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Grid2({ children }: { children: any }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, opacity: 0.75 }}>{label}</div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,.15)" }}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  readOnly: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, opacity: 0.75 }}>{label}</div>
      <select
        value={value || options[0]}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        style={{ padding: 10, borderRadius: 12 }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
