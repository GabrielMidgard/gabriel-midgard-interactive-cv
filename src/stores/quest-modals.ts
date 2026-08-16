import { ref } from "vue";
import { defineStore } from "pinia";
import type { QuestScrollNotice } from "@/components/modals/quests/types";
import { useSettingsStore } from "@/stores/settings";

const DEFAULT_DURATION_MS = 3000;
const EXIT_TRANSITION_MS = 700;

export const useQuestModalStore = defineStore("quest-modals", () => {
  const settingsStore = useSettingsStore();
  const current = ref<QuestScrollNotice | null>(null);
  const visible = ref(false);
  const presentationKey = ref(0);
  const currentDurationMs = ref(DEFAULT_DURATION_MS);
  let dismissTimer: ReturnType<typeof setTimeout> | undefined;

  function clearTimer() {
    if (!dismissTimer) return;
    clearTimeout(dismissTimer);
    dismissTimer = undefined;
  }

  function hide() {
    visible.value = false;
  }

  function showNotice(notice: QuestScrollNotice) {
    clearTimer();
    const configuredDuration = settingsStore.questModalDurationSeconds * 1000;
    const durationMs = notice.durationMs ?? configuredDuration ?? DEFAULT_DURATION_MS;

    current.value = notice;
    currentDurationMs.value = durationMs;
    presentationKey.value += 1;
    visible.value = true;
    dismissTimer = setTimeout(hide, Math.max(300, durationMs - EXIT_TRANSITION_MS));
  }

  function reset() {
    clearTimer();
    hide();
    current.value = null;
  }

  return {
    current,
    visible,
    presentationKey,
    currentDurationMs,
    showNotice,
    hide,
    reset,
  };
});
