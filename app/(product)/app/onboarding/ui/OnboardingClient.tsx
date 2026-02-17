"use client";

import { useState } from "react";
import { completeOnboarding } from "@/app/actions/onboarding";

export default function OnboardingClient() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const done = async () => {
    setLoading(true);
    setErr(null);
    try {
      await completeOnboarding();
      window.location.href = "/app";
    } catch (e: any) {
      setErr(e?.message ?? "Virhe");
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
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

      <button
        onClick={done}
        disabled={loading}
        style={{
          border: 0,
          borderRadius: 12,
          padding: "12px 14px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 600,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Tallennetaan..." : "Valmis – siirry sovellukseen"}
      </button>

      <p style={{ fontSize: 13, opacity: 0.8, margin: "6px 0 0" }}>
        Voit muuttaa asetuksia myöhemmin: <b>/app/settings</b>
      </p>
    </div>
  );
}
