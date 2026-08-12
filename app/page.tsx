"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MainCharacter, type MotionState } from "./characters/main-character/MainCharacter";
import { LOADING_DURATION_SECONDS } from "./config/experience";
import {
  CASTLE_WALLS_START_VW,
  ENCHANTED_FOREST_START_VW,
  ENCHANTED_FOREST_WIDTH_VW,
  FANTASTIC_TOWN_WIDTH_VW,
  WORLD_TRAVEL_VW,
  WORLD_WIDTH_VW,
} from "./config/world";
import {
  CastleWallsBackground,
  CastleWallsOverlay,
  CastleWallsWorld,
} from "./scenes/castle-walls/CastleWalls";
import { EnchantedForest } from "./scenes/enchanted-forest/EnchantedForest";
import { FantasticTown } from "./scenes/fantastic-town/FantasticTown";
import { LoadingScene } from "./scenes/loading/LoadingScene";

const jobs = [
  ["Random estudio", "2013—2015", "Sitios web, apps híbridas, multimedia, UX y APIs RESTful."],
  ["Global Standards", "2015—2017", "Apps móviles, arquitectura de datos y soluciones de auditoría."],
  ["Weknow", "2017—2018", "PM y desarrollo de plataforma e-learning basada en Moodle."],
  ["GerzeLabs", "2018—2019", "Project Manager: 16 proyectos entregados en tiempo."],
  ["CONALEP GDL II", "2019—2021", "Docente de programación, desarrollo móvil y videojuegos."],
  ["Sustam", "2019—2020", "Full stack: rescate de proyectos, bugs, clientes y nuevos productos."],
];

