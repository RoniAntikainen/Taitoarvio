import Link from "next/link";
import type { ValmentajilleContent } from "@/content/valmentajille";
import shared from "../_styles/marketingPage.module.css";
import styles from "./valmentajille.module.css";
import { KoulutuksetSideNav, type SideSection, type SideCta } from "@/components/nav-sidebar/KoulutuksetSideNav";

const sections = [
  { id: "intro", label: "Yhteenveto" },
  { id: "method", label: "Menetelmä" },
  { id: "webapp", label: "Web App" },
  { id: "refs", label: "Kokemuksia" },
  { id: "fits", label: "Kenelle sopii" },
  { id: "closing", label: "Lopuksi" },
] as const satisfies readonly SideSection[];

const sideCtas = [
  { href: "/ota-yhteytta", label: "Ota yhteyttä", variant: "primary" },
  { href: "/referenssit", label: "Referenssit", variant: "ghost" },
] as const satisfies readonly SideCta[];

export default function ValmentajillePage({ content }: { content: ValmentajilleContent }) {
  const { hero, corePoints, method, webApp, testimonials, howItFits, closing } = content;

  return (
    <main className={shared.page}>
      <div className={shared.bg} aria-hidden="true">
        <div className={shared.layerFar} />
        <div className={shared.layerMid} />
        <div className={shared.layerNear} />
        <div className={shared.noise} />
      </div>

      <div className={shared.shell}>
        <KoulutuksetSideNav title="Valmentajille" sections={sections} ctas={sideCtas} />

        <div className={shared.contentDock}>
          <div className={shared.contentWrap}>
            <div className={shared.content}>
              <section id="intro" className={shared.section} aria-labelledby="hero">
                <div className={shared.heroCard}>
                  <p className={shared.eyebrow}>{hero.kicker}</p>
                  <h1 id="hero" className={shared.h1}>
                    {hero.h1}
                  </h1>
                  <p className={shared.lead}>{hero.lead}</p>

                  <div className={shared.cardGrid3}>
                    {corePoints.map((p) => (
                      <div key={p.title} className={shared.tile}>
                        <b>{p.title}</b>
                        <span>{p.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="method" className={shared.section} aria-labelledby="methodTitle">
                <div className={shared.glass}>
                  <p className={shared.eyebrow}>{method.kicker}</p>
                  <h2 id="methodTitle" className={shared.h2}>
                    {method.title}
                  </h2>
                  <p className={shared.leadSm}>{method.lead}</p>
                  <ul className={shared.bullets}>
                    {method.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="webapp" className={shared.section} aria-labelledby="webappTitle">
                <div className={styles.split}>
                  <div className={shared.glass}>
                    <p className={shared.eyebrow}>{webApp.kicker}</p>
                    <h2 id="webappTitle" className={shared.h2}>
                      {webApp.title}
                    </h2>
                    <p className={shared.leadSm}>{webApp.lead}</p>
                    <ul className={shared.bullets}>
                      {webApp.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <div className={shared.actions}>
                      <Link className={shared.ctaSecondary} href={webApp.link.href}>
                        {webApp.link.label}
                      </Link>
                    </div>
                  </div>

                  <aside className={styles.callout} aria-label="Tiivistelmä">
                    <div className={styles.calloutTitle}>Nopea hyöty</div>
                    <div className={styles.calloutText}>
                      Kun kirjaukset ovat yhdessä paikassa, löydät toistuvat teemat ja päätät nopeammin mihin keskitytään.
                    </div>
                  </aside>
                </div>
              </section>

              <section id="refs" className={shared.section} aria-labelledby="refsTitle">
                <div className={shared.glass}>
                  <p className={shared.eyebrow}>{testimonials.kicker}</p>
                  <h2 id="refsTitle" className={shared.h2}>
                    {testimonials.title}
                  </h2>
                  <p className={shared.leadSm}>{testimonials.lead}</p>

                  <div className={shared.quoteRail} role="list">
                    {testimonials.items.map((t) => (
                      <article key={`${t.author}-${t.role}`} className={shared.quoteCard} role="listitem">
                        <p className={shared.quoteText}>“{t.quote}”</p>
                        <div className={shared.quoteMeta}>
                          <b>{t.author}</b>
                          <span>{t.role}</span>
                        </div>
                      </article>
                    ))}
                  </div>

                  {testimonials.link ? (
                    <div className={shared.actions}>
                      <Link className={shared.textLink} href={testimonials.link.href}>
                        {testimonials.link.label}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </section>

              <section id="fits" className={shared.section} aria-labelledby="fitsTitle">
                <div className={shared.glass}>
                  <p className={shared.eyebrow}>{howItFits.kicker}</p>
                  <h2 id="fitsTitle" className={shared.h2}>
                    {howItFits.title}
                  </h2>

                  <div className={shared.cardGrid3}>
                    {howItFits.items.map((it) => (
                      <div key={it.title} className={shared.tile}>
                        <b>{it.title}</b>
                        <span>{it.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="closing" className={shared.section} aria-labelledby="closingTitle">
                <div className={shared.closing}>
                  <h2 id="closingTitle" className={shared.h2}>
                    {closing.title}
                  </h2>
                  <p className={shared.leadSm}>{closing.lead}</p>

                  <div className={shared.actions}>
                    <Link className={shared.ctaSecondary} href="/ota-yhteytta">
                      Ota yhteyttä
                    </Link>
                    <Link className={shared.textLink} href="/">
                      Takaisin etusivulle
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
