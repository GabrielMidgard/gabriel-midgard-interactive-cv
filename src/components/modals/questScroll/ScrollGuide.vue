<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type ControlPhase = "mouse" | "arrows" | "wasd";

withDefaults(defineProps<{
  size?: "modal" | "compact";
}>(), {
  size: "modal",
});

const phases: readonly ControlPhase[] = ["mouse", "arrows", "wasd"];
const phaseDurationMs: Record<ControlPhase, number> = {
  mouse: 3000,
  arrows: 2000,
  wasd: 2000,
};

const phase = ref<ControlPhase>("mouse");
const touchOnly = ref(false);
const mouseLabel = computed(() => touchOnly.value ? "DESLIZA · AVANZAR" : "SCROLL · AVANZAR");
let phaseTimer: ReturnType<typeof setTimeout> | undefined;

function clearPhaseTimer() {
  if (!phaseTimer) return;
  clearTimeout(phaseTimer);
  phaseTimer = undefined;
}

function scheduleNextPhase() {
  clearPhaseTimer();
  if (touchOnly.value) return;
  phaseTimer = setTimeout(() => {
    const nextIndex = (phases.indexOf(phase.value) + 1) % phases.length;
    phase.value = phases[nextIndex];
    scheduleNextPhase();
  }, phaseDurationMs[phase.value]);
}

onMounted(() => {
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
  touchOnly.value = !hasFinePointer && navigator.maxTouchPoints > 0;
  scheduleNextPhase();
});

onBeforeUnmount(clearPhaseTimer);
</script>

<template>
  <div
    :class="[$style.hint, $style[size]]"
    aria-label="Scroll, flecha arriba o W para avanzar; flecha abajo o S para regresar"
  >
    <Transition
      mode="out-in"
      :enter-active-class="$style.controlEnter"
      :leave-active-class="$style.controlLeave"
    >
      <div v-if="phase === 'mouse'" key="mouse" :class="$style.controlView">
        <div :class="[$style.gesture, { [$style.touch]: touchOnly }]" aria-hidden="true">
          <i />
          <span>⌄</span>
        </div>
        <p>{{ mouseLabel }}</p>
      </div>

      <div v-else-if="phase === 'arrows'" key="arrows" :class="$style.controlView">
        <div :class="$style.arrowKeyboard" aria-hidden="true">
          <i :class="[$style.key, $style.upKey, $style.forwardKey]">↑</i>
          <i :class="[$style.key, $style.leftKey]">←</i>
          <i :class="[$style.key, $style.downKey, $style.backwardKey]">↓</i>
          <i :class="[$style.key, $style.rightKey]">→</i>
        </div>
        <p>↑ AVANZAR · ↓ REGRESAR</p>
      </div>

      <div v-else key="wasd" :class="$style.controlView">
        <div :class="$style.wsKeyboard" aria-hidden="true">
          <i :class="[$style.key, $style.wKey, $style.forwardKey]">W</i>
          <i :class="[$style.key, $style.aKey]">A</i>
          <i :class="[$style.key, $style.sKey, $style.backwardKey]">S</i>
          <i :class="[$style.key, $style.dKey]">D</i>
        </div>
        <p>W AVANZAR · S REGRESAR</p>
      </div>
    </Transition>
  </div>
</template>

<style module lang="scss" src="./ScrollGuide.module.scss"></style>
