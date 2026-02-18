"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./scrolly.module.css";

const forceMotion = process.env.NODE_ENV === "development";

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  rightType: "appCard" | "grid" | "timeline" | "cta";
};
console.log("Scrolly mounted");

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

const PINNED_COUNT = 2;

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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root) return;

    // ===== video =====
    if (video) {
      video.playbackRate = 0.5;
      requestAnimationFrame(() => {
        video.play().catch(() => {});
      });
    }

    // ✅ ÄLÄ blokkaa koko scrollya prodissa:
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionOK = forceMotion || !reduce;

    // ===== header height (tärkeä startin kannalta) =====
    const headerEl =
      document.querySelector<HTMLElement>(".site-header") ??
      document.querySelector<HTMLElement>("header");
    const headerH = Math.round(headerEl?.getBoundingClientRect().height ?? 0);
    if (headerH > 0) root.style.setProperty("--header-h", `${headerH}px`);

    let killed = false;
    let ctx: { revert: () => void } | null = null;

    const raf2 = (fn: () => void) =>
      requestAnimationFrame(() => requestAnimationFrame(fn));

    (async () => {
      try {
        const gsapMod = await import("gsap");
        const gsap = gsapMod.default;

        const stMod = await import("gsap/ScrollTrigger");
        const ScrollTrigger = stMod.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        if (killed) return;

        ctx = gsap.context(() => {
          const SCROLL_PER_SCENE = 0.65;
          const STEP = 0.2;
          const HOLD = 0.16;

          const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");

          const far = root.querySelector<HTMLElement>("[data-layer='far']");
          const mid = root.querySelector<HTMLElement>("[data-layer='mid']");
          const near = root.querySelector<HTMLElement>("[data-layer='near']");
          const vid = root.querySelector<HTMLElement>("[data-layer='video']");
          const progress = root.querySelector<HTMLElement>("[data-progress]");

          // stack scenes
          gsap.set(scenes, { autoAlpha: 0, pointerEvents: "none" });
          if (scenes[0]) gsap.set(scenes[0], { autoAlpha: 1, pointerEvents: "auto" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: () => `top top+=${headerH}`,
              end: () => `+=${window.innerHeight * (scenes.length * SCROLL_PER_SCENE)}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progress) {
                  progress.style.transform = `scaleY(${self.progress})`;
                  progress.style.transformOrigin = "top";
                }
              },
            },
          });

          // drift (ok myös reduced motionilla, mutta halutessa voit poistaa)
          if (vid) tl.to(vid, { yPercent: -10, xPercent: 0, ease: "none" }, 0);
          if (far) tl.to(far, { yPercent: -14, xPercent: 0, ease: "none" }, 0);
          if (mid) tl.to(mid, { yPercent: -22, xPercent: 0, ease: "none" }, 0);
          if (near) tl.to(near, { yPercent: -30, xPercent: 0, ease: "none" }, 0);

          scenes.forEach((scene, i) => {
            const t = scene.querySelector<HTMLElement>("[data-anim='title']");
            const b = scene.querySelector<HTMLElement>("[data-anim='body']");
            const c = scene.querySelector<HTMLElement>("[data-anim='card']");

            const at = i * STEP;

            tl.to(scene, { autoAlpha: 1, pointerEvents: "auto", duration: 0.1 }, at);

            // ✅ reduced-motion: ei blur/rotateX, vaan kevyt fade
            if (i > 0 && t) {
              tl.fromTo(
                t,
                motionOK
                  ? { y: 14, autoAlpha: 0, filter: "blur(10px)" }
                  : { autoAlpha: 0 },
                motionOK
                  ? { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.18, ease: "power2.out" }
                  : { autoAlpha: 1, duration: 0.01 },
                at + 0.04
              );
            }
            if (i > 0 && b) {
              tl.fromTo(
                b,
                motionOK
                  ? { y: 10, autoAlpha: 0, filter: "blur(10px)" }
                  : { autoAlpha: 0 },
                motionOK
                  ? { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.18, ease: "power2.out" }
                  : { autoAlpha: 1, duration: 0.01 },
                at + 0.06
              );
            }
            if (i > 0 && c) {
              tl.fromTo(
                c,
                motionOK
                  ? { y: 16, autoAlpha: 0, rotateX: 6, transformPerspective: 900 }
                  : { autoAlpha: 0 },
                motionOK
                  ? { y: 0, autoAlpha: 1, rotateX: 0, duration: 0.22, ease: "power2.out" }
                  : { autoAlpha: 1, duration: 0.01 },
                at + 0.07
              );
            }

            if (i < scenes.length - 1) {
              tl.to(scene, { autoAlpha: 0, pointerEvents: "none", duration: 0.1 }, at + HOLD);
            }
          });

          // refresh kun layout varmasti valmis (video metadata voi muuttaa korkeutta)
          const hardRefresh = () => {
            ScrollTrigger.refresh(true);
            ScrollTrigger.update();
          };

          const v = videoRef.current;
          if (v && v.readyState < 2) {
            const onMeta = () => {
              raf2(hardRefresh);
              v.removeEventListener("loadedmetadata", onMeta);
            };
            v.addEventListener("loadedmetadata", onMeta);
          } else {
            raf2(hardRefresh);
          }
        }, root);
      } catch {
        // jos GSAP import failaa prodissa jostain syystä, ei kaadeta sivua
        // (tällöin pinned osio näkyy normaalina blokkina)
      }
    })();

    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  const pinnedScenes = SCENES.slice(0, PINNED_COUNT);
  const normalScenes = SCENES.slice(PINNED_COUNT);

  return (
    <>
      <div ref={rootRef} className={styles.experience}>
        <div className={styles.bg} aria-hidden="true">
          <video
            ref={videoRef}
            className={styles.bgVideo}
            data-layer="video"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
          >
            <source src="/media/scrolly-bg.mp4" type="video/mp4" />
          </video>

          <div className={styles.layerFar} data-layer="far" />
          <div className={styles.layerMid} data-layer="mid" />
          <div className={styles.layerNear} data-layer="near" />
          <div className={styles.noise} />
        </div>

        <div className={styles.progressRail} aria-hidden="true">
          <div className={styles.progressFill} data-progress />
        </div>

        <div className={styles.stage}>
          {pinnedScenes.map((s) => (
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

      <div className={styles.normalWrap}>
        {normalScenes.map((s) => (
          <section key={s.id} className={styles.normalScene} aria-label={s.eyebrow}>
            <div className={styles.sceneInner}>
              <div className={styles.copy}>
                <p className={styles.eyebrow}>{s.eyebrow}</p>
                <h1 className={styles.h1}>{s.title}</h1>
                <p className={styles.lead}>{s.lead}</p>
              </div>

              <RightVisual type={s.rightType} />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
