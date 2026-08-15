import { ref } from "vue";
import { defineStore } from "pinia";
import type { SceneLocationNotice } from "@/components/modals/scenes/types";
import { useSettingsStore } from "@/stores/settings";
import type { SceneModalPalette } from "@/types/settings";

const DEFAULT_DURATION_MS = 2300;
const EXIT_TRANSITION_MS = 320;

export const useSceneModalStore = defineStore("scene-modals", () => {
  const settingsStore = useSettingsStore();
  const current = ref<SceneLocationNotice | null>(null);
  const visible = ref(false);
  const presentationKey = ref(0);
  const currentDurationMs = ref(DEFAULT_DURATION_MS);
  const currentPalette = ref<SceneModalPalette>(settingsStore.getSceneModalPalette());
  const lastLocationId = ref<string | null>(null);
  let dismissTimer: ReturnType<typeof setTimeout> | undefined;

  function clearTimer() {
    if (!dismissTimer) return;
    clearTimeout(dismissTimer);
    dismissTimer = undefined;
  }

  function hide() {
    clearTimer();
    visible.value = false;
  }

  function showNotice(notice: SceneLocationNotice) {
    clearTimer();
    const configuredDuration = settingsStore.sceneModalDurationSeconds * 1000;
    const durationMs = notice.durationMs ?? configuredDuration ?? DEFAULT_DURATION_MS;
    current.value = notice;
    currentDurationMs.value = durationMs;
    currentPalette.value = settingsStore.getSceneModalPalette(notice.paletteId);
    presentationKey.value += 1;
    visible.value = true;
    dismissTimer = setTimeout(hide, Math.max(300, durationMs - EXIT_TRANSITION_MS));
  }

  function announceLocation(notice: SceneLocationNotice) {
    if (lastLocationId.value === notice.id) return;
    lastLocationId.value = notice.id;
    showNotice(notice);
  }

  function resetLocation() {
    hide();
    lastLocationId.value = null;
    current.value = null;
  }

  return {
    current,
    visible,
    presentationKey,
    currentDurationMs,
    currentPalette,
    showNotice,
    announceLocation,
    hide,
    resetLocation,
  };
});
