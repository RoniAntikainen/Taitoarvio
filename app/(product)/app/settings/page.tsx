// app/(product)/app/settings/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import SubscriptionCard from "@/components/billing/SubscriptionCard";
import SuccessRefresh from "./SuccessRefresh";

import { getMySettings } from "@/app/actions/settings";
import SettingsForm from "./_components/SettingsForm";

import "./settings.css";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Asetukset",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/app/settings");
  }

  // SubscriptionCard odottaa "sub" (sun projektissa sessioniin on joskus liitetty subscription)
  const sub = (session as any)?.subscription ?? { status: "FREE" };

  // ✅ hae user settings serveriltä (luo rivin jos puuttuu)
  const settings = await getMySettings();

  return (
    <div className="settingsPage">
      <header className="settingsHeader">
        <div className="settingsHeader__title">
          <h1 className="settingsH1">Asetukset</h1>
          <p className="settingsLead">
            Hallinnoi tilausta, oletuksia, ilmoituksia ja tietosuojaa.
          </p>
        </div>
      </header>

      <SuccessRefresh />

      <section className="settingsCard">
        <header className="settingsCard__head">
          <h2 className="settingsCard__title">Tilaukset</h2>
          <p className="settingsCard__sub">
            Kokeilu, tilaus ja laskutusportaalin hallinta.
          </p>
        </header>
        <div className="settingsCard__body">
          <SubscriptionCard sub={sub} />
        </div>
      </section>

      <section className="settingsCard">
        <header className="settingsCard__head">
          <h2 className="settingsCard__title">Käyttäjä</h2>
          <p className="settingsCard__sub">Perustiedot tilistäsi.</p>
        </header>

        <div className="settingsKeyValue">
          <div className="settingsKV">
            <div className="settingsKV__k">Nimi</div>
            <div className="settingsKV__v">{session.user?.name ?? "–"}</div>
          </div>
          <div className="settingsKV">
            <div className="settingsKV__k">Sähköposti</div>
            <div className="settingsKV__v">{session.user?.email ?? "–"}</div>
          </div>
        </div>
      </section>

      {/* ✅ TÄÄ ON SE: käytetään componenttia */}
      <SettingsForm initial={settings} />
    </div>
  );
}