// app/(product)/app/_components/HomeWelcome.tsx
import Link from "next/link";
import Icon from "@/components/icon/Icon";

type Props = {
  user: { name: string | null; email: string };
  counts: { unreadNotifications: number; evaluationsThisWeek: number };
};

export default function HomeWelcome({ user, counts }: Props) {
  const displayName = user.name?.trim() || user.email;

  return (
    <section className="homeHero" aria-label="Tervetuloa">
      <div className="homeHero__inner">
        <div className="homeHero__left">
          <h1 className="homeHero__title">Hei, {displayName} 👋</h1>
          <p className="homeHero__subtitle">
            Tästä näet viimeisimmät arvioinnit ja pääset nopeasti jatkamaan.
          </p>
        </div>

        <div className="homeHero__right">
          <div className="homeHero__chips" aria-label="Pikastatus">
            <div className="homeChip">
              <Icon name="clipboard" className="homeChip__icon" />
              <div className="homeChip__meta">
                <div className="homeChip__value">{counts.evaluationsThisWeek}</div>
                <div className="homeChip__label">arviointia tällä viikolla</div>
              </div>
            </div>

            <Link className="homeChip homeChip--link" href="/app/notifications">
              <Icon name="bell" className="homeChip__icon" />
              <div className="homeChip__meta">
                <div className="homeChip__value">{counts.unreadNotifications}</div>
                <div className="homeChip__label">lukematonta ilmoitusta</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
