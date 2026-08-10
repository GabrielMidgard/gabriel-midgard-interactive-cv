"use client";

import { useEffect, useRef, useState } from "react";

type MotionState = "idle" | "starting" | "running" | "stopping";

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
  const [progress, setProgress] = useState(0);
  const [motion, setMotion] = useState<MotionState>("idle");
  const [backwards, setBackwards] = useState(false);
  const [level, setLevel] = useState(1);
  const lastY = useRef(0);
  const motionRef = useRef<MotionState>("idle");
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const position = next * (innerWidth * 7 + wallScene);
      const screen = (position - wallScene) / innerWidth;
      setLevel(position < innerWidth * 3 + wallScene ? 1 : Math.min(6, Math.floor(screen) - 1));
      if (Math.abs(scrollY - lastY.current) > 1) {
        setBackwards(scrollY < lastY.current);
        if (motionRef.current === "idle" || motionRef.current === "stopping") {
          beginRun();
        }
        scheduleStop();
      }
      lastY.current = scrollY;
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => {
      removeEventListener("scroll", update);
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  const travelVw = progress * 700;
  const travelVh = progress * 178;
  const worldTransform = `translate3d(calc(-${travelVw}vw - ${travelVh}vh),0,0)`;
  const layerTransform = (originVw: number) =>
    `translate3d(calc(${originVw - travelVw}vw - ${travelVh}vh),0,0)`;
  const skyTransform = `translate3d(calc(${travelVw * 0.7}vw + ${travelVh * 0.7}vh),0,0)`;
  const skyPhase = Math.min(1, progress * 2.15);
  const heroX = Math.min(29, 8 + progress * 75);

  return (
    <main className="game-scroll">
      <div
        className="game"
        style={{ "--sky-phase": skyPhase } as React.CSSProperties}
        aria-label="Currículum interactivo de Gabriel Vázquez Ruiz"
      >
        <div className="fog fog-one" /><div className="fog fog-two" />
        <div className="game-hud">
          <div className="crest">GV</div>
          <div className="hud-copy"><strong>GABRIEL VÁZQUEZ RUIZ</strong><span>FULL STACK DEVELOPER</span></div>
          <div className="level-counter"><small>CAPÍTULO</small><b>{String(level).padStart(2,"0")}</b></div>
        </div>
        <div className="progress-track"><i style={{ width: `${progress * 100}%` }} /></div>

        <div className="world" style={{ transform: worldTransform }}>
          <div className="backdrop" />
          <div className="about-scenario" />
          <div className="sky-parallax" style={{ transform: skyTransform }} aria-hidden="true"><i /><i /></div>
          <div className="moon-disc" />
          <div className="far-castles"><i /><i /><i /><i /></div>

          <section className="zone intro-zone" aria-labelledby="title">
            <div className="title-plaque"><span>CURRÍCULUM INTERACTIVO DE</span><h1 id="title">Gabriel<br/>Vázquez Ruiz</h1><p>FULL STACK DEVELOPER</p></div>
            <div className="tutorial"><b>DESPLÁZATE</b><span>↓ para avanzar&nbsp;&nbsp;·&nbsp;&nbsp;↑ para regresar</span></div>
            <div className="gate gate-one"><b>NIVEL 1</b></div>
          </section>

          <section className="zone profile-zone" aria-labelledby="perfil-title">
            <div className="legend legend-origin">
              <small>CAPÍTULO I · EL ORIGEN</small>
              <h2 id="perfil-title">Una leyenda escrita en código</h2>
              <p>En Guadalajara comenzó el viaje de un creador inquieto, guiado por la curiosidad y el deseo de convertir problemas complejos en experiencias claras.</p>
            </div>
            <div className="legend legend-calling">
              <small>EL LLAMADO</small>
              <h2>Construir, aprender y guiar</h2>
              <p>Durante más de ocho años ha creado productos web y móviles, liderado equipos y compartido conocimiento con nuevas generaciones.</p>
              <blockquote>“Meticuloso, innovador y orientado a resolver problemas.”</blockquote>
            </div>
            <div className="raven raven-distant" aria-hidden="true"><i /></div>
            <div className="wanderer" aria-hidden="true"><i /></div>
            <div className="castle-threshold"><span>LAS PUERTAS DEL OFICIO</span><b>ENTRAR AL CASTILLO</b></div>
            <div className="gate"><b>NIVEL 2</b></div>
          </section>

          <section className="zone skills-zone" aria-labelledby="skills-title">
            <div className="banner"><small>NIVEL 2</small><h2 id="skills-title">Arsenal técnico</h2></div>
            <div className="skill-towers">{skillGroups.map(([name,items,years],i)=><article key={name} style={{"--height":`${66+i%2*14}%`} as React.CSSProperties}><div><small>{years}</small><h3>{name}</h3><p>{items}</p></div></article>)}</div>
            <div className="gate"><b>NIVEL 3</b></div>
          </section>

          <section className="zone jobs-zone" aria-labelledby="jobs-title">
            <div className="banner"><small>NIVEL 3</small><h2 id="jobs-title">Reinos servidos</h2></div>
            <div className="job-scrolls">{jobs.slice(0,3).map(([name,date,text])=><article key={name}><time>{date}</time><h3>{name}</h3><p>{text}</p></article>)}</div>
            <div className="gate"><b>NIVEL 4</b></div>
          </section>

          <section className="zone jobs-zone jobs-two" aria-label="Experiencia reciente">
            <div className="banner"><small>NIVEL 4</small><h2>Batallas recientes</h2></div>
            <div className="job-scrolls">{jobs.slice(3).map(([name,date,text])=><article key={name}><time>{date}</time><h3>{name}</h3><p>{text}</p></article>)}</div>
            <div className="gate"><b>NIVEL 5</b></div>
          </section>

          <section className="zone education-zone" aria-labelledby="education-title">
            <div className="banner"><small>NIVEL 5</small><h2 id="education-title">La academia</h2></div>
            <div className="academy">
              <article><time>2010—2015</time><h3>Ingeniería en Sistemas Computacionales</h3><p>Instituto Tecnológico José Mario Molina</p></article>
              <article><time>2006—2009</time><h3>Profesional Técnico Bachiller en Informática</h3><p>CONALEP Guadalajara II</p></article>
            </div>
            <div className="gate"><b>NIVEL 6</b></div>
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

        <div className={`player motion-${motion} ${backwards ? "backwards" : ""}`} style={{ left: `${heroX}vw` }} aria-hidden="true"><i /></div>
        <div className="castle-wall-transition castle-wall-back" style={{ transform: layerTransform(260) }} aria-hidden="true" />
        <div className="castle-wall-transition castle-wall-front" style={{ transform: layerTransform(260) }} aria-hidden="true" />
        <div className="foreground-post" style={{ transform: layerTransform(72) }} aria-hidden="true">
          <div className="raven raven-foreground"><i /></div>
        </div>
        <div className="scroll-prompt">SCROLL PARA CAMINAR <span>↕</span></div>
      </div>
    </main>
  );
}
