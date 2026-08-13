import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  CASTLE_WALLS_START_VW,
  ENCHANTED_FOREST_WIDTH_VW,
  FANTASTIC_TOWN_WIDTH_VW,
  WORLD_TRAVEL_VW,
} from "@/config/world";
import type { MotionState } from "@/types/experience";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.max(minimum, Math.min(maximum, value));

export const useExperienceStore = defineStore("experience", () => {
  const isLoading = ref(true);
  const loadingStarted = ref(false);
  const progress = ref(0);
  const motion = ref<MotionState>("idle");
  const backwards = ref(false);
  const level = ref(0);
  const townPan = ref(0);
  const forestPan = ref(0);

  let lastScrollY = 0;
  let phaseTimer: ReturnType<typeof setTimeout> | undefined;
  let stopTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollFrame: number | undefined;
  let listening = false;

  const travelVw = computed(() => progress.value * WORLD_TRAVEL_VW);
  const travelVh = computed(() => progress.value * 178);
  const castleTravel = computed(() =>
    Math.max(0, travelVw.value - CASTLE_WALLS_START_VW),
  );
  const skyPhase = computed(() => Math.min(1, 0.32 + castleTravel.value / 360));
  const heroX = computed(() => Math.min(29, 8 + travelVw.value * (75 / 700)));
  const worldTransform = computed(
    () => `translate3d(calc(-${travelVw.value}vw - ${travelVh.value}vh), 0, 0)`,
  );

  function layerTransform(originVw: number) {
    return `translate3d(calc(${originVw - travelVw.value}vw - ${travelVh.value}vh), 0, 0)`;
  }

  function changeMotion(next: MotionState) {
    motion.value = next;
  }

  function beginRun() {
    if (phaseTimer) clearTimeout(phaseTimer);
    changeMotion("starting");
    phaseTimer = setTimeout(() => changeMotion("running"), 55);
  }

  function scheduleStop() {
    if (stopTimer) clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      if (phaseTimer) clearTimeout(phaseTimer);
      changeMotion("stopping");
      phaseTimer = setTimeout(() => changeMotion("idle"), 80);
    }, 130);
  }

  function updateFromScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const nextProgress = maxScroll ? clamp(window.scrollY / maxScroll) : 0;
    const wallScene = window.innerHeight * 1.78;
    const position = nextProgress * (
      window.innerWidth * (WORLD_TRAVEL_VW / 100) + wallScene
    );
    const townScene = window.innerWidth * (FANTASTIC_TOWN_WIDTH_VW / 100);
    const forestScene = window.innerWidth * (ENCHANTED_FOREST_WIDTH_VW / 100);
    const forestPosition = position - townScene;
    const castlePosition = forestPosition - forestScene;
    const screen = (castlePosition - wallScene) / window.innerWidth;

    progress.value = nextProgress;
    townPan.value = Math.min(1, position / townScene);
    forestPan.value = clamp(forestPosition / forestScene);
    level.value = position < townScene
      ? 0
      : forestPosition < forestScene
        ? 1
        : castlePosition < window.innerWidth * 3 + wallScene
          ? 2
          : Math.min(7, Math.floor(screen));

    if (Math.abs(window.scrollY - lastScrollY) > 1) {
      backwards.value = window.scrollY < lastScrollY;
      if (motion.value === "idle" || motion.value === "stopping") beginRun();
      scheduleStop();
    }
    lastScrollY = window.scrollY;
  }

  function requestUpdate() {
    if (scrollFrame !== undefined) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = undefined;
      updateFromScroll();
    });
  }

  function startNavigation() {
    if (listening) return;
    listening = true;
    lastScrollY = window.scrollY;
    updateFromScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  }

  function stopNavigation() {
    if (!listening) return;
    listening = false;
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
    if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame);
    if (phaseTimer) clearTimeout(phaseTimer);
    if (stopTimer) clearTimeout(stopTimer);
  }

  function finishLoading() {
    isLoading.value = false;
  }

  function startLoading() {
    loadingStarted.value = true;
  }

  return {
    isLoading,
    loadingStarted,
    progress,
    motion,
    backwards,
    level,
    townPan,
    forestPan,
    travelVw,
    travelVh,
    skyPhase,
    heroX,
    worldTransform,
    layerTransform,
    startNavigation,
    stopNavigation,
    finishLoading,
    startLoading,
  };
});
