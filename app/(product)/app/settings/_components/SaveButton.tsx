"use client";

import { useFormStatus } from "react-dom";

export default function SaveButton({ label = "Tallenna" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="settingsBtn settingsBtn--primary" disabled={pending}>
      {pending ? "Tallennetaan…" : label}
    </button>
  );
}