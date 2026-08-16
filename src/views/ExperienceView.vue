<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import MainCharacter from "@/components/characters/main-character/MainCharacter.vue";
import CastleWalls from "@/components/scenes/castle-walls/CastleWalls.vue";
import EnchantedForest from "@/components/scenes/enchanted-forest/EnchantedForest.vue";
import FantasticTown from "@/components/scenes/fantastic-town/FantasticTown.vue";
import LoadingScene from "@/components/scenes/loading/LoadingScene.vue";
import {
  CASTLE_WALLS_START_VW,
  ENCHANTED_FOREST_START_VW,
  ENCHANTED_FOREST_WIDTH_VW,
  FANTASTIC_TOWN_WIDTH_VW,
  WORLD_WIDTH_VW,
} from "@/config/world";
import { useExperienceStore } from "@/stores/experience";
import { resolveSceneLocationNotice } from "@/config/scene-location-notices";
import { useSceneModalStore } from "@/stores/scene-modals";
import { useSettingsStore } from "@/stores/settings";
import type { CssVariables } from "@/types/experience";

const jobs = [
  ["Random estudio", "2013—2015", "Sitios web, apps híbridas, multimedia, UX y APIs RESTful."],
  ["Global Standards", "2015—2017", "Apps móviles, arquitectura de datos y soluciones de auditoría."],
  ["Weknow", "2017—2018", "PM y desarrollo de plataforma e-learning basada en Moodle."],
  ["GerzeLabs", "2018—2019", "Project Manager: 16 proyectos entregados en tiempo."],
  ["CONALEP GDL II", "2019—2021", "Docente de programación, desarrollo móvil y videojuegos."],
  ["Sustam", "2019—2020", "Full stack: rescate de proyectos, bugs, clientes y nuevos productos."],
] as const;

const skillGroups = [
  ["WEB", "PHP · HTML5 · CSS3 · JavaScript", "8 AÑOS"],
  ["PRODUCTO", "UX/UI · MySQL · Git", "8 AÑOS"],
  ["MÓVIL", "Android · SQLite · Java", "5+ AÑOS"],
  ["FRAMEWORKS", "Laravel · Vue.js · Firebase · Flutter", "1—3 AÑOS"],
] as const;

const experience = useExperienceStore();
const sceneModalStore = useSceneModalStore();
const settingsStore = useSettingsStore();
const {
  isLoading,
  loadingStarted,
  progress,
  motion,
  backwards,
  level,
  townPan,
  forestPan,
  isFastTravel,
  skyPhase,
  heroX,
  worldTransform,
} = storeToRefs(experience);
const {
  activeModeId,
  enabledModes,
  isReady: settingsReady,
  loadingDurationSeconds,
  modeSelectorEnabled,
} = storeToRefs(settingsStore);

const rootStyle = {
  "--world": `calc(${WORLD_WIDTH_VW}vw + 178vh)`,
  "--scroll-height": `calc(${WORLD_WIDTH_VW}vh + 178vw)`,
  "--town-width": `${FANTASTIC_TOWN_WIDTH_VW}vw`,
  "--pre-castle-width": `${CASTLE_WALLS_START_VW}vw`,
} as CssVariables;

const gameStyle = computed(() => ({
  "--sky-phase": skyPhase.value,
  "--town-pan-offset": `${townPan.value * -33.333}%`,
  "--forest-pan-offset": `${forestPan.value * -33.333}%`,
}) as CssVariables);

const livingTreeTransform = computed(() => experience.layerTransform(ENCHANTED_FOREST_START_VW));
const corruptedTreeTransform = computed(() =>
  experience.layerTransform(ENCHANTED_FOREST_START_VW + ENCHANTED_FOREST_WIDTH_VW),
);
const castleWallTransform = computed(() => experience.layerTransform(CASTLE_WALLS_START_VW + 260));
const foregroundPostTransform = computed(() => experience.layerTransform(CASTLE_WALLS_START_VW + 72));

onMounted(async () => {
  await settingsStore.loadSettings();
  experience.startLoading();
  experience.startNavigation();
});

watch(
  [isLoading, level, townPan, forestPan, isFastTravel],
  ([loading, currentLevel, currentTownPan, currentForestPan, fastTravel]) => {
    sceneModalStore.setTravelSuppressed(fastTravel);
    if (loading || fastTravel) return;
    sceneModalStore.announceLocation(
      resolveSceneLocationNotice(currentLevel, currentTownPan, currentForestPan),
    );
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  experience.stopNavigation();
  sceneModalStore.resetLocation();
});
</script>

