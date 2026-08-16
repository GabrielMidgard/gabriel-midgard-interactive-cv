import { ref } from "vue";
import { defineStore } from "pinia";
import type { SceneLocationNotice } from "@/components/modals/scenes/types";
import { useSettingsStore } from "@/stores/settings";
import type { SceneModalPalette } from "@/types/settings";

const DEFAULT_DURATION_MS = 2300;
const EXIT_TRANSITION_MS = 320;

interface PendingNotice {
  notice: SceneLocationNotice;
  trackLocation: boolean;
}

export const useSceneModalStore = defineStore("scene-modals", () => {
  const settingsStore = useSettingsStore();
  const current = ref<SceneLocationNotice | null>(null);
  const visible = ref(false);
  const presentationKey = ref(0);
  const currentDurationMs = ref(DEFAULT_DURATION_MS);
  const currentPalette = ref<SceneModalPalette>(settingsStore.getSceneModalPalette());
  const lastLocationId = ref<string | null>(null);
  const locked = ref(false);
  const travelSuppressed = ref(false);
  let pendingNotice: PendingNotice | null = null;
  let dismissTimer: ReturnType<typeof setTimeout> | undefined;
  let unlockTimer: ReturnType<typeof setTimeout> | undefined;

  function clearTimers() {
    if (dismissTimer) clearTimeout(dismissTimer);
    if (unlockTimer) clearTimeout(unlockTimer);
    dismissTimer = undefined;
    unlockTimer = undefined;
  }

  function hide() {
    visible.value = false;
  }

  function presentNotice(notice: SceneLocationNotice, trackLocation: boolean) {
    clearTimers();
    const configuredDuration = settingsStore.sceneModalDurationSeconds * 1000;
    const durationMs = notice.durationMs ?? configuredDuration ?? DEFAULT_DURATION_MS;
    if (trackLocation) lastLocationId.value = notice.id;
    current.value = notice;
    currentDurationMs.value = durationMs;
    currentPalette.value = settingsStore.getSceneModalPalette(notice.paletteId);
    presentationKey.value += 1;
    locked.value = true;
    visible.value = true;
    dismissTimer = setTimeout(hide, Math.max(300, durationMs - EXIT_TRANSITION_MS));
    unlockTimer = setTimeout(finishPresentation, Math.max(300, durationMs));
  }

  function finishPresentation() {
    dismissTimer = undefined;
    unlockTimer = undefined;
    locked.value = false;

    if (travelSuppressed.value || !pendingNotice) {
      if (travelSuppressed.value) pendingNotice = null;
      return;
    }

    const next = pendingNotice;
    pendingNotice = null;
    if (next.trackLocation && lastLocationId.value === next.notice.id) return;
    presentNotice(next.notice, next.trackLocation);
  }

  function requestNotice(notice: SceneLocationNotice, trackLocation: boolean) {
    if (travelSuppressed.value) return;

    if (locked.value) {
      if (current.value?.id === notice.id) {
        pendingNotice = null;
        return;
      }
      pendingNotice = { notice, trackLocation };
      return;
    }

    presentNotice(notice, trackLocation);
  }

  function showNotice(notice: SceneLocationNotice) {
    requestNotice(notice, false);
  }

  function announceLocation(notice: SceneLocationNotice) {
    if (locked.value && current.value?.id === notice.id) {
      pendingNotice = null;
      return;
    }
    if (lastLocationId.value === notice.id) return;
    requestNotice(notice, true);
  }

  function setTravelSuppressed(suppressed: boolean) {
    travelSuppressed.value = suppressed;
    if (suppressed) pendingNotice = null;
  }

  function resetLocation() {
    clearTimers();
    hide();
    locked.value = false;
    travelSuppressed.value = false;
    pendingNotice = null;
    lastLocationId.value = null;
    current.value = null;
  }

  return {
    current,
    visible,
    presentationKey,
    currentDurationMs,
    currentPalette,
    locked,
    travelSuppressed,
    showNotice,
    announceLocation,
    setTravelSuppressed,
    hide,
    resetLocation,
  };
});
