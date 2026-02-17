"use client";

import { useEffect, useRef } from "react";
import styles from "./BackgroundVideo.module.css";

export default function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const SLOW_RATE = 0.45; // 🔥 TÄMÄ ON HIDAUS (0.25 = 4x hitaampi)

    const setSpeed = () => {
      video.playbackRate = SLOW_RATE;
      video.defaultPlaybackRate = SLOW_RATE;
    };

    // Asetetaan heti
    setSpeed();

    // Asetetaan uudelleen jos selain resetoi
    video.addEventListener("loadeddata", setSpeed);
    video.addEventListener("ratechange", setSpeed);

    // Pakotetaan play jos Safari jäätyy
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("loadeddata", setSpeed);
      video.removeEventListener("ratechange", setSpeed);
    };
  }, []);

  return (
    <div aria-hidden className={styles.wrapper}>
      <video
        ref={ref}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/media/background.mp4" type="video/mp4" />
      </video>

      <div className={styles.overlay} />
    </div>
  );
}
