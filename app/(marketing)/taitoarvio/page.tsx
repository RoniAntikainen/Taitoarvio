import Link from "next/link";

export default function MarketingTaitoarvio() {
  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Taitoarvio</h1>
      <p style={{ marginTop: 12, opacity: 0.8 }}>
        Tämä on julkinen SEO-puoli. Appi löytyy /app.
      </p>
      <div style={{ marginTop: 16 }}>
        <Link href="/app">Avaa appi</Link>
      </div>
    </main>
  );
}
