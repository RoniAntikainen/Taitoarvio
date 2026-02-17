// app/(product)/app/_components/WeekSummary.tsx
import Icon from "@/components/icon/Icon";

type Props = {
  counts: {
    folders: number;
    unreadNotifications: number;
    evaluationsThisWeek: number;
    evaluationsTotal: number;
  };
  week?: { start: string; end: string }; // <-- week optional, ettei kaadu
};

function fmtRange(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const endShown = new Date(e);
  endShown.setDate(endShown.getDate() - 1);

  const sTxt = s.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  const eTxt = endShown.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" });
  return `${sTxt}–${eTxt}`;
}

export default function WeekSummary({ counts, week }: Props) {
  const range = week ? fmtRange(week.start, week.end) : "—";

  return (
    <section className="homeCard" aria-label="Tämän viikon yhteenveto">
      <header className="homeCard__head">
        <h2 className="homeCard__title">Yhteenveto</h2>
        <p className="homeCard__subtitle">Viikko {range}</p>
      </header>

      <div className="statsGrid">
        <div className="stat">
          <div className="stat__icon"><Icon name="library" /></div>
          <div className="stat__value">{counts.folders}</div>
          <div className="stat__label">kansiota</div>
        </div>

        <div className="stat">
          <div className="stat__icon"><Icon name="clipboard" /></div>
          <div className="stat__value">{counts.evaluationsThisWeek}</div>
          <div className="stat__label">arviointia</div>
        </div>

        <div className="stat">
          <div className="stat__icon"><Icon name="database" /></div>
          <div className="stat__value">{counts.evaluationsTotal}</div>
          <div className="stat__label">yhteensä</div>
        </div>

        <div className="stat">
          <div className="stat__icon"><Icon name="bell" /></div>
          <div className="stat__value">{counts.unreadNotifications}</div>
          <div className="stat__label">lukematonta</div>
        </div>
      </div>

      <p className="homeHint">
        Vinkki: tee arviointi heti treenien jälkeen — lyhyet muistiinpanot ovat usein tarkimpia.
      </p>
    </section>
  );
}
