"use client";

import { useState, useTransition } from "react";
import { createFolder } from "@/app/actions/folders";

export default function CreateFolderForm() {
  const [name, setName] = useState("");
  const [athleteName, setAthleteName] = useState("");
  const [sportId, setSportId] = useState<"football" | "dance">("football");
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    startTransition(async () => {
      const res = await createFolder(name, sportId, athleteName);
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      // reset + reload list
      setName("");
      setAthleteName("");
      window.location.reload();
    });
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
      {err ? (
        <div
          style={{
            border: "1px solid rgba(255,0,0,0.25)",
            background: "rgba(255,0,0,0.06)",
            borderRadius: 12,
            padding: "10px 12px",
          }}
        >
          {err}
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 700 }}>Kansion nimi</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Esim. Kevät 2026"
          style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)" }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 700 }}>Laji</label>
        <select
          value={sportId}
          onChange={(e) => setSportId(e.target.value as any)}
          style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)" }}
        >
          <option value="football">Football</option>
          <option value="dance">Dance</option>
        </select>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 700 }}>Urheilija (valinnainen)</label>
        <input
          value={athleteName}
          onChange={(e) => setAthleteName(e.target.value)}
          placeholder="Nimi"
          style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)" }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !name.trim()}
        style={{
          border: 0,
          borderRadius: 12,
          padding: "10px 12px",
          fontWeight: 800,
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? "Luodaan..." : "Luo kansio"}
      </button>
    </form>
  );
}
      