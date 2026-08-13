import type { CSSProperties } from "react";
import styles from "./FantasticTown.module.css";

interface FantasticTownProps {
  widthVw: number;
}

type SceneProperties = CSSProperties & Record<`--${string}`, string | number>;

const villagers = [
  { frame: 0, left: 54, height: 31, delay: -0.4, depth: "near", motion: "breathe" },
  { frame: 1, left: 88, height: 30, delay: -2.1, depth: "mid", motion: "curious" },
  { frame: 2, left: 137, height: 38, delay: -1.2, depth: "near", motion: "greet" },
  { frame: 3, left: 181, height: 39, delay: -3.4, depth: "near", motion: "work" },
  { frame: 5, left: 229, height: 37, delay: -0.8, depth: "mid", motion: "greet" },
  { frame: 4, left: 278, height: 40, delay: -2.8, depth: "near", motion: "ponder" },
  { frame: 0, left: 323, height: 27, delay: -1.7, depth: "far", motion: "curious" },
  { frame: 1, left: 351, height: 28, delay: -3.1, depth: "far", motion: "breathe" },
];

export function FantasticTown({ widthVw }: FantasticTownProps) {
  const sceneStyle = { "--town-width": `${widthVw}vw` } as SceneProperties;

  return (
    <section className={styles.town} style={sceneStyle} aria-labelledby="fantastic-town-title">
      <div className={styles.panorama} aria-hidden="true">
        <i />
      </div>

      <div className={styles.sunHaze} aria-hidden="true"><i /><i /><i /></div>

      <header className={styles.intro}>
        <span>PRÓLOGO · NIVEL DE INICIACIÓN</span>
        <h1 id="fantastic-town-title">Fantastic<br />Town</h1>
        <p>A las dos de la tarde comienza el viaje, entre la cal, el trigo y quienes aún conservan la luz.</p>
      </header>

      <div className={styles.tutorial}>
        <b>APRENDE A DESPLAZARTE</b>
        <span>↓ para avanzar&nbsp;&nbsp;·&nbsp;&nbsp;↑ para regresar</span>
      </div>

      <div className={`${styles.landmark} ${styles.homesLandmark}`}>
        <small>I</small><b>LAS CASAS DEL VALLE</b>
      </div>
      <div className={`${styles.landmark} ${styles.marketLandmark}`}>
        <small>II</small><b>EL MERCADO DE LA PLAZA</b>
      </div>
      <div className={`${styles.landmark} ${styles.wellLandmark}`}>
        <small>III</small><b>EL POZO ANTIGUO</b>
      </div>

      <div className={styles.villagers} aria-hidden="true">
        {villagers.map(({ frame, left, height, delay, depth, motion }) => (
          <div
            key={`${frame}-${left}`}
            className={`${styles.npc} ${styles[depth]}`}
            style={{
              "--npc-frame": `${frame * 20}%`,
              "--npc-left": `${left}vw`,
              "--npc-height": `${height}vh`,
              "--npc-width": `${height * 0.29}vh`,
              "--npc-delay": `${delay}s`,
            } as SceneProperties}
          >
            <i className={styles[motion]} />
          </div>
        ))}
      </div>

      <div className={styles.castleApproach}>
        <small>EL SENDERO CONTINÚA</small>
        <b>CASTLE WALLS</b>
      </div>
      <div className={styles.ruinBlend} aria-hidden="true" />
    </section>
  );
}
