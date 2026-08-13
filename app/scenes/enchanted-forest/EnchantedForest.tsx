import type { CSSProperties } from "react";
import styles from "./EnchantedForest.module.css";

interface EnchantedForestProps {
  startVw: number;
  widthVw: number;
}

interface EnchantedForestOverlayProps {
  layerTransform: (originVw: number) => string;
  startVw: number;
  widthVw: number;
}

type SceneProperties = CSSProperties & Record<`--${string}`, string | number>;

export function EnchantedForest({ startVw, widthVw }: EnchantedForestProps) {
  const sceneStyle = {
    "--forest-start": `${startVw}vw`,
    "--forest-width": `${widthVw}vw`,
  } as SceneProperties;

  return (
    <section className={styles.forest} style={sceneStyle} aria-labelledby="enchanted-forest-title">
      <div className={styles.panorama} aria-hidden="true"><i /></div>
      <div className={styles.corruption} aria-hidden="true" />
      <div className={styles.motes} aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>

      <header className={styles.intro}>
        <span>NIVEL I · EL SENDERO ENTRE MUNDOS</span>
        <h2 id="enchanted-forest-title">El bosque<br />de los susurros</h2>
        <p>La luz aún habita entre las raíces, pero algo antiguo ha comenzado a devorar el camino.</p>
      </header>

      <div className={`${styles.landmark} ${styles.grove}`}>
        <small>I</small><b>LA ARBOLEDA LUMINOSA</b>
      </div>
      <div className={`${styles.landmark} ${styles.root}`}>
        <small>II</small><b>LA RAÍZ CORROMPIDA</b>
      </div>
      <div className={`${styles.landmark} ${styles.deadwood}`}>
        <small>III</small><b>DONDE MUEREN LAS HOJAS</b>
      </div>

      <div className={styles.castleApproach}>
        <small>LA NIEBLA REVELA</small>
        <b>CASTLE WALLS</b>
      </div>
    </section>
  );
}

export function EnchantedForestOverlay({
  layerTransform,
  startVw,
  widthVw,
}: EnchantedForestOverlayProps) {
  return (
    <>
      <div
        className={`${styles.thresholdTree} ${styles.livingTree}`}
        style={{ transform: layerTransform(startVw) }}
        aria-hidden="true"
      />
      <div
        className={`${styles.thresholdTree} ${styles.corruptedTree}`}
        style={{ transform: layerTransform(startVw + widthVw) }}
        aria-hidden="true"
      />
    </>
  );
}
