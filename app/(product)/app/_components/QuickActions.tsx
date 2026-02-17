// app/(product)/app/_components/QuickActions.tsx
import Link from "next/link";
import Icon from "@/components/icon/Icon";

type Action = {
  title: string;
  description: string;
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
};

const actions: Action[] = [
  { title: "Kirjasto", description: "Avaa kansiot ja sisältö", href: "/app/folders", icon: "library" },
  { title: "Haku", description: "Etsi kansioita ja arviointeja", href: "/app/search", icon: "search" },
  { title: "Ilmoitukset", description: "Katso uudet tapahtumat", href: "/app/notifications", icon: "bell" },
  { title: "Asetukset", description: "Tilin ja sovelluksen asetukset", href: "/app/settings", icon: "settings" },
];

export default function QuickActions() {
  return (
    <section className="homeCard" aria-label="Pikatoiminnot">
      <header className="homeCard__head">
        <h2 className="homeCard__title">Pikatoiminnot</h2>
        <p className="homeCard__subtitle">Mitä haluat tehdä seuraavaksi?</p>
      </header>

      <div className="qaGrid">
        {actions.map((a) => (
          <Link key={a.href} className="qaItem" href={a.href}>
            <div className="qaItem__icon"><Icon name={a.icon} /></div>
            <div className="qaItem__text">
              <div className="qaItem__title">{a.title}</div>
              <div className="qaItem__desc">{a.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