<template>
  <main class="game-scroll" :style="rootStyle">
    <LoadingScene
      v-if="settingsReady && loadingStarted && isLoading"
      :duration-seconds="loadingDurationSeconds"
      :mode-selector-enabled="modeSelectorEnabled"
      :modes="enabledModes"
      :active-mode-id="activeModeId"
      @select-mode="settingsStore.selectMode"
      @complete="experience.finishLoading"
    />

    <div
      class="game"
      :style="gameStyle"
      aria-label="Currículum interactivo de Gabriel Vázquez Ruiz"
      :aria-hidden="isLoading"
    >
      <div class="fog fog-one" /><div class="fog fog-two" />
      <div class="game-hud">
        <div class="crest">GV</div>
        <div class="hud-copy"><strong>GABRIEL VÁZQUEZ RUIZ</strong><span>FULL STACK DEVELOPER</span></div>
        <div class="level-counter"><small>NIVEL</small><b>{{ String(level).padStart(2, "0") }}</b></div>
      </div>
      <div class="progress-track"><i :style="{ width: `${progress * 100}%` }" /></div>

      <div class="world" :style="{ transform: worldTransform }">
        <div class="backdrop" />
        <FantasticTown
          v-if="settingsStore.hasScene('fantastic-town')"
          :width-vw="FANTASTIC_TOWN_WIDTH_VW"
        />
        <EnchantedForest
          v-if="settingsStore.hasScene('enchanted-forest')"
          :start-vw="ENCHANTED_FOREST_START_VW"
          :width-vw="ENCHANTED_FOREST_WIDTH_VW"
          :living-tree-transform="livingTreeTransform"
          :corrupted-tree-transform="corruptedTreeTransform"
        />
        <CastleWalls
          v-if="settingsStore.hasScene('castle-walls')"
          :start-vw="CASTLE_WALLS_START_VW"
          :wall-transform="castleWallTransform"
          :post-transform="foregroundPostTransform"
        />
        <div class="moon-disc" />
        <div class="far-castles"><i /><i /><i /><i /></div>

        <section
          v-if="settingsStore.hasScene('skills')"
          class="zone skills-zone"
          aria-labelledby="skills-title"
        >
          <div class="banner"><small>NIVEL 3</small><h2 id="skills-title">Arsenal técnico</h2></div>
          <div class="skill-towers">
            <article
              v-for="([name, items, years], index) in skillGroups"
              :key="name"
              :style="{ '--height': `${66 + (index % 2) * 14}%` } as CssVariables"
            >
              <div><small>{{ years }}</small><h3>{{ name }}</h3><p>{{ items }}</p></div>
            </article>
          </div>
          <div class="gate"><b>NIVEL 4</b></div>
        </section>

        <section
          v-if="settingsStore.hasScene('experience')"
          class="zone jobs-zone"
          aria-labelledby="jobs-title"
        >
          <div class="banner"><small>NIVEL 4</small><h2 id="jobs-title">Reinos servidos</h2></div>
          <div class="job-scrolls">
            <article v-for="[name, date, text] in jobs.slice(0, 3)" :key="name">
              <time>{{ date }}</time><h3>{{ name }}</h3><p>{{ text }}</p>
            </article>
          </div>
          <div class="gate"><b>NIVEL 5</b></div>
        </section>

        <section
          v-if="settingsStore.hasScene('experience')"
          class="zone jobs-zone jobs-two"
          aria-label="Experiencia reciente"
        >
          <div class="banner"><small>NIVEL 5</small><h2>Batallas recientes</h2></div>
          <div class="job-scrolls">
            <article v-for="[name, date, text] in jobs.slice(3)" :key="name">
              <time>{{ date }}</time><h3>{{ name }}</h3><p>{{ text }}</p>
            </article>
          </div>
          <div class="gate"><b>NIVEL 6</b></div>
        </section>

        <section
          v-if="settingsStore.hasScene('education')"
          class="zone education-zone"
          aria-labelledby="education-title"
        >
          <div class="banner"><small>NIVEL 6</small><h2 id="education-title">La academia</h2></div>
          <div class="academy">
            <article><time>2010—2015</time><h3>Ingeniería en Sistemas Computacionales</h3><p>Instituto Tecnológico José Mario Molina</p></article>
            <article><time>2006—2009</time><h3>Profesional Técnico Bachiller en Informática</h3><p>CONALEP Guadalajara II</p></article>
          </div>
          <div class="gate"><b>NIVEL 7</b></div>
        </section>

        <section
          v-if="settingsStore.hasScene('contact')"
          class="zone contact-zone"
          aria-labelledby="contact-title"
        >
          <div class="final-shrine">
            <small>MISIÓN COMPLETADA</small><h2 id="contact-title">Construyamos algo memorable</h2>
            <p>¿Tienes una misión para mí?</p>
            <a href="mailto:gabriel.vazquezruiz@gmail.com">ENVIAR MENSAJE</a>
            <div>
              <a href="tel:+523316863730">33 1686 3730</a>
              <a href="https://portfolio.midgardsystems.com.mx" target="_blank" rel="noreferrer">PORTAFOLIO</a>
              <span>TLAQUEPAQUE, JAL.</span>
            </div>
          </div>
        </section>

        <div class="ground-layer"><i /><i /></div>
        <div class="foreground-trees"><i /><i /><i /><i /><i /><i /></div>
      </div>

      <MainCharacter :motion="motion" :backwards="backwards" :left="`${heroX}vw`" />
      <div class="scroll-prompt">SCROLL PARA CAMINAR <span>↕</span></div>
    </div>
  </main>
</template>
