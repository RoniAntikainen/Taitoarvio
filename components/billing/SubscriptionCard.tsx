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
  if (st === "ACTIVE" && sub.cancelAtPeriodEnd)
    return `Päättyy kauden lopussa: ${fmt(sub.currentPeriodEnd)}`;
  if (st === "ACTIVE")
    return `Uusitaan: ${fmt(sub.currentPeriodEnd)}`;
  if (st === "PAST_DUE")
    return "Tarkista maksutapa ja suorita maksu.";
  if (st === "CANCELED")
    return "Voit aktivoida tilauksen uudelleen.";
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
    <section className="billing-card">
      <div className="billing-card__header">
        <div className="billing-card__title">Tilaus</div>

        <div className="billing-card__status">
          <b className="billing-card__status-label">
            {statusLabel(status)}
          </b>
          <span className="billing-card__status-hint">
            {statusHint(sub)}
          </span>
        </div>
      </div>

      {err && (
        <div className="billing-card__error">
          {err}
        </div>
      )}

      <div className="billing-card__actions">
        {!pro ? (
          <button
            className="billing-card__button billing-card__button--primary"
            onClick={onCheckout}
            disabled={loading !== null}
          >
            {loading === "checkout"
              ? "Avataan checkout..."
              : "Päivitä PRO:hon"}
          </button>
        ) : (
          <button
            className="billing-card__button billing-card__button--secondary"
            onClick={onPortal}
            disabled={loading !== null}
          >
            {loading === "portal"
              ? "Avataan portaali..."
              : "Hallitse tilausta"}
          </button>
        )}
      </div>
    </section>
  );
}