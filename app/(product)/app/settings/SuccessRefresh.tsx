"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessRefresh() {
  const router = useRouter();
  const sp = useSearchParams();
  const success = sp.get("success");

  useEffect(() => {
    if (!success) return;
    router.refresh();
    const t = setTimeout(() => router.refresh(), 1200);
    return () => clearTimeout(t);
  }, [success, router]);

  if (!success) return null;
  return <div className="settings-success">Maksu onnistui – päivitetään tilausta…</div>;
}
