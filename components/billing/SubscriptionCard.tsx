// components/billing/SubscriptionCard.tsx
"use client";

import { useState } from "react";

type Sub = {
  status?: string;
  trialEndsAt?: string | Date | null;
  currentPeriodEnd?: string | Date | null;
  cancelAtPeriodEnd?: boolean;
};

function fmt(d?: string | Date | null) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("fi-FI");
}

function statusLabel(status?: string) {
  switch (status) {
    case "TRIAL":
      return "Kokeilu käynnissä";
    case "ACTIVE":
      return "Aktiivinen";
    case "PAST_DUE":
      return "Maksu myöhässä";
    case "CANCELED":
      return "Peruttu";
    default:
      return "Ilmainen";
  }
}

function statusHint(sub: Sub) {
  const st = sub.status ?? "FREE";
  if (st === "TRIAL") return `Kokeilu päättyy: ${fmt(sub.trialEndsAt)}`;
  if (st === "ACTIVE" && sub.cancelAtPeriodEnd) return `Päättyy kauden lopussa: ${fmt(sub.currentPeriodEnd)}`;
  if (st === "ACTIVE") return `Uusitaan: ${fmt(sub.currentPeriodEnd)}`;
  if (st === "PAST_DUE") return "Tarkista maksutapa ja suorita maksu.";
  if (st === "CANCELED") return "Voit aktivoida tilauksen uudelleen.";
  return "FREE: 1 kansio + 10 arviointia / kansio. Päivitä PRO:hon avataksesi rajattoman käytön.";
}

async function postAndRedirect(path: string) {
  const res = await fetch(path, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  const url = data?.url;

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed: ${res.status}`);
  }
  if (!url) {
    throw new Error("Stripe URL puuttuu (endpoint ei palauta {url}).");
  }
  window.location.href = url;
}

export default function SubscriptionCard({ sub }: { sub: Sub }) {
  const [loading, setLoading] = useState<null | "checkout" | "portal">(null);
  const [err, setErr] = useState<string | null>(null);

  const status = sub.status ?? "FREE";
  const pro = status === "TRIAL" || status === "ACTIVE";

  const onCheckout = async () => {
    setErr(null);
    setLoading("checkout");
    try {
      await postAndRedirect("/api/billing/checkout");
    } catch (e: any) {
      setErr(e?.message ?? "Virhe");
      setLoading(null);
    }
  };

  const onPortal = async () => {
    setErr(null);
    setLoading("portal");
    try {
      await postAndRedirect("/api/billing/portal");
    } catch (e: any) {
      setErr(e?.message ?? "Virhe");
      setLoading(null);
    }
  };

  return (
    <section
      style={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Tilaus</div>
        <div style={{ opacity: 0.9 }}>
          <b>{statusLabel(status)}</b>
          <span style={{ marginLeft: 10, opacity: 0.75 }}>{statusHint(sub)}</span>
        </div>
      </div>

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

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {!pro ? (
          <button
            onClick={onCheckout}
            disabled={loading !== null}
            style={{
              border: 0,
              borderRadius: 12,
              padding: "10px 12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading === "checkout" ? "Avataan checkout..." : "Päivitä PRO:hon"}
          </button>
        ) : (
          <button
            onClick={onPortal}
            disabled={loading !== null}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              padding: "10px 12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              background: "transparent",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading === "portal" ? "Avataan portaali..." : "Hallitse tilausta"}
          </button>
        )}
      </div>
    </section>
  );
}
