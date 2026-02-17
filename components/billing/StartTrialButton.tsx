"use client";

import { useState } from "react";

export default function StartTrialButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      // If API returned non-JSON (HTML error page, empty, redirect), show it clearly
      if (!contentType.includes("application/json")) {
        if (!res.ok) {
          throw new Error(text || `Checkout failed (${res.status})`);
        }
        throw new Error(
          text
            ? `Unexpected response: ${text.slice(0, 200)}`
            : "Unexpected empty response from server"
        );
      }

      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(data?.error ?? `Checkout failed (${res.status})`);
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Missing checkout URL from server");
    } catch (e: any) {
      setError(e?.message ?? "Virhe");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <button type="button" onClick={start} disabled={loading}>
        {loading ? "Ohjataan Stripeen..." : "Aloita 30 päivän kokeilu"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
