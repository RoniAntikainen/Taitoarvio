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

    // ===== hidasta video =====
    if (video) {
      video.playbackRate = 0.5;
      // iOS/Safari safe autoplay
      requestAnimationFrame(() => {
        video.play().catch(() => {});
      });
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce && !forceMotion) return;

    // ===== header height (tärkeä startin kannalta) =====
    const headerEl =
      document.querySelector<HTMLElement>(".site-header") ??
      document.querySelector<HTMLElement>("header");
    const headerH = Math.round(headerEl?.getBoundingClientRect().height ?? 0);
    if (headerH > 0) root.style.setProperty("--header-h", `${headerH}px`);

    let ctx: { revert: () => void } | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const gsap = gsapMod.default;

      const stMod = await import("gsap/ScrollTrigger");
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const SCROLL_PER_SCENE = 0.65;
        const STEP = 0.20;
        const HOLD = 0.16;

        const scenes = gsap.utils.toArray<HTMLElement>("[data-scene]");

        const far = root.querySelector<HTMLElement>("[data-layer='far']");
        const mid = root.querySelector<HTMLElement>("[data-layer='mid']");
        const near = root.querySelector<HTMLElement>("[data-layer='near']");
        const vid = root.querySelector<HTMLElement>("[data-layer='video']");
        const progress = root.querySelector<HTMLElement>("[data-progress]");

        // stack scenes
        gsap.set(scenes, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(scenes[0], { autoAlpha: 1, pointerEvents: "auto" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            // ✅ alkaa heti kun pinned-osio on headerin alapuolella
            start: () => `top top+=${headerH}`,
            end: () =>
              `+=${window.innerHeight * (scenes.length * SCROLL_PER_SCENE)}`,
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

        // drift vain y (ei sivulle)
        if (vid) tl.to(vid, { yPercent: -10, xPercent: 0, ease: "none" }, 0);
        if (far) tl.to(far, { yPercent: -14, xPercent: 0, ease: "none" }, 0);
        if (mid) tl.to(mid, { yPercent: -22, xPercent: 0, ease: "none" }, 0);
        if (near) tl.to(near, { yPercent: -30, xPercent: 0, ease: "none" }, 0);

        // scenes
        scenes.forEach((scene, i) => {
          const t = scene.querySelector("[data-anim='title']");
          const b = scene.querySelector("[data-anim='body']");
          const c = scene.querySelector("[data-anim='card']");

          const at = i * STEP;

          tl.to(scene, { autoAlpha: 1, pointerEvents: "auto", duration: 0.1 }, at);

          if (i > 0 && t) {
            tl.fromTo(
              t,
              { y: 14, autoAlpha: 0, filter: "blur(10px)" },
              { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.18, ease: "power2.out" },
              at + 0.04
            );
          }
          if (i > 0 && b) {
            tl.fromTo(
              b,
              { y: 10, autoAlpha: 0, filter: "blur(10px)" },
              { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.18, ease: "power2.out" },
              at + 0.06
            );
          }
          if (i > 0 && c) {
            tl.fromTo(
              c,
              { y: 16, autoAlpha: 0, rotateX: 6, transformPerspective: 900 },
              { y: 0, autoAlpha: 1, rotateX: 0, duration: 0.22, ease: "power2.out" },
              at + 0.07
            );
          }

          if (i < scenes.length - 1) {
            tl.to(scene, { autoAlpha: 0, pointerEvents: "none", duration: 0.1 }, at + HOLD);
          }
        });

        

        // ===== KRIITTINEN: refresh + update kun layout on varmasti valmis =====
        const hardRefresh = () => {
          ScrollTrigger.refresh(true);
          ScrollTrigger.update();
        };
        const raf2 = (fn: () => void) =>
          requestAnimationFrame(() => requestAnimationFrame(fn));

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
    })();

    return () => ctx?.revert();
  }, []);

  const pinnedScenes = SCENES.slice(0, PINNED_COUNT);
  const normalScenes = SCENES.slice(PINNED_COUNT);

  return (
    <>
      {/* ===== PINNED SCROLLYTELLING (vain 2 ekaa sceneä) ===== */}
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

      {/* ===== NORMAALI SCROLL (loput scenet) ===== */}
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
