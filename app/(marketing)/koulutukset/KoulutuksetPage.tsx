import type { KoulutuksetContent } from "@/content/koulutukset";
import shared from "../_styles/marketingPage.module.css";
import styles from "./koulutukset.module.css";
import { KoulutuksetSideNav, type SideSection, type SideCta } from "@/components/nav-sidebar/KoulutuksetSideNav";

const sections = [
  { id: "intro", label: "Yhteenveto" },
  { id: "levels", label: "Tasot" },
  { id: "formats", label: "Muodot" },
  { id: "refs", label: "Palautteet" },
  { id: "start", label: "Aloitus" },
  { id: "links", label: "Linkit" },
] as const satisfies readonly SideSection[];

const sideCtas = [
  { href: "/ota-yhteytta", label: "Ota yhteyttä", variant: "primary" },
  { href: "/referenssit", label: "Referenssit", variant: "ghost" },
] as const satisfies readonly SideCta[];

export default function KoulutuksetPage({ content }: { content: KoulutuksetContent }) {
  const { hero, levels, formats, testimonials, howToStart, links, closing } = content;

  return (
    <main className={shared.page}>
      <div className={shared.bg} aria-hidden="true">
        <div className={shared.layerFar} />
        <div className={shared.layerMid} />
        <div className={shared.layerNear} />
        <div className={shared.noise} />
      </div>

      <div className={shared.shell}>
        <KoulutuksetSideNav title="Koulutukset" sections={sections} ctas={sideCtas} />

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
                </div>
              </section>

              <section id="levels" className={shared.section} aria-labelledby="levelsTitle">
                <div className={shared.glass}>
                  <p className={shared.eyebrow}>{levels.kicker}</p>
                  <h2 id="levelsTitle" className={shared.h2}>
                    {levels.title}
                  </h2>
                  <p className={shared.leadSm}>{levels.lead}</p>

                  <div className={shared.cardGrid3}>
                    {levels.items.map((it) => (
                      <div key={it.title} className={shared.tile}>
                        <b>{it.title}</b>
                        <span>{it.description}</span>
                        {it.duration ? <div className={styles.meta}>{it.duration}</div> : null}
                      </div>
                    ))}
                  </div>

                  <ul className={shared.bullets}>
                    {levels.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="formats" className={shared.section} aria-labelledby="formatsTitle">
                <div className={shared.glass}>
                  <p className={shared.eyebrow}>{formats.kicker}</p>
                  <h2 id="formatsTitle" className={shared.h2}>
                    {formats.title}
                  </h2>
                  <p className={shared.leadSm}>{formats.lead}</p>

                  <div className={shared.cardGrid2}>
                    {formats.items.map((it) => (
                      <div key={it.title} className={shared.tile}>
                        <b>{it.title}</b>
                        <span>{it.description}</span>
                        <ul className={shared.smallList}>
                          {it.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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
                      <a className={shared.textLink} href={testimonials.link.href}>
                        {testimonials.link.label}
                      </a>
                    </div>
                  ) : null}
                </div>
              </section>

              <section id="start" className={shared.section} aria-labelledby="startTitle">
                <div className={shared.glass}>
                  <p className={shared.eyebrow}>{howToStart.kicker}</p>
                  <h2 id="startTitle" className={shared.h2}>
                    {howToStart.title}
                  </h2>

                  <div className={shared.timeline}>
                    {howToStart.steps.map((s, i) => (
                      <div key={s.title} className={shared.step}>
                        <div className={shared.stepIndex}>{String(i + 1).padStart(2, "0")}</div>
                        <div>
                          <b>{s.title}</b>
                          <span>{s.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="links" className={shared.section} aria-labelledby="linksTitle">
                <div className={styles.closing}>
                  <h2 id="linksTitle" className={shared.h2}>
                    {links.title}
                  </h2>

                  <div className={styles.linkGrid}>
                    {links.items.map((l) => (
                      <div key={l.href} className={styles.linkTile}>
                        <a className={shared.ctaSecondary} href={l.href}>
                          {l.label}
                        </a>
                        <div className={styles.ctaNote}>{l.note}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.closingLead}>
                    <p className={shared.leadSm}>{closing.lead}</p>
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
