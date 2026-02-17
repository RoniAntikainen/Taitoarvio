"use client";

import { useState } from "react";

export default function MarketingConsentToggle({
  initialConsent,
}: {
  initialConsent: boolean;
}) {
  const [consent, setConsent] = useState(initialConsent);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const toggle = async () => {
    const next = !consent;
    setConsent(next);
    setSaving(true);
    setMsg(null);

    const res = await fetch("/api/me/marketing-consent", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ marketingConsent: next }),
    });

    const data = await res.json().catch(() => null);
    setSaving(false);

    if (!res.ok) {
      setConsent(!next);
      setMsg(data?.error ?? "Tallennus epäonnistui");
      return;
    }

    setMsg(next ? "Suostumus tallennettu." : "Suostumus poistettu.");
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input type="checkbox" checked={consent} onChange={toggle} disabled={saving} />
        Haluan vastaanottaa uutisia ja tarjouksia sähköpostitse
      </label>

      {msg && <p style={{ fontSize: 13, opacity: 0.85 }}>{msg}</p>}
    </div>
  );
}
