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

const FAST_TRAVEL_THRESHOLD_VH_PER_SECOND = 18;
const FAST_TRAVEL_RELEASE_MS = 220;
const KEYBOARD_TRAVEL_VH_PER_SECOND = 46;
const FORWARD_KEYS = new Set(["ArrowUp", "KeyW"]);
const BACKWARD_KEYS = new Set(["ArrowDown", "KeyS"]);

export const useExperienceStore = defineStore("experience", () => {
  const isLoading = ref(true);
  const loadingStarted = ref(false);
  const progress = ref(0);
  const motion = ref<MotionState>("idle");
  const backwards = ref(false);
  const level = ref(0);
  const townPan = ref(0);
  const forestPan = ref(0);
  const scrollVelocityVh = ref(0);
  const isFastTravel = ref(false);

  let lastScrollY = 0;
  let lastScrollAt = 0;
  let phaseTimer: ReturnType<typeof setTimeout> | undefined;
  let stopTimer: ReturnType<typeof setTimeout> | undefined;
  let fastTravelTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollFrame: number | undefined;
  let keyboardFrame: number | undefined;
  let keyboardFrameAt = 0;
  let keyboardTravelActive = false;
  let listening = false;
  const pressedTravelKeys = new Set<string>();

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

  function updateTravelSpeed(nextScrollY: number) {
    const now = performance.now();
    const elapsedMs = lastScrollAt
      ? Math.min(80, Math.max(8, now - lastScrollAt))
      : 16;
    const viewportHeight = Math.max(1, window.innerHeight);
    const distance = Math.abs(nextScrollY - lastScrollY);
    const instantaneousVelocity = (distance / viewportHeight) * (1000 / elapsedMs);
    const smoothedVelocity = scrollVelocityVh.value * 0.35 + instantaneousVelocity * 0.65;

    scrollVelocityVh.value = smoothedVelocity;

    if (keyboardTravelActive) {
      isFastTravel.value = false;
      if (fastTravelTimer) clearTimeout(fastTravelTimer);
      fastTravelTimer = setTimeout(() => {
        scrollVelocityVh.value = 0;
        isFastTravel.value = false;
      }, FAST_TRAVEL_RELEASE_MS);
      lastScrollAt = now;
      return;
    }

    if (
      instantaneousVelocity >= FAST_TRAVEL_THRESHOLD_VH_PER_SECOND
      || smoothedVelocity >= FAST_TRAVEL_THRESHOLD_VH_PER_SECOND
    ) {
      isFastTravel.value = true;
    } else if (
      isFastTravel.value
      && smoothedVelocity <= FAST_TRAVEL_THRESHOLD_VH_PER_SECOND * 0.55
    ) {
      isFastTravel.value = false;
    }

    if (fastTravelTimer) clearTimeout(fastTravelTimer);
    fastTravelTimer = setTimeout(() => {
      scrollVelocityVh.value = 0;
      isFastTravel.value = false;
    }, FAST_TRAVEL_RELEASE_MS);

    lastScrollAt = now;
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

    updateTravelSpeed(window.scrollY);

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

  function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable
      || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName);
  }

  function keyboardDirection() {
    const forward = pressedTravelKeys.has("ArrowUp") || pressedTravelKeys.has("KeyW");
    const backward = pressedTravelKeys.has("ArrowDown") || pressedTravelKeys.has("KeyS");
    return Number(forward) - Number(backward);
  }

  function pauseKeyboardTravel() {
    keyboardTravelActive = false;
    keyboardFrameAt = 0;
    if (keyboardFrame !== undefined) cancelAnimationFrame(keyboardFrame);
    keyboardFrame = undefined;
  }

  function stopKeyboardTravel() {
    pressedTravelKeys.clear();
    pauseKeyboardTravel();
  }

  function updateKeyboardTravel(now: number) {
    const direction = keyboardDirection();
    if (direction === 0) {
      pauseKeyboardTravel();
      return;
    }
    if (isLoading.value) {
      stopKeyboardTravel();
      return;
    }

    const elapsedSeconds = keyboardFrameAt
      ? Math.min(0.032, Math.max(0.008, (now - keyboardFrameAt) / 1000))
      : 1 / 60;
    keyboardFrameAt = now;
    keyboardTravelActive = true;
    window.scrollBy({
      top: direction * KEYBOARD_TRAVEL_VH_PER_SECOND * window.innerHeight * elapsedSeconds / 100,
      behavior: "auto",
    });
    keyboardFrame = requestAnimationFrame(updateKeyboardTravel);
  }

  function ensureKeyboardTravel() {
    if (keyboardFrame !== undefined || keyboardDirection() === 0) return;
    keyboardFrameAt = performance.now();
    keyboardFrame = requestAnimationFrame(updateKeyboardTravel);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (
      isLoading.value
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || isEditableTarget(event.target)
      || (!FORWARD_KEYS.has(event.code) && !BACKWARD_KEYS.has(event.code))
    ) return;

    event.preventDefault();
    pressedTravelKeys.add(event.code);
    ensureKeyboardTravel();
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (!FORWARD_KEYS.has(event.code) && !BACKWARD_KEYS.has(event.code)) return;
    event.preventDefault();
    pressedTravelKeys.delete(event.code);
    if (keyboardDirection() === 0) {
      pauseKeyboardTravel();
      return;
    }
    ensureKeyboardTravel();
  }

  function startNavigation() {
    if (listening) return;
    listening = true;
    lastScrollY = window.scrollY;
    lastScrollAt = performance.now();
    updateFromScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", stopKeyboardTravel);
  }

  function stopNavigation() {
    if (!listening) return;
    listening = false;
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", stopKeyboardTravel);
    stopKeyboardTravel();
    if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame);
    if (phaseTimer) clearTimeout(phaseTimer);
    if (stopTimer) clearTimeout(stopTimer);
    if (fastTravelTimer) clearTimeout(fastTravelTimer);
    scrollVelocityVh.value = 0;
    isFastTravel.value = false;
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
    scrollVelocityVh,
    isFastTravel,
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
