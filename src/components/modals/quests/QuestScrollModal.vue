<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { CssVariables } from "@/types/experience";
import type { QuestScrollNotice } from "./types";

const props = defineProps<{
  notice: QuestScrollNotice | null;
  visible: boolean;
  presentationKey: number;
  durationMs: number;
}>();

const heading = computed(() => props.notice?.heading.toLocaleUpperCase("es-MX") ?? "");
const touchOnly = ref(false);
const showKeyboardControls = ref(false);
const scrollLabel = computed(() => touchOnly.value ? "DESLIZA · AVANZAR" : "SCROLL · AVANZAR");
let controlsTimer: ReturnType<typeof setTimeout> | undefined;

function clearControlsTimer() {
  if (!controlsTimer) return;
  clearTimeout(controlsTimer);
  controlsTimer = undefined;
}

function scheduleKeyboardControls() {
  clearControlsTimer();
  showKeyboardControls.value = false;
  if (!props.visible || props.notice?.variant !== "scroll-guide" || touchOnly.value) return;
  controlsTimer = setTimeout(() => {
    showKeyboardControls.value = true;
    controlsTimer = undefined;
  }, 2000);
}

watch(
  [() => props.presentationKey, () => props.visible, () => props.notice?.variant, touchOnly],
  scheduleKeyboardControls,
  { immediate: true },
);

onMounted(() => {
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
  touchOnly.value = !hasFinePointer && navigator.maxTouchPoints > 0;
});

onBeforeUnmount(clearControlsTimer);

const modalStyle = computed(() => {
  const duration = Math.max(1500, props.durationMs);
  const openDuration = Math.min(860, Math.max(560, duration * 0.27));

  return {
    "--quest-duration": `${duration}ms`,
    "--quest-open-duration": `${openDuration}ms`,
    "--quest-heading-delay": `${openDuration * 0.72}ms`,
    "--quest-panel-delay": `${openDuration * 0.94}ms`,
  } as CssVariables;
});
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-active-class="$style.enterActive"
      :leave-active-class="$style.leaveActive"
      :enter-from-class="$style.enterFrom"
      :leave-to-class="$style.leaveTo"
    >
      <aside
        v-if="visible && notice"
        :key="presentationKey"
        :class="[
          $style.notice,
          $style[notice.tone ?? 'parchment'],
          { [$style.scrollGuideNotice]: notice.variant === 'scroll-guide' },
        ]"
        :style="modalStyle"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div :class="$style.scrollHeader">
          <div :class="$style.sheet">
            <h2>{{ heading }}</h2>
          </div>
          <span :class="[$style.roller, $style.leftRoller]" aria-hidden="true" />
          <span :class="[$style.roller, $style.rightRoller]" aria-hidden="true" />
        </div>

        <div
          :class="[
            $style.details,
            { [$style.scrollDetails]: notice.variant === 'scroll-guide' },
          ]"
        >
          <template v-if="notice.variant === 'scroll-guide'">
            <div
              :class="$style.scrollInstruction"
              aria-label="Scroll, flecha arriba o W para avanzar; flecha abajo o S para regresar"
            >
              <Transition
                mode="out-in"
                :enter-active-class="$style.controlEnter"
                :leave-active-class="$style.controlLeave"
              >
                <div v-if="!showKeyboardControls" key="scroll" :class="$style.controlView">
                  <div :class="[$style.gesture, { [$style.touch]: touchOnly }]" aria-hidden="true">
                    <i />
                    <span>⌄</span>
                  </div>
                  <p>{{ scrollLabel }}</p>
                </div>
                <div v-else key="keyboard" :class="$style.controlView">
                  <div :class="$style.arrowKeyboard" aria-hidden="true">
                    <i :class="[$style.key, $style.upKey]">↑</i>
                    <i :class="[$style.key, $style.leftKey]">←</i>
                    <i :class="[$style.key, $style.downKey]">↓</i>
                    <i :class="[$style.key, $style.rightKey]">→</i>
                  </div>
                  <p>↑ AVANZAR · ↓ REGRESAR</p>
                </div>
              </Transition>
            </div>
          </template>
          <template v-else>
            <h3 v-if="notice.title">{{ notice.title }}</h3>
            <p v-if="notice.description"><i aria-hidden="true">◇</i>{{ notice.description }}</p>
          </template>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style module lang="scss" src="./QuestScrollModal.module.scss"></style>
