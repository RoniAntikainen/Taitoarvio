import Link from "next/link";
import { auth } from "@/auth";
import StartTrialButton from "@/components/billing/StartTrialButton";
import { getEntitlement } from "@/lib/access";

export const metadata = {
  title: "Hinnoittelu",
  description: "Aloita 30 päivän kokeilu tai osta tilaus.",
};

export default async function PricingPage() {
  const session = await auth();
  const ent = getEntitlement(session);

  return (
    <main id="main-content" style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1>Hinnoittelu</h1>

      <p style={{ marginTop: 8 }}>
        Voit kirjautua ilmaiseksi ilman ostoa. Täysi käyttö avautuu kokeilulla tai tilauksella.
      </p>

      <section style={{ marginTop: 24, padding: 16, borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)" }}>
        <h2>Pro</h2>
        <p style={{ marginTop: 8 }}>
          30 päivän kokeilu (1 kk) ja sen jälkeen kuukausitilaus.
        </p>

        {!session ? (
          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <p>Kirjaudu ensin, jotta voit aloittaa kokeilun.</p>
            <Link href={`/api/auth/signin?callbackUrl=${encodeURIComponent("/pricing")}`}>
              Kirjaudu ja jatka
            </Link>
          </div>
        ) : ent.hasPro ? (
          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <p>
              Sinulla on jo käyttöoikeus: <b>{ent.status}</b>
            </p>
            <Link href="/app">Avaa app</Link>
            <form action="/api/billing/portal" method="post">
              <button type="submit">Hallitse tilausta</button>
            </form>
          </div>
        ) : (
          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <StartTrialButton />
            <p style={{ fontSize: 13, opacity: 0.8 }}>
              Kokeilu aktivoidaan Stripe Checkoutin kautta.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
