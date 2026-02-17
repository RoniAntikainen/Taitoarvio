// app/(product)/app/_components/EmptyState.tsx
import Link from "next/link";
import Icon from "@/components/icon/Icon";

type Props = { hasFolders: boolean; hasEvaluations: boolean };

export default function EmptyState({ hasFolders, hasEvaluations }: Props) {
  if (hasFolders || hasEvaluations) return null;

  return (
    <section className="homeEmpty" aria-label="Aloitus">
      <div className="homeEmpty__icon"><Icon name="plus" /></div>
      <h2 className="homeEmpty__title">Aloitetaan</h2>
      <p className="homeEmpty__text">
        Koti on vielä tyhjä. Luo ensin kansio (esim. oppilaalle/joukkueelle), ja tee sen jälkeen ensimmäinen arviointi.
      </p>

      <ol className="homeSteps">
        <li><strong>Luo kansio</strong> → nimeä oppilas tai ryhmä</li>
        <li><strong>Lisää jäsenet</strong> → kutsu valmentajat / urheilijat</li>
        <li><strong>Tee arviointi</strong> → pisteet + muistiinpanot</li>
      </ol>

      <div className="homeEmpty__actions">
        <Link className="homeBtn" href="/app/folders">Avaa kirjasto</Link>
        <Link className="homeBtn homeBtn--ghost" href="/app/search">Etsi</Link>
      </div>
    </section>
  );
}
