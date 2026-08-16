<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();
const {
  scrollGuideInactivitySeconds,
  scrollGuideDismissDelaySeconds,
} = storeToRefs(settingsStore);
const visible = ref(true);
const touchOnly = ref(false);
const initialHintCompleted = ref(false);

const label = computed(() => touchOnly.value ? "DESLIZA · AVANZAR" : "SCROLL · AVANZAR");

let dismissTimer: ReturnType<typeof setTimeout> | undefined;
let inactivityTimer: ReturnType<typeof setTimeout> | undefined;
let lastScrollY = 0;
let lastTouchY: number | undefined;

function clearDismissTimer() {
  if (!dismissTimer) return;
  clearTimeout(dismissTimer);
  dismissTimer = undefined;
}

function clearInactivityTimer() {
  if (!inactivityTimer) return;
  clearTimeout(inactivityTimer);
  inactivityTimer = undefined;
}

function scheduleInactivityHint() {
  clearInactivityTimer();
  inactivityTimer = setTimeout(() => {
    clearDismissTimer();
    visible.value = true;
    inactivityTimer = undefined;
  }, scrollGuideInactivitySeconds.value * 1000);
}

function scheduleDismiss() {
  if (!visible.value || dismissTimer) return;
  dismissTimer = setTimeout(() => {
    visible.value = false;
    dismissTimer = undefined;
  }, scrollGuideDismissDelaySeconds.value * 1000);
}

function registerMovement(direction: "forward" | "backward") {
  if (!initialHintCompleted.value) {
    if (direction !== "forward") return;
    initialHintCompleted.value = true;
  }

  scheduleDismiss();
  scheduleInactivityHint();
}

function handleWheel(event: WheelEvent) {
  if (event.deltaY === 0) return;
  registerMovement(event.deltaY > 0 ? "forward" : "backward");
}

function handleScroll() {
  const nextScrollY = window.scrollY;
  if (nextScrollY === lastScrollY) return;
  registerMovement(nextScrollY > lastScrollY ? "forward" : "backward");
  lastScrollY = nextScrollY;
}

function handleTouchStart(event: TouchEvent) {
  lastTouchY = event.touches[0]?.clientY;
}

function handleTouchMove(event: TouchEvent) {
  const nextTouchY = event.touches[0]?.clientY;
  if (nextTouchY === undefined || lastTouchY === undefined || nextTouchY === lastTouchY) return;
  registerMovement(nextTouchY < lastTouchY ? "forward" : "backward");
  lastTouchY = nextTouchY;
}

onMounted(() => {
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
  touchOnly.value = !hasFinePointer && navigator.maxTouchPoints > 0;
  lastScrollY = window.scrollY;
  window.addEventListener("wheel", handleWheel, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("wheel", handleWheel);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("touchstart", handleTouchStart);
  window.removeEventListener("touchmove", handleTouchMove);
  clearDismissTimer();
  clearInactivityTimer();
});
</script>

<template>
  <Transition :enter-active-class="$style.enter" :leave-active-class="$style.leave">
    <aside v-if="visible" :class="$style.guide" aria-label="Instrucciones de desplazamiento">
      <div :class="[$style.gesture, { [$style.touch]: touchOnly }]" aria-hidden="true">
        <i />
        <span>⌄</span>
      </div>
      <p>{{ label }}</p>
    </aside>
  </Transition>
</template>

<style module lang="scss" src="./ScrollGuide.module.scss"></style>
