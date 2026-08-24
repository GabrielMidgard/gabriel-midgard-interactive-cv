<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import QuestScroll from "@/components/modals/questScroll/QuestScroll.vue";
import type { QuestScrollNotice } from "@/components/modals/questScroll/QuestScroll.types";
import type { CssVariables } from "@/types/experience";

const props = defineProps<{
  durationSeconds: number;
  transitionSeconds: number;
}>();

const emit = defineEmits<{
  complete: [];
}>();

const descending = ref(false);
const descentActive = ref(false);
const guideVisible = ref(false);
const runes = [..."ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋ"];

const stars = Array.from({ length: 46 }, (_, index) => ({
  x: (index * 37 + 9) % 98,
  y: (index * 53 + 6) % 92,
  delay: ((index * 19) % 38) / 10,
  duration: 2.7 + ((index * 13) % 23) / 10,
  size: 0.7 + ((index * 11) % 17) / 10,
}));

const embers = [
  [-30, 0.1, 0.9], [-18, 0.7, 1.2], [-7, 1.3, 0.8], [4, 0.3, 1.1],
  [15, 1.7, 0.75], [27, 0.9, 1], [36, 2.1, 0.7], [9, 2.7, 0.85],
  [-39, 1.9, 0.65], [-25, 2.4, 0.8], [-12, 2.9, 0.55], [2, 2.2, 0.7],
  [20, 0.45, 0.62], [31, 1.45, 0.78], [43, 2.55, 0.58], [12, 3.15, 0.68],
  [-46, 0.35, 0.52], [-34, 1.15, 0.68], [-3, 1.85, 0.58], [7, 3.4, 0.48],
  [24, 2.85, 0.55], [39, 1.05, 0.46], [-20, 3.65, 0.5], [47, 3.05, 0.44],
] as const;

const sceneStyle = {
  "--celestial-transition": `${Math.max(0.3, props.transitionSeconds)}s`,
} as CssVariables;

const startGuideNotice: QuestScrollNotice = {
  id: "celestial-start-guide",
  heading: "La senda está abierta",
  variant: "start-guide",
  tone: "royal",
};

let descentTimer: number | undefined;
let scrollTimer: number | undefined;
let guideTimer: number | undefined;
let previousOverflow = "";
let started = false;

function handleStart(event: KeyboardEvent) {
  if (started || !guideVisible.value) return;
  if (event.key !== "Enter" && event.code !== "Space") return;

  event.preventDefault();
  started = true;
  emit("complete");
}

onMounted(() => {
  previousOverflow = document.body.style.overflow;
  window.scrollTo(0, 0);
  document.body.style.overflow = "hidden";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const configuredTotalMs = Math.max(500, props.durationSeconds * 1000);
  const configuredTransitionMs = Math.min(
    configuredTotalMs,
    Math.max(300, props.transitionSeconds * 1000),
  );
  const transitionMs = prefersReducedMotion ? 360 : configuredTransitionMs;
  const contemplationMs = prefersReducedMotion
    ? 140
    : Math.max(0, configuredTotalMs - configuredTransitionMs);

  descentTimer = window.setTimeout(() => {
    descending.value = true;
    descentActive.value = true;
    scrollTimer = window.setTimeout(() => {
      descentActive.value = false;
    }, transitionMs);
    guideTimer = window.setTimeout(() => {
      guideVisible.value = true;
    }, transitionMs + 1000);
  }, contemplationMs);
  window.addEventListener("keydown", handleStart);
});

onBeforeUnmount(() => {
  if (descentTimer !== undefined) window.clearTimeout(descentTimer);
  if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
  if (guideTimer !== undefined) window.clearTimeout(guideTimer);
  window.removeEventListener("keydown", handleStart);
  document.body.style.overflow = previousOverflow;
});

function starStyle(star: (typeof stars)[number]) {
  return {
    "--star-x": `${star.x}%`,
    "--star-y": `${star.y}%`,
    "--star-delay": `${star.delay}s`,
    "--star-duration": `${star.duration}s`,
    "--star-size": `${star.size}px`,
  } as CssVariables;
}

function runeStyle(index: number) {
  return {
    "--rune-angle": `${index * (360 / runes.length)}deg`,
    "--rune-delay": `${index * -0.09}s`,
  } as CssVariables;
}

function emberStyle(ember: readonly [number, number, number]) {
  const [x, delay, scale] = ember;
  return {
    "--ember-x": `${x}px`,
    "--ember-delay": `${delay}s`,
    "--ember-scale": scale,
  } as CssVariables;
}

</script>

<template>
  <section
    :class="[
      $style.celestialIntro,
      descending ? $style.descending : '',
      descentActive ? $style.scrolling : '',
    ]"
    :style="sceneStyle"
    role="status"
    aria-label="El firmamento abre el camino hacia la aventura"
  >
    <div :class="$style.camera" aria-hidden="true">
      <div :class="$style.skyPanel">
        <div :class="$style.deepSky" />
        <div :class="$style.stars">
          <i v-for="(star, index) in stars" :key="index" :style="starStyle(star)" />
        </div>
        <div :class="$style.nebula"><i /><i /><i /></div>

        <div :class="$style.moonStage">
          <div :class="$style.outerOrbit" />
          <div :class="$style.runeOrbit">
            <i v-for="(rune, index) in runes" :key="rune" :style="runeStyle(index)">
              <b>{{ rune }}</b>
            </i>
          </div>
          <div :class="$style.innerOrbit" />
        </div>

        <div :class="$style.highClouds"><i /><i /><i /></div>
        <div :class="$style.horizon" />
      </div>

      <div :class="$style.loadingLanding">
        <div :class="$style.landingVignette" />
        <div :class="$style.landingActors" aria-hidden="true">
          <div :class="$style.landingFireLight" />
          <div :class="$style.landingCharacterStage">
            <div :class="$style.landingShield" />
            <div :class="$style.landingKnight" />
          </div>
          <div :class="$style.landingCampfire">
            <i />
            <i />
            <div :class="$style.landingEmbers">
              <i v-for="(ember, index) in embers" :key="index" :style="emberStyle(ember)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :class="$style.descentStreaks" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <span :class="$style.srOnly">Descendiendo hacia el inicio de la travesía.</span>
  </section>
  <QuestScroll
    :notice="guideVisible ? startGuideNotice : null"
    :visible="guideVisible"
    :presentation-key="1"
    :duration-ms="10000"
  />
</template>

<style module lang="scss" src="./CelestialIntro.module.scss"></style>
