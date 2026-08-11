"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./LoadingScene.module.css";

interface LoadingSceneProps {
  durationSeconds: number;
  onComplete: () => void;
}

type VisualProperties = CSSProperties & Record<`--${string}`, string | number>;

const stars = [
  [9, 12, 0.2, 1.2], [15, 24, 1.8, 0.7], [22, 10, 3.1, 0.9],
  [31, 18, 0.8, 1.1], [39, 8, 2.3, 0.65], [47, 21, 4.2, 0.8],
  [54, 11, 1.2, 1.3], [62, 26, 3.7, 0.65], [70, 15, 0.4, 1],
  [77, 7, 2.8, 0.75], [85, 22, 4.8, 1.15], [92, 13, 1.5, 0.7],
  [18, 35, 4.1, 0.6], [34, 31, 2.1, 0.75], [66, 36, 1.1, 0.55],
  [81, 33, 3.3, 0.7], [88, 42, 0.7, 0.5], [57, 40, 4.6, 0.55],
];

const embers = [
  [-30, 0.1, 0.9], [-18, 0.7, 1.2], [-7, 1.3, 0.8], [4, 0.3, 1.1],
  [15, 1.7, 0.75], [27, 0.9, 1], [36, 2.1, 0.7], [9, 2.7, 0.85],
];

export function LoadingScene({ durationSeconds, onComplete }: LoadingSceneProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const durationMs = Math.max(0, durationSeconds * 1000);
    const transitionMs = Math.min(900, durationMs);
    const previousOverflow = document.body.style.overflow;

    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const leaveTimer = window.setTimeout(() => setLeaving(true), durationMs - transitionMs);
    const completeTimer = window.setTimeout(onComplete, durationMs);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(completeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [durationSeconds, onComplete]);

  const sceneStyle = {
    "--loading-duration": `${Math.max(0.1, durationSeconds)}s`,
  } as VisualProperties;

  return (
    <section
      className={`${styles.loadingScene} ${leaving ? styles.leaving : ""}`}
      style={sceneStyle}
      aria-label="Preparando la travesía"
      aria-live="polite"
    >
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.stars} aria-hidden="true">
        {stars.map(([x, y, delay, size], index) => (
          <i
            key={index}
            style={{
              "--star-x": `${x}%`,
              "--star-y": `${y}%`,
              "--star-delay": `${delay}s`,
              "--star-size": `${size}px`,
            } as VisualProperties}
          />
        ))}
      </div>

      <div className={styles.fireLight} aria-hidden="true" />

      <div className={styles.characterStage} aria-hidden="true">
        <div className={styles.shield}>
          <i className={styles.shieldBase} />
          <i className={styles.shieldWarmth} />
        </div>
        <div className={styles.knight}>
          <i className={styles.knightBase} />
          <i className={styles.knightWarmth} />
        </div>
      </div>

      <div className={styles.campfire} aria-hidden="true">
        <div className={styles.logs}><i /><i /></div>
        <div className={styles.flames}>
          <i /><i /><i /><i />
        </div>
        <div className={styles.embers}>
          {embers.map(([x, delay, scale], index) => (
            <i
              key={index}
              style={{
                "--ember-x": `${x}px`,
                "--ember-delay": `${delay}s`,
                "--ember-scale": scale,
              } as VisualProperties}
            />
          ))}
        </div>
      </div>

      <header className={styles.title}>
        <span>UNA TRAVESÍA INTERACTIVA</span>
        <strong>Gabriel Vázquez Ruiz</strong>
        <small>FULL STACK DEVELOPER</small>
      </header>

      <div className={styles.loadingStatus}>
        <span>ENCENDIENDO LA HOGUERA</span>
        <div><i /></div>
      </div>

      <div className={styles.transitionVeil} aria-hidden="true" />
    </section>
  );
}
