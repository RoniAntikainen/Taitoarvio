// app/(product)/app/settings/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SubscriptionCard from "@/components/billing/SubscriptionCard";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Asetukset",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/app/settings");

  const sub = (session as any)?.subscription ?? { status: "FREE" };

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px", display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0, fontSize: 24 }}>Asetukset</h1>

      <SubscriptionCard sub={sub} />

      <section style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 16, padding: 16 }}>
        <div style={{ fontWeight: 800 }}>Käyttäjä</div>
        <div style={{ marginTop: 6, opacity: 0.85 }}>
          {session.user?.name ? <div>{session.user.name}</div> : null}
          <div>{session.user?.email}</div>
        </div>
      </section>
    </main>
  );
}
