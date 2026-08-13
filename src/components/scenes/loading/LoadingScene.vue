<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { CssVariables } from "@/types/experience";
import type { ExperienceMode } from "@/types/settings";

const props = defineProps<{
  durationSeconds: number;
  modeSelectorEnabled: boolean;
  modes: Array<{ id: string } & ExperienceMode>;
  activeModeId: string;
}>();
const emit = defineEmits<{
  complete: [];
  selectMode: [modeId: string];
}>();
const leaving = ref(false);

const stars = [
  [9, 12, 0.2, 1.2], [15, 24, 1.8, 0.7], [22, 10, 3.1, 0.9],
  [31, 18, 0.8, 1.1], [39, 8, 2.3, 0.65], [47, 21, 4.2, 0.8],
  [54, 11, 1.2, 1.3], [62, 26, 3.7, 0.65], [70, 15, 0.4, 1],
  [77, 7, 2.8, 0.75], [85, 22, 4.8, 1.15], [92, 13, 1.5, 0.7],
  [18, 35, 4.1, 0.6], [34, 31, 2.1, 0.75], [66, 36, 1.1, 0.55],
  [81, 33, 3.3, 0.7], [88, 42, 0.7, 0.5], [57, 40, 4.6, 0.55],
] as const;

const embers = [
  [-30, 0.1, 0.9], [-18, 0.7, 1.2], [-7, 1.3, 0.8], [4, 0.3, 1.1],
  [15, 1.7, 0.75], [27, 0.9, 1], [36, 2.1, 0.7], [9, 2.7, 0.85],
] as const;

const sceneStyle = {
  "--loading-duration": `${Math.max(0.1, props.durationSeconds)}s`,
} as CssVariables;

let leaveTimer: number | undefined;
let completeTimer: number | undefined;
let previousOverflow = "";

onMounted(() => {
  const durationMs = Math.max(0, props.durationSeconds * 1000);
  const transitionMs = Math.min(900, durationMs);
  previousOverflow = document.body.style.overflow;
  window.scrollTo(0, 0);
  document.body.style.overflow = "hidden";
  leaveTimer = window.setTimeout(() => { leaving.value = true; }, durationMs - transitionMs);
  completeTimer = window.setTimeout(() => emit("complete"), durationMs);
});

onBeforeUnmount(() => {
  if (leaveTimer !== undefined) window.clearTimeout(leaveTimer);
  if (completeTimer !== undefined) window.clearTimeout(completeTimer);
  document.body.style.overflow = previousOverflow;
});

function starStyle(star: readonly [number, number, number, number]) {
  const [x, y, delay, size] = star;
  return {
    "--star-x": `${x}%`,
    "--star-y": `${y}%`,
    "--star-delay": `${delay}s`,
    "--star-size": `${size}px`,
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
    :class="[$style.loadingScene, leaving ? $style.leaving : '']"
    :style="sceneStyle"
    aria-label="Preparando la travesía"
    aria-live="polite"
  >
    <div :class="$style.background" aria-hidden="true" />
    <div :class="$style.stars" aria-hidden="true">
      <i v-for="(star, index) in stars" :key="index" :style="starStyle(star)" />
    </div>
    <div :class="$style.fireLight" aria-hidden="true" />

    <div :class="$style.characterStage" aria-hidden="true">
      <div :class="$style.shield"><i :class="$style.shieldBase" /><i :class="$style.shieldWarmth" /></div>
      <div :class="$style.knight"><i :class="$style.knightBase" /><i :class="$style.knightWarmth" /></div>
    </div>

    <div :class="$style.campfire" aria-hidden="true">
      <div :class="$style.logs"><i /><i /></div>
      <div :class="$style.flames"><i /><i /><i /><i /></div>
      <div :class="$style.embers">
        <i v-for="(ember, index) in embers" :key="index" :style="emberStyle(ember)" />
      </div>
    </div>

    <header :class="$style.title">
      <span>UNA TRAVESÍA INTERACTIVA</span>
      <strong>Gabriel Vázquez Ruiz</strong>
      <small>FULL STACK DEVELOPER</small>
    </header>

    <div :class="$style.loadingStatus"><span>ENCENDIENDO LA HOGUERA</span><div><i /></div></div>
    <nav v-if="modeSelectorEnabled" :class="$style.modeSelector" aria-label="Selecciona la experiencia">
      <button
        v-for="mode in modes"
        :key="mode.id"
        type="button"
        :class="mode.id === activeModeId ? $style.selectedMode : ''"
        :aria-pressed="mode.id === activeModeId"
        @click="emit('selectMode', mode.id)"
      >
        <strong>{{ mode.label }}</strong>
        <span>{{ mode.description }}</span>
      </button>
    </nav>
    <div :class="$style.transitionVeil" aria-hidden="true" />
  </section>
</template>

<style module lang="scss" src="./LoadingScene.module.scss"></style>
