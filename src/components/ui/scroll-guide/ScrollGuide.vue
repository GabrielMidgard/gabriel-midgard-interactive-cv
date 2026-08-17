<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { adventureScrollTutorial } from "@/config/quest-modal-notices";
import { useQuestModalStore } from "@/stores/quest-modals";
import { useSceneModalStore } from "@/stores/scene-modals";
import { useSettingsStore } from "@/stores/settings";

const INITIAL_TUTORIAL_DELAY_MS = 1000;
const AFTER_SCENE_DELAY_MS = 100;

const settingsStore = useSettingsStore();
const questModalStore = useQuestModalStore();
const sceneModalStore = useSceneModalStore();
const {
  scrollGuideInactivitySeconds,
  scrollGuideDismissDelaySeconds,
} = storeToRefs(settingsStore);
const {
  current: currentQuestModal,
  visible: questModalVisible,
} = storeToRefs(questModalStore);
const { locked: sceneModalLocked } = storeToRefs(sceneModalStore);

const initialTutorialVisible = ref(false);
const reminderVisible = ref(false);
const initialHintCompleted = ref(false);
const touchOnly = ref(false);

const label = computed(() => touchOnly.value ? "DESLIZA · AVANZAR" : "SCROLL · AVANZAR");

let revealPending = false;
let dismissTimer: ReturnType<typeof setTimeout> | undefined;
let inactivityTimer: ReturnType<typeof setTimeout> | undefined;
let initialPresentationTimer: ReturnType<typeof setTimeout> | undefined;
let deferredRevealTimer: ReturnType<typeof setTimeout> | undefined;
let lastScrollY = 0;
let lastTouchY: number | undefined;

function isTutorialCurrent() {
  return currentQuestModal.value?.id === adventureScrollTutorial.id;
}

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

function clearDeferredRevealTimer() {
  if (!deferredRevealTimer) return;
  clearTimeout(deferredRevealTimer);
  deferredRevealTimer = undefined;
}

function requestInitialTutorial() {
  if (initialHintCompleted.value) return;
  clearDeferredRevealTimer();

  const anotherQuestIsVisible = questModalVisible.value && !isTutorialCurrent();
  if (sceneModalLocked.value || anotherQuestIsVisible) {
    revealPending = true;
    return;
  }

  revealPending = false;
  initialTutorialVisible.value = true;
  questModalStore.showNotice(adventureScrollTutorial, false);
}

function deferPendingTutorial() {
  clearDeferredRevealTimer();
  deferredRevealTimer = setTimeout(requestInitialTutorial, AFTER_SCENE_DELAY_MS);
}

function scheduleInactivityHint() {
  clearInactivityTimer();
  inactivityTimer = setTimeout(() => {
    inactivityTimer = undefined;
    if (sceneModalLocked.value || questModalVisible.value) {
      scheduleInactivityHint();
      return;
    }
    clearDismissTimer();
    reminderVisible.value = true;
  }, scrollGuideInactivitySeconds.value * 1000);
}

function scheduleDismiss() {
  if ((!initialTutorialVisible.value && !reminderVisible.value) || dismissTimer) return;
  dismissTimer = setTimeout(() => {
    initialTutorialVisible.value = false;
    reminderVisible.value = false;
    if (isTutorialCurrent() && questModalVisible.value) questModalStore.hide();
    dismissTimer = undefined;
  }, scrollGuideDismissDelaySeconds.value * 1000);
}

function registerMovement(direction: "forward" | "backward") {
  if (!initialHintCompleted.value) {
    if (!initialTutorialVisible.value || direction !== "forward") return;
    initialHintCompleted.value = true;
  }

  revealPending = false;
  clearDeferredRevealTimer();
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

watch(
  [sceneModalLocked, questModalVisible],
  ([sceneLocked, questVisible]) => {
    if (sceneLocked) {
      reminderVisible.value = false;
      if (initialTutorialVisible.value && isTutorialCurrent()) {
        initialTutorialVisible.value = false;
        questModalStore.hide();
        revealPending = true;
      }
      return;
    }

    if (!questVisible && revealPending) deferPendingTutorial();
  },
);

onMounted(() => {
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
  touchOnly.value = !hasFinePointer && navigator.maxTouchPoints > 0;
  lastScrollY = window.scrollY;
  window.addEventListener("wheel", handleWheel, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  initialPresentationTimer = setTimeout(requestInitialTutorial, INITIAL_TUTORIAL_DELAY_MS);
});

onBeforeUnmount(() => {
  window.removeEventListener("wheel", handleWheel);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("touchstart", handleTouchStart);
  window.removeEventListener("touchmove", handleTouchMove);
  clearDismissTimer();
  clearInactivityTimer();
  clearDeferredRevealTimer();
  if (initialPresentationTimer) clearTimeout(initialPresentationTimer);
  if (isTutorialCurrent()) questModalStore.reset();
});
</script>

<template>
  <Transition :enter-active-class="$style.enter" :leave-active-class="$style.leave">
    <aside
      v-if="reminderVisible"
      :class="$style.guide"
      aria-label="Scroll, flecha arriba o W para avanzar; flecha abajo o S para regresar"
    >
      <div :class="[$style.gesture, { [$style.touch]: touchOnly }]" aria-hidden="true">
        <i />
        <span>⌄</span>
      </div>
      <p>{{ label }}</p>
    </aside>
  </Transition>
</template>

<style module lang="scss" src="./ScrollGuide.module.scss"></style>