const skillGroups = [
  ["WEB", "PHP · HTML5 · CSS3 · JavaScript", "8 AÑOS"],
  ["PRODUCTO", "UX/UI · MySQL · Git", "8 AÑOS"],
  ["MÓVIL", "Android · SQLite · Java", "5+ AÑOS"],
  ["FRAMEWORKS", "Laravel · Vue.js · Firebase · Flutter", "1—3 AÑOS"],
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [motion, setMotion] = useState<MotionState>("idle");
  const [backwards, setBackwards] = useState(false);
  const [level, setLevel] = useState(0);
  const [townPan, setTownPan] = useState(0);
  const [forestPan, setForestPan] = useState(0);
  const lastY = useRef(0);
  const motionRef = useRef<MotionState>("idle");
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollFrame = useRef<number | null>(null);
  const finishLoading = useCallback(() => setIsLoading(false), []);

  useEffect(() => {
    const changeMotion = (next: MotionState) => {
      motionRef.current = next;
      setMotion(next);
    };

    const beginRun = () => {
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
      changeMotion("starting");
      phaseTimer.current = setTimeout(() => changeMotion("running"), 55);
    };

    const scheduleStop = () => {
      if (stopTimer.current) clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => {
        if (phaseTimer.current) clearTimeout(phaseTimer.current);
        changeMotion("stopping");
        phaseTimer.current = setTimeout(() => changeMotion("idle"), 80);
      }, 130);
    };

    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const next = max ? Math.max(0, Math.min(1, scrollY / max)) : 0;
      setProgress(next);
      const wallScene = innerHeight * 1.78;
      const position = next * (innerWidth * (WORLD_TRAVEL_VW / 100) + wallScene);
      const townScene = innerWidth * (FANTASTIC_TOWN_WIDTH_VW / 100);
      const forestScene = innerWidth * (ENCHANTED_FOREST_WIDTH_VW / 100);
      const forestPosition = position - townScene;
      const castlePosition = forestPosition - forestScene;
      const screen = (castlePosition - wallScene) / innerWidth;
      setTownPan(Math.min(1, position / townScene));
      setForestPan(Math.max(0, Math.min(1, forestPosition / forestScene)));
      setLevel(
        position < townScene
          ? 0
          : forestPosition < forestScene
            ? 1
            : castlePosition < innerWidth * 3 + wallScene
              ? 2
              : Math.min(7, Math.floor(screen)),
      );
      if (Math.abs(scrollY - lastY.current) > 1) {
        setBackwards(scrollY < lastY.current);
        if (motionRef.current === "idle" || motionRef.current === "stopping") {
          beginRun();
        }
        scheduleStop();
      }
      lastY.current = scrollY;
    };
    const requestUpdate = () => {
      if (scrollFrame.current !== null) return;
      scrollFrame.current = requestAnimationFrame(() => {
        scrollFrame.current = null;
        update();
      });
    };

    update();
    addEventListener("scroll", requestUpdate, { passive: true });
    return () => {
      removeEventListener("scroll", requestUpdate);
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  const travelVw = progress * WORLD_TRAVEL_VW;
  const travelVh = progress * 178;
  const worldTransform = `translate3d(calc(-${travelVw}vw - ${travelVh}vh),0,0)`;
  const layerTransform = (originVw: number) =>
    `translate3d(calc(${originVw - travelVw}vw - ${travelVh}vh),0,0)`;
  const castleTravel = Math.max(0, travelVw - CASTLE_WALLS_START_VW);
  const skyPhase = Math.min(1, 0.32 + castleTravel / 360);
  const heroX = Math.min(29, 8 + travelVw * (75 / 700));
  const experienceStyle = {
    "--world": `calc(${WORLD_WIDTH_VW}vw + 178vh)`,
    "--scroll-height": `calc(${WORLD_WIDTH_VW}vh + 178vw)`,
    "--town-width": `${FANTASTIC_TOWN_WIDTH_VW}vw`,
    "--pre-castle-width": `${CASTLE_WALLS_START_VW}vw`,
  } as React.CSSProperties;

  return (
    <main className="game-scroll" style={experienceStyle}>
      {isLoading && (
        <LoadingScene
          durationSeconds={LOADING_DURATION_SECONDS}
          onComplete={finishLoading}
        />
      )}
      <div
        className="game"
        style={{
          "--sky-phase": skyPhase,
          "--town-pan-offset": `${townPan * -33.333}%`,
          "--forest-pan-offset": `${forestPan * -33.333}%`,
        } as React.CSSProperties}
        aria-label="Currículum interactivo de Gabriel Vázquez Ruiz"
        aria-hidden={isLoading}
      >
        <div className="fog fog-one" /><div className="fog fog-two" />
        <div className="game-hud">
          <div className="crest">GV</div>
          <div className="hud-copy"><strong>GABRIEL VÁZQUEZ RUIZ</strong><span>FULL STACK DEVELOPER</span></div>
          <div className="level-counter"><small>NIVEL</small><b>{String(level).padStart(2,"0")}</b></div>
        </div>
        <div className="progress-track"><i style={{ width: `${progress * 100}%` }} /></div>

        <div className="world" style={{ transform: worldTransform }}>
          <div className="backdrop" />
          <FantasticTown widthVw={FANTASTIC_TOWN_WIDTH_VW} />
          <EnchantedForest
            startVw={ENCHANTED_FOREST_START_VW}
            widthVw={ENCHANTED_FOREST_WIDTH_VW}
          />
          <CastleWallsBackground startVw={CASTLE_WALLS_START_VW} />
          <div className="moon-disc" />
          <div className="far-castles"><i /><i /><i /><i /></div>

          <CastleWallsWorld startVw={CASTLE_WALLS_START_VW} />

          <section className="zone skills-zone" aria-labelledby="skills-title">
            <div className="banner"><small>NIVEL 3</small><h2 id="skills-title">Arsenal técnico</h2></div>
            <div className="skill-towers">{skillGroups.map(([name,items,years],i)=><article key={name} style={{"--height":`${66+i%2*14}%`} as React.CSSProperties}><div><small>{years}</small><h3>{name}</h3><p>{items}</p></div></article>)}</div>
            <div className="gate"><b>NIVEL 4</b></div>
          </section>

          <section className="zone jobs-zone" aria-labelledby="jobs-title">
            <div className="banner"><small>NIVEL 4</small><h2 id="jobs-title">Reinos servidos</h2></div>
            <div className="job-scrolls">{jobs.slice(0,3).map(([name,date,text])=><article key={name}><time>{date}</time><h3>{name}</h3><p>{text}</p></article>)}</div>
            <div className="gate"><b>NIVEL 5</b></div>
          </section>

          <section className="zone jobs-zone jobs-two" aria-label="Experiencia reciente">
            <div className="banner"><small>NIVEL 5</small><h2>Batallas recientes</h2></div>
            <div className="job-scrolls">{jobs.slice(3).map(([name,date,text])=><article key={name}><time>{date}</time><h3>{name}</h3><p>{text}</p></article>)}</div>
            <div className="gate"><b>NIVEL 6</b></div>
          </section>

          <section className="zone education-zone" aria-labelledby="education-title">
            <div className="banner"><small>NIVEL 6</small><h2 id="education-title">La academia</h2></div>
            <div className="academy">
              <article><time>2010—2015</time><h3>Ingeniería en Sistemas Computacionales</h3><p>Instituto Tecnológico José Mario Molina</p></article>
              <article><time>2006—2009</time><h3>Profesional Técnico Bachiller en Informática</h3><p>CONALEP Guadalajara II</p></article>
            </div>
            <div className="gate"><b>NIVEL 7</b></div>
          </section>

          <section className="zone contact-zone" aria-labelledby="contact-title">
            <div className="final-shrine">
              <small>MISIÓN COMPLETADA</small><h2 id="contact-title">Construyamos algo memorable</h2>
              <p>¿Tienes una misión para mí?</p>
              <a href="mailto:gabriel.vazquezruiz@gmail.com">ENVIAR MENSAJE</a>
              <div><a href="tel:+523316863730">33 1686 3730</a><a href="https://portfolio.midgardsystems.com.mx" target="_blank" rel="noreferrer">PORTAFOLIO</a><span>TLAQUEPAQUE, JAL.</span></div>
            </div>
          </section>

          <div className="ground-layer"><i /><i /></div>
          <div className="foreground-trees"><i /><i /><i /><i /><i /><i /></div>
        </div>

        <MainCharacter motion={motion} backwards={backwards} left={`${heroX}vw`} />
        <CastleWallsOverlay layerTransform={layerTransform} startVw={CASTLE_WALLS_START_VW} />
        <div className="scroll-prompt">SCROLL PARA CAMINAR <span>↕</span></div>
      </div>
    </main>
  );
}
