import styles from "./marketing.module.css";

export default function Page() {
  return (
    <div className={styles.mktRoot} data-scope="marketing">
      <div className={styles.mktBg} aria-hidden="true">
        <video
          className={styles.mktVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/poster.jpg"
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <div className={styles.mktOverlay} />
      </div>

      {/* ✅ TÄNNE sun nykyinen sivun sisältö (ei header/footer lisäyksiä) */}
      <div className={styles.mktContent}>
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.hero}>
                <div className={styles.kicker}>Taitoarvio</div>
                <h1 className={styles.h1}>Kalenteri + muistiinpanot, jotka ei katoa.</h1>
                <p className={styles.lead}>
                    Tee tapaamisista oikeasti hyödyllisiä. Klikkaa tapahtumaa, kirjaa mitä juteltiin,
                    sovitut jatkotoimet ja seuraava fokus. Kaikki linkittyy suoraan henkilön/parin kansioon.
                </p>

                <div className={styles.ctaRow}>
                    <a className={styles.btnPrimary} href="/app">Aloita nyt</a>
                    <a className={styles.btnGhost} href="#features">Katso ominaisuudet</a>
                </div>

                <div className={styles.pills}>
                    <span className={styles.pill}>Nopea kirjata</span>
                    <span className={styles.pill}>Tilava UI</span>
                    <span className={styles.pill}>Selkeä historia</span>
                </div>
                </div>

                <div className={styles.heroGrid}>
                <div className={styles.glassCard}>
                    <div className={styles.glassTop}>
                    <div className={styles.glassTitle}>Tapaaminen</div>
                    <div className={styles.glassMeta}>Esimerkki</div>
                    </div>

                    <div className={styles.glassBody}>
                    <div className={styles.eventRow}>
                        <div className={styles.eventTime}>Ma 18:00</div>
                        <div className={styles.eventMain}>
                        <div className={styles.eventTitle}>Treenit · Pekka</div>
                        <div className={styles.eventSub}>Agenda + muistiinpanot + paikka</div>
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.noteBox}>
                        <div className={styles.noteTitle}>Mitä juteltiin</div>
                        <div className={styles.noteText}>
                        “Tekniikka: linjaus + rytmi. Tavoite: 2 fokusta per treeni. Seuraavaan:
                        video + palaute. Jatkotoimet kirjattu.”
                        </div>
                    </div>
                    </div>
                </div>

                <div className={styles.miniGrid}>
                    <div className={styles.card}>
                    <div className={styles.cardTitle}>Kalenteri</div>
                    <div className={styles.cardText}>
                        Kuukausi / viikko / päivä. Vedä aika-alue → uusi tapaaminen.
                        Klikkaa tapahtumaa → muokkaa sisältö.
                    </div>
                    </div>

                    <div className={styles.card}>
                    <div className={styles.cardTitle}>Kansiot</div>
                    <div className={styles.cardText}>
                        Urheilija / pari / tiimi: tapaamiset, tulokset ja arvioinnit samassa.
                        Ei enää sirpaleista dataa.
                    </div>
                    </div>

                    <div className={styles.card}>
                    <div className={styles.cardTitle}>Yhteenveto</div>
                    <div className={styles.cardText}>
                        Näet kehityksen trendin. Mitä sovittiin, mitä tehtiin, mikä muuttui.
                        Helppo palata taaksepäin.
                    </div>
                    </div>

                    <div className={styles.card}>
                    <div className={styles.cardTitle}>Premium UX</div>
                    <div className={styles.cardText}>
                        Tilava, rauhallinen ja nopea. Vähemmän “dashboard-ähkyä”, enemmän selkeyttä.
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            <section id="features" className={styles.sectionAlt}>
            <div className={styles.container}>
                <div className={styles.sectionHead}>
                <h2 className={styles.h2}>Ominaisuudet</h2>
                <p className={styles.leadSm}>
                    Tavoite: 1 minuutti per kirjaus. Kaikki tallessa, myöhemmin helppo hakea.
                </p>
                </div>

                <div className={styles.grid4}>
                {[
                    ["Tapaamisten muistiinpanot", "Kirjaa mitä juteltiin, agenda, jatkotoimet, paikka ja liitteet."],
                    ["Linkitys kansioihin", "Tapaamiset näkyy henkilön/parin kansiossa automaattisesti."],
                    ["Hakutoiminnot", "Hae nimellä, tagilla tai avainsanoilla muistiinpanoista."],
                    ["Aikajana", "Näe kaikki tapaamiset ja päätökset aikajärjestyksessä."],
                ].map(([t, d]) => (
                    <div key={t} className={styles.feature}>
                    <div className={styles.featureTitle}>{t}</div>
                    <div className={styles.featureText}>{d}</div>
                    </div>
                ))}
                </div>
            </div>
            </section>

            <section id="calendar" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.split}>
                <div>
                    <h2 className={styles.h2}>Kalenteri, joka on oikeasti käyttöliittymä</h2>
                    <p className={styles.leadSm}>
                    Kalenteri ei ole vain “päiväkirja” — se on nopein tapa luoda ja avata keskustelu.
                    Kun klikkaat tapahtumaa, muokkaus aukeaa heti.
                    </p>

                    <ul className={styles.bullets}>
                    <li>Vedä ja luo tapaaminen</li>
                    <li>Klikkaa ja muokkaa sisältö</li>
                    <li>Lisää tagit ja seuraavat stepit</li>
                    </ul>

                    <div className={styles.ctaRow}>
                    <a className={styles.btnPrimary} href="/app/calendar">Avaa kalenteri</a>
                    <a className={styles.btnGhost} href="/app">Avaa sovellus</a>
                    </div>
                </div>

                <div className={styles.frame}>
                    <div className={styles.frameHeader}>Tapaaminen · Muokkaus</div>
                    <div className={styles.frameBody}>
                    <div className={styles.field}>
                        <div className={styles.label}>Otsikko</div>
                        <div className={styles.value}>Treenit · Pekka</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Paikka</div>
                        <div className={styles.value}>Sali 2</div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.label}>Mitä juteltiin</div>
                        <div className={styles.value}>
                        Linjaus + rytmi. Sovittu fokus: 2 asiaa / treeni. Jatkotoimet: video + palaute.
                        </div>
                    </div>
                    <div className={styles.hint}>Tallennus yhdellä napilla. Kaikki linkittyy kansioon.</div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            <section id="pricing" className={styles.sectionAlt}>
            <div className={styles.container}>
                <div className={styles.sectionHead}>
                <h2 className={styles.h2}>Hinnoittelu</h2>
                <p className={styles.leadSm}>Aloita ilmaiseksi. Päivitä kun tarvitset lisää.</p>
                </div>

                <div className={styles.pricingGrid}>
                <div className={styles.plan}>
                    <div className={styles.planName}>Starter</div>
                    <div className={styles.planPrice}>0 €</div>
                    <ul className={styles.planList}>
                    <li>Kalenteri + tapaamiset</li>
                    <li>Peruskansiot</li>
                    <li>Arvioinnit</li>
                    </ul>
                    <a className={styles.btnPrimary} href="/app">Aloita</a>
                </div>

                <div className={styles.planFeatured}>
                    <div className={styles.planTopRow}>
                    <div className={styles.planName}>Pro</div>
                    <span className={styles.badge}>Suosituin</span>
                    </div>
                    <div className={styles.planPrice}>19 € / kk</div>
                    <ul className={styles.planList}>
                    <li>Rajattomasti kansioita</li>
                    <li>Historia & export</li>
                    <li>Edistyneet analytiikat</li>
                    </ul>
                    <a className={styles.btnPrimary} href="/pricing">Ota Pro</a>
                </div>

                <div className={styles.plan}>
                    <div className={styles.planName}>Club</div>
                    <div className={styles.planPrice}>99 € / kk</div>
                    <ul className={styles.planList}>
                    <li>Seurat / tiimit</li>
                    <li>Roolit ja raportointi</li>
                    <li>Onboarding</li>
                    </ul>
                    <a className={styles.btnGhost} href="/ota-yhteytta">Kysy tarjousta</a>
                </div>
                </div>
            </div>
            </section>

            <section id="faq" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionHead}>
                <h2 className={styles.h2}>FAQ</h2>
                </div>

                <div className={styles.faq}>
                <details className={styles.faqItem}>
                    <summary className={styles.faqQ}>Voinko käyttää tätä pelkkään kirjaamiseen?</summary>
                    <div className={styles.faqA}>
                    Kyllä. Mutta paras hyöty tulee kun tapaamiset linkittyy kansioon (tulokset + arvioinnit mukana).
                    </div>
                </details>

                <details className={styles.faqItem}>
                    <summary className={styles.faqQ}>Näkyykö kaikki tapaamiset kalenterissa?</summary>
                    <div className={styles.faqA}>
                    Kyllä. Tapaamiset näkyy kuukausi/viikko/päivä -näkymissä ja tapahtumasta avautuu muokkaus.
                    </div>
                </details>

                <details className={styles.faqItem}>
                    <summary className={styles.faqQ}>Toimiiko tämä ilman videota?</summary>
                    <div className={styles.faqA}>
                    Kyllä. Reduced-motion tai puuttuva video → tausta jää tyylikkääksi gradientiksi.
                    </div>
                </details>
                </div>

                <div className={styles.finalCta}>
                <div>
                    <div className={styles.finalTitle}>Aloita tapaamisista. Lisää arvioinnit kun haluat.</div>
                    <div className={styles.leadSm}>Premium-fiilis, mutta käytännöllinen. Se on pointti.</div>
                </div>
                <a className={styles.btnPrimary} href="/app">Kokeile nyt</a>
                </div>
            </div>
            </section>

      </div>
    </div>
  );
}
