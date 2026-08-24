<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type StartGuidePhase = "enter" | "space";

const phase = ref<StartGuidePhase>("enter");
const phaseDurationMs = 2000;
let phaseTimer: ReturnType<typeof setTimeout> | undefined;

function clearPhaseTimer() {
  if (!phaseTimer) return;
  clearTimeout(phaseTimer);
  phaseTimer = undefined;
}

function scheduleNextPhase() {
  clearPhaseTimer();
  phaseTimer = setTimeout(() => {
    phase.value = phase.value === "enter" ? "space" : "enter";
    scheduleNextPhase();
  }, phaseDurationMs);
}

onMounted(scheduleNextPhase);
onBeforeUnmount(clearPhaseTimer);
</script>

<template>
  <div
    :class="$style.controls"
    aria-label="Pulsa Enter o Espacio para comenzar"
  >
    <Transition
      mode="out-in"
      :enter-active-class="$style.controlEnter"
      :leave-active-class="$style.controlLeave"
    >
      <div v-if="phase === 'enter'" key="enter" :class="$style.controlView" aria-hidden="true">
        <i :class="[$style.key, $style.enterKey]">ENTER</i>
      </div>
      <div v-else key="space" :class="$style.controlView" aria-hidden="true">
        <i :class="[$style.key, $style.spaceKey]">ESPACIO</i>
      </div>
    </Transition>
    <p>ENTER · ESPACIO&nbsp; / &nbsp;COMENZAR</p>
  </div>
</template>

<style module lang="scss" src="./StartGuideControls.module.scss"></style>
