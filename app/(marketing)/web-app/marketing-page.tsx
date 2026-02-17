"use client";

import { useEffect, useMemo, useState } from "react";

type Plan = {
  name: string;
  price: string;
  badge?: string;
  points: string[];
  cta: string;
};

const content = {
  nav: {
    brand: "Taitoarvio",
    links: [
      { label: "Ominaisuudet", href: "#features" },
      { label: "Kalenteri", href: "#calendar" },
      { label: "Hinnoittelu", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Kokeile ilmaiseksi", href: "/app" },
  },
  hero: {
    kicker: "Valmennus, joka näkyy kehityksenä.",
    title: "Arvioinnit + tapaamiset yhdessä. Selkeästi.",
    lead:
      "Kirjaa mitä juteltiin, milloin ja miksi. Seuraa kehitystä viikoittain ja tee valmennuksesta järjestelmällistä — ilman Excel-säätöä.",
    bullets: [
      "Oikea kalenteri (kuukausi/viikko/päivä)",
      "Tapaamismuistiinpanot, agenda ja jatkotoimet",
      "Arvioinnit & tulokset samassa kansiossa",
    ],
    ctas: [
      { label: "Aloita nyt", href: "/app", variant: "primary" as const },
      { label: "Katso ominaisuudet", href: "#features", variant: "ghost" as const },
    ],
    trust: ["Nopea", "Tilava UI", "Rakennettu valmentajille"],
  },
  sections: {
    features: {
      title: "Se näyttää siltä kuin se maksaisi paljon. Ja tuntuu siltä.",
      lead:
        "Syy: informaatioarkkitehtuuri on tehty valmentajan työnkulun ympärille. Ei turhia klikkejä.",
      cards: [
        {
          title: "Tapaaminen → muistiinpanot",
          text: "Klikkaa kalenterista ja kirjaa mitä juteltiin. Agenda + muistiinpanot + paikka.",
        },
        {
          title: "Kansiot per urheilija / pari",
          text: "Kaikki samassa: tulevat kisat, tulokset, arvioinnit ja tapaamiset.",
        },
        {
          title: "Selkeä kehitys",
          text: "Arvioi osa-alueet ja näe kokonaiskuva. Oikeasti hyödyllinen yhteenveto.",
        },
        {
          title: "Nopeus & luotettavuus",
          text: "Kevyt UI, nopea käyttö. Ei “käynnistellään 5 sekuntia” -fiilistä.",
        },
      ],
    },
    calendar: {
      title: "Kalenteri, joka toimii kuten kalenteri.",
      lead:
        "Kuukausi/viikko/päivä. Valitse alue → uusi tapaaminen. Klikkaa tapahtumaa → muokkaa sisältö.",
      stats: [
        { k: "3", v: "näkymää" },
        { k: "1", v: "klikkaus muokkaus" },
        { k: "0", v: "turhaa säätöä" },
      ],
    },
    pricing: {
      title: "Hinnoittelu",
      lead: "Aloita kevyesti. Päivitä kun tarvitset enemmän.",
      plans: [
        {
          name: "Starter",
          price: "0 €",
          points: [
            "Peruskansiot",
            "Kalenteri + tapaamiset",
            "Arvioinnit",
            "Rajattu määrä sisältöä",
          ],
          cta: "Aloita ilmaiseksi",
        },
        {
          name: "Pro",
          price: "19 € / kk",
          badge: "Suosituin",
          points: [
            "Rajattomasti kansioita",
            "Täysi historia & export",
            "Edistyneet analytiikat",
            "Tuki ja prioriteetti",
          ],
          cta: "Ota Pro",
        },
        {
          name: "Club",
          price: "99 € / kk",
          points: [
            "Seurataso / tiimit",
            "Roolit ja käyttöoikeudet",
            "Raportointi",
            "Onboarding",
          ],
          cta: "Kysy tarjousta",
        },
      ] as Plan[],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Mihin tämä sopii?",
          a: "Valmennukseen, jossa haluat seurata tapaamisia + kehitystä samassa paikassa: tanssi, joukkueurheilu, yksilölajit.",
        },
        {
          q: "Voinko käyttää tätä pelkkänä tapaamispäiväkirjana?",
          a: "Kyllä. Mutta vahvuus on, että tapaamiset linkittyy kansioon, jossa on myös tulokset ja arvioinnit.",
        },
        {
          q: "Onko tämä nopea?",
          a: "Tavoite on, että saat kirjauksen tehtyä minuutissa. Tilava UI + minimaaliset vaiheet.",
        },
      ],
    },
  },
};

