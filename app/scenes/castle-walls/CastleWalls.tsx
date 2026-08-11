import styles from "./CastleWalls.module.css";

interface CastleWallsOverlayProps {
  layerTransform: (originVw: number) => string;
}

export function CastleWallsBackground() {
  return <div className={styles.scenario} aria-hidden="true" />;
}

export function CastleWallsWorld() {
  return (
    <section className={`zone ${styles.profileZone}`} aria-labelledby="perfil-title">
        <div className={`${styles.legend} ${styles.legendOrigin}`}>
          <small>CAPÍTULO I · EL ORIGEN</small>
          <h2 id="perfil-title">Una leyenda escrita en código</h2>
          <p>En Guadalajara comenzó el viaje de un creador inquieto, guiado por la curiosidad y el deseo de convertir problemas complejos en experiencias claras.</p>
        </div>

        <div className={`${styles.legend} ${styles.legendCalling}`}>
          <small>EL LLAMADO</small>
          <h2>Construir, aprender y guiar</h2>
          <p>Durante más de ocho años ha creado productos web y móviles, liderado equipos y compartido conocimiento con nuevas generaciones.</p>
          <blockquote>“Meticuloso, innovador y orientado a resolver problemas.”</blockquote>
        </div>

        <div className={`${styles.raven} ${styles.ravenDistant}`} aria-hidden="true"><i /></div>
        <div className={styles.wanderer} aria-hidden="true"><i /></div>
        <div className={styles.castleThreshold}><span>LAS PUERTAS DEL OFICIO</span><b>ENTRAR AL CASTILLO</b></div>
        <div className={`gate ${styles.levelGate}`}><b>NIVEL 2</b></div>
    </section>
  );
}

export function CastleWallsOverlay({ layerTransform }: CastleWallsOverlayProps) {
  const wallTransform = { transform: layerTransform(260) };

  return (
    <>
      <div className={`${styles.castleWallTransition} ${styles.castleWallBack}`} style={wallTransform} aria-hidden="true" />
      <div className={`${styles.castleWallTransition} ${styles.castleWallFront}`} style={wallTransform} aria-hidden="true" />
      <div className={styles.foregroundPost} style={{ transform: layerTransform(72) }} aria-hidden="true">
        <div className={`${styles.raven} ${styles.ravenForeground}`}><i /></div>
      </div>
    </>
  );
}
