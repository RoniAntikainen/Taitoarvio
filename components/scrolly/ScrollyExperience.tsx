"use client";

import { useEffect, useRef } from "react";
import styles from "./scrolly.module.css";

const forceMotion = process.env.NODE_ENV === "development";

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  rightType: "appCard" | "grid" | "timeline" | "cta";
};

const SCENES: Scene[] = [
  {
    id: "s1",
    eyebrow: "BeatSport • uppouttava valmennuskokemus",
    title: "Valmennuksen seuranta, palaute ja muistiot — yhdessä paikassa",
    lead: "Scrollaat tarinaa eteenpäin. Näet, miten tieto järjestyy ja kokonaiskuva syntyy.",
    rightType: "appCard",
  },
  {
    id: "s2",
    eyebrow: "Ongelma",
    title: "Tieto on kaikkialla — mutta harvoin yhdessä paikassa",
    lead: "Vihkot, viestit ja muistiot hajautuvat. Palaute hukkuu. Kokonaiskuva katoaa.",
    rightType: "grid",
  },
  {
    id: "s3",
    eyebrow: "Ratkaisu",
    title: "BeatSport kokoaa olennaisen yhteen näkymään",
    lead: "Kirjaa treenit ja havainnot. Pidä linja yhtenäisenä. Näe muutos ajassa.",
    rightType: "timeline",
  },
  {
    id: "s4",
    eyebrow: "Seuraava askel",
    title: "Haluatko nähdä demossa miltä arki näyttää BeatSportilla?",
    lead: "Saat esittelyn ja suosituksen käyttöönotosta. Ei sitoumusta.",
    rightType: "cta",
  },
];

function RightVisual({ type }: { type: Scene["rightType"] }) {
  if (type === "appCard") {
    return (
      <div className={styles.glassCard} data-anim="card">
        <div className={styles.cardTitle}>BeatSport Web App</div>
        <div className={styles.cardMeta}>Kaikki lajit • Valmentajille</div>
        <div className={styles.cardRow}>
          <div className={styles.pill}>
            <span>PALAUTE</span>
            <b>Selkeä</b>
          </div>
          <div className={styles.pill}>
            <span>MUISTIOT</span>
            <b>Järjestyksessä</b>
          </div>
          <div className={styles.pill}>
            <span>SEURANTA</span>
            <b>Ajassa</b>
          </div>
        </div>
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className={styles.grid} data-anim="card">
        <div className={styles.tile}>
          <b>Muistiinpanot</b>
          <span>hajaantuu</span>
        </div>
        <div className={styles.tile}>
          <b>Palaute</b>
          <span>unohtuu</span>
        </div>
        <div className={styles.tile}>
          <b>Kehitys</b>
          <span>ei näy</span>
        </div>
        <div className={styles.tile}>
          <b>Kokonaiskuva</b>
          <span>puuttuu</span>
        </div>
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className={styles.timeline} data-anim="card">
        <div className={styles.step}>
          <b>Kirjaa</b>
          <span>Treenit, havainnot, palaute</span>
        </div>
        <div className={styles.step}>
          <b>Jäsennä</b>
          <span>Muistiot ja päätökset talteen</span>
        </div>
        <div className={styles.step}>
          <b>Seuraa</b>
          <span>Kehitys näkyy ilman säätöä</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ctaBox} data-anim="card">
      <a className={styles.ctaPrimary} href="/demo">
        Pyydä demo
      </a>
      <a className={styles.ctaSecondary} href="/web-app">
        Katso Web App
      </a>
      <div className={styles.ctaNote}>Nopea demo. Ei sitoumusta.</div>
    </div>
  );
}

export default function ScrollyExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce && !forceMotion) return;

    let ctx: { revert: () => void } | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const gsap = gsapMod.default;

      const stMod = await import("gsap/ScrollTrigger");
      const ScrollTrigger = stMod.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");
        const far = root.querySelector("[data-layer='far']");
        const mid = root.querySelector("[data-layer='mid']");
        const near = root.querySelector("[data-layer='near']");
        const progress = root.querySelector("[data-progress]");

        // Stack: only first visible initially
        gsap.set(scenes, { autoAlpha: 0 });
        gsap.set(scenes[0], { autoAlpha: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * (scenes.length * 1.15)}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Parallax
        if (far) tl.to(far, { yPercent: -10, ease: "none" }, 0);
        if (mid) tl.to(mid, { yPercent: -18, ease: "none" }, 0);
        if (near) tl.to(near, { yPercent: -28, ease: "none" }, 0);

        // Progress rail
        if (progress) {
          tl.fromTo(
            progress,
            { scaleY: 0, transformOrigin: "top" },
            { scaleY: 1, ease: "none" },
            0
          );
        }

        // Scenes
        scenes.forEach((scene, i) => {
          const t = scene.querySelector("[data-anim='title']");
          const b = scene.querySelector("[data-anim='body']");
          const c = scene.querySelector("[data-anim='card']");

          const at = i * 1.0;

          tl.to(scene, { autoAlpha: 1, duration: 0.18, ease: "none" }, at);

          if (t) {
            tl.fromTo(
              t,
              { y: 18, autoAlpha: 0, filter: "blur(10px)" },
              { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
              at + 0.08
            );
          }
          if (b) {
            tl.fromTo(
              b,
              { y: 14, autoAlpha: 0, filter: "blur(10px)" },
              { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
              at + 0.14
            );
          }
          if (c) {
            tl.fromTo(
              c,
              { y: 22, autoAlpha: 0, rotateX: 8, transformPerspective: 900 },
              { y: 0, autoAlpha: 1, rotateX: 0, duration: 0.45, ease: "power2.out" },
              at + 0.16
            );
          }

          if (i < scenes.length - 1) {
            tl.to(scene, { autoAlpha: 0, duration: 0.18, ease: "none" }, at + 0.95);
          }
        });

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
        };
      }, root);
    })();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.experience}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.layerFar} data-layer="far" />
        <div className={styles.layerMid} data-layer="mid" />
        <div className={styles.layerNear} data-layer="near" />
        <div className={styles.noise} />
      </div>

      <div className={styles.progressRail} aria-hidden="true">
        <div className={styles.progressFill} data-progress />
      </div>

      <div className={styles.stage}>
        {SCENES.map((s) => (
          <section key={s.id} className={styles.scene} data-scene aria-label={s.eyebrow}>
            <div className={styles.sceneInner}>
              <div className={styles.copy}>
                <p className={styles.eyebrow}>{s.eyebrow}</p>
                <h1 className={styles.h1} data-anim="title">
                  {s.title}
                </h1>
                <p className={styles.lead} data-anim="body">
                  {s.lead}
                </p>
              </div>

              <RightVisual type={s.rightType} />
            </div>

            {s.id === "s1" && (
              <div className={styles.hint} aria-hidden="true">
                Scroll ↓
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