function cx(...s: Array<string | false | undefined | null>) {
  return s.filter(Boolean).join(" ");
}

export default function MarketingPage() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="mkt-root">
      {/* Background video layer */}
      <div className="mkt-bg" aria-hidden="true">
        <video
          className="mkt-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/marketing/poster.jpg"
        >
          {/* Suosittelen .webm + .mp4 fallback */}
          <source src="@/marketing/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <div className="mkt-vignette" />
        <div className="mkt-grain" />
      </div>

      {/* Hero */}
      <main className="mkt-main">
        <section className="mkt-hero">
          <div className="mkt-container mkt-hero__grid">
            <div className="mkt-hero__copy">
              <div className="mkt-kicker">{content.hero.kicker}</div>
              <h1 className="mkt-h1">{content.hero.title}</h1>
              <p className="mkt-lead">{content.hero.lead}</p>

              <ul className="mkt-bullets">
                {content.hero.bullets.map((b) => (
                  <li key={b} className="mkt-bullet">
                    <span className="mkt-check" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mkt-ctaRow">
                {content.hero.ctas.map((c) => (
                  <a
                    key={c.href}
                    className={cx(
                      "mkt-btn",
                      c.variant === "primary" && "mkt-btn--primary",
                      c.variant === "ghost" && "mkt-btn--ghost"
                    )}
                    href={c.href}
                  >
                    {c.label}
                  </a>
                ))}
              </div>

              <div className="mkt-trust">
                {content.hero.trust.map((t) => (
                  <div key={t} className="mkt-pill">
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: “premium” product mock */}
            <div className={cx("mkt-hero__mock", !reducedMotion && "mkt-float")}>
              <div className="mkt-glassCard">
                <div className="mkt-glassTop">
                  <div className="mkt-glassTitle">Kalenteri</div>
                  <div className="mkt-glassMeta">Viikko · 2 tapaamista</div>
                </div>
                <div className="mkt-glassBody">
                  <div className="mkt-miniEvent">
                    <div className="mkt-miniTime">Ma 18:00</div>
                    <div className="mkt-miniText">
                      Treenit · Pekka
                      <div className="mkt-miniSub">Agenda + muistiinpanot</div>
                    </div>
                  </div>
                  <div className="mkt-miniEvent">
                    <div className="mkt-miniTime">Ke 19:30</div>
                    <div className="mkt-miniText">
                      Valmennuspalaveri · Pari A
                      <div className="mkt-miniSub">Jatkotoimet yhdellä klikillä</div>
                    </div>
                  </div>

                  <div className="mkt-divider" />

                  <div className="mkt-miniPanel">
                    <div className="mkt-miniPanel__title">Mitä juteltiin</div>
                    <div className="mkt-miniPanel__text">
                      “Tekniikka: linjaus + rytmi. Tavoite: 2 asiaa per treeni. Seuraavaan
                      kertaan: video + palautteet.”
                    </div>
                  </div>
                </div>
              </div>

              <div className="mkt-glow" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mkt-section">
          <div className="mkt-container">
            <div className="mkt-sectionHead">
              <h2 className="mkt-h2">{content.sections.features.title}</h2>
              <p className="mkt-lead">{content.sections.features.lead}</p>
            </div>

            <div className="mkt-grid4">
              {content.sections.features.cards.map((c) => (
                <article key={c.title} className="mkt-card">
                  <h3 className="mkt-h3">{c.title}</h3>
                  <p className="mkt-p">{c.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Calendar section */}
        <section id="calendar" className="mkt-section mkt-section--alt">
          <div className="mkt-container mkt-split">
            <div>
              <h2 className="mkt-h2">{content.sections.calendar.title}</h2>
              <p className="mkt-lead">{content.sections.calendar.lead}</p>

              <div className="mkt-stats">
                {content.sections.calendar.stats.map((s) => (
                  <div key={s.k} className="mkt-stat">
                    <div className="mkt-stat__k">{s.k}</div>
                    <div className="mkt-stat__v">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="mkt-ctaRow">
                <a className="mkt-btn mkt-btn--primary" href="/app">
                  Avaa sovellus
                </a>
                <a className="mkt-btn mkt-btn--ghost" href="#pricing">
                  Katso hinnat
                </a>
              </div>
            </div>

            <div className="mkt-frame">
              <div className="mkt-frame__bar">
                <div className="mkt-dot mkt-dot--r" />
                <div className="mkt-dot mkt-dot--y" />
                <div className="mkt-dot mkt-dot--g" />
                <div className="mkt-frame__title">Tapaaminen · Muokkaus</div>
              </div>
              <div className="mkt-frame__body">
                <div className="mkt-formRow">
                  <div className="mkt-input">
                    <div className="mkt-label">Otsikko</div>
                    <div className="mkt-value">Treenit · Pekka</div>
                  </div>
                  <div className="mkt-input">
                    <div className="mkt-label">Paikka</div>
                    <div className="mkt-value">Sali 2</div>
                  </div>
                </div>
                <div className="mkt-input">
                  <div className="mkt-label">Mitä juteltiin</div>
                  <div className="mkt-value">
                    Linjaus + rytmi. Jatkotoimet: video + palaute. Seuraavaan: 2 focus-asiaa.
                  </div>
                </div>
                <div className="mkt-frame__hint">
                  Klikkaa tapahtumaa → kirjaa sisältö. Näin valmennus muuttuu näkyväksi.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mkt-section">
          <div className="mkt-container">
            <div className="mkt-sectionHead">
              <h2 className="mkt-h2">{content.sections.pricing.title}</h2>
              <p className="mkt-lead">{content.sections.pricing.lead}</p>
            </div>

            <div className="mkt-grid3">
              {content.sections.pricing.plans.map((p) => (
                <article key={p.name} className={cx("mkt-plan", p.badge && "mkt-plan--featured")}>
                  <div className="mkt-plan__top">
                    <div className="mkt-plan__name">
                      {p.name}
                      {p.badge ? <span className="mkt-badge">{p.badge}</span> : null}
                    </div>
                    <div className="mkt-plan__price">{p.price}</div>
                  </div>

                  <ul className="mkt-plan__list">
                    {p.points.map((x) => (
                      <li key={x} className="mkt-plan__item">
                        <span className="mkt-check" aria-hidden="true" />
                        {x}
                      </li>
                    ))}
                  </ul>

                  <a className={cx("mkt-btn", p.badge ? "mkt-btn--primary" : "mkt-btn--ghost")} href="/app">
                    {p.cta}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mkt-section mkt-section--alt">
          <div className="mkt-container">
            <div className="mkt-sectionHead">
              <h2 className="mkt-h2">{content.sections.faq.title}</h2>
            </div>

            <div className="mkt-faq">
              {content.sections.faq.items.map((i) => (
                <details key={i.q} className="mkt-faqItem">
                  <summary className="mkt-faqQ">{i.q}</summary>
                  <div className="mkt-faqA">{i.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mkt-section mkt-section--cta">
          <div className="mkt-container">
            <div className="mkt-ctaCard">
              <div>
                <h2 className="mkt-h2">Haluatko että valmennus ei katoa keskusteluihin?</h2>
                <p className="mkt-lead">
                  Aloita tapaamisista. Lisää arvioinnit kun haluat syventää.
                </p>
              </div>
              <a className="mkt-btn mkt-btn--primary" href="/app">
                Kokeile ilmaiseksi
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mkt-footer">
        <div className="mkt-container mkt-footer__inner">
          <div className="mkt-muted">© {year} {content.nav.brand}</div>
          <div className="mkt-footer__links">
            <a className="mkt-link" href="#pricing">Hinnoittelu</a>
            <a className="mkt-link" href="#faq">FAQ</a>
            <a className="mkt-link" href="/app">Sovellus</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
