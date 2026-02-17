// app/(product)/app/onboarding/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEntitlement } from "@/lib/access";
import { getOnboardingState } from "@/app/actions/onboarding";
import OnboardingClient from "./ui/OnboardingClient";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Aloitus",
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/app/onboarding");

  const ent = getEntitlement(session);
  if (!ent.hasPro) redirect("/app/settings"); // tai /pricing

  const state = await getOnboardingState();
  if (state.completed) redirect("/app");

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
      <div
        style={{
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 20,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 style={{ fontSize: 26, margin: 0 }}>Tervetuloa 👋</h1>
        <p style={{ marginTop: 10, opacity: 0.85, lineHeight: 1.5 }}>
          Tehdään nopea aloitus, jotta sovellus osaa ohjata sinut oikeaan paikkaan.
        </p>

        <OnboardingClient />
      </div>
    </main>
  );
}
