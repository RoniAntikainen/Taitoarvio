// app/(product)/app/_components/RecentEvaluations.tsx
import Link from "next/link";
import Icon from "@/components/icon/Icon";
import type { RecentEvaluation } from "@/app/actions/home";

type Props = { items: RecentEvaluation[] };

function fmt(dtIso: string) {
  const d = new Date(dtIso);
  return d.toLocaleString("fi-FI", { dateStyle: "short", timeStyle: "short" });
}

export default function RecentEvaluations({ items }: Props) {
  return (
    <section className="homeCard" aria-label="Viimeisimmät arvioinnit">
      <header className="homeCard__head homeCard__head--row">
        <div>
          <h2 className="homeCard__title">Viimeisimmät arvioinnit</h2>
          <p className="homeCard__subtitle">Uusimmat 5 arviointia, joihin sinulla on pääsy.</p>
        </div>

        <Link className="homeLink" href="/app/folders">
          <Icon name="library" /> Kaikki kansiot
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="homeEmptyMini">
          <div className="homeEmptyMini__title">Ei arviointeja vielä.</div>
          <div className="homeEmptyMini__text">
            Luo kansio ja tee ensimmäinen arviointi kansiossa.
          </div>
          <Link className="homeBtn" href="/app/folders">Avaa kirjasto</Link>
        </div>
      ) : (
        <div className="recentList">
          {items.map((e) => (
            <Link key={e.id} className="recentItem" href={`/app/folders/${e.folderId}`}>
              <div className="recentItem__main">
                <div className="recentItem__title">{e.subject}</div>
                <div className="recentItem__meta">
                  <span>{e.sportLabel}</span>
                  <span className="recentDot">·</span>
                  <span>{e.evaluator}</span>
                </div>
              </div>

              <div className="recentItem__aside">
                <div className="recentItem__folder">{e.folderName}</div>
                <div className="recentItem__time">{fmt(e.createdAt)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
