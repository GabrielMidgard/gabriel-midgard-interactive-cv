import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_SETTINGS } from "@/config/default-settings";
import { SCENE_IDS } from "@/types/settings";
import type { ExperienceMode, RuntimeSettings, SceneId } from "@/types/settings";

const SETTINGS_URL = "/settings.json";
const MODE_STORAGE_KEY = "gabriel-midgard-experience-mode";
const sceneIds = new Set<string>(SCENE_IDS);

function cloneDefaults(): RuntimeSettings {
  return structuredClone(DEFAULT_SETTINGS);
}

function normalizeMode(value: unknown): ExperienceMode | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<ExperienceMode>;
  if (typeof candidate.label !== "string" || !Array.isArray(candidate.scenes)) return null;

  const scenes = candidate.scenes.filter(
    (scene): scene is SceneId => typeof scene === "string" && sceneIds.has(scene),
  );

  return {
    enabled: candidate.enabled !== false,
    label: candidate.label,
    description: typeof candidate.description === "string" ? candidate.description : "",
    scenes,
    features: {
      map: candidate.features?.map === true,
      menu: candidate.features?.menu === true,
      inventory: candidate.features?.inventory === true,
    },
  };
}

function normalizeSettings(value: unknown): RuntimeSettings {
  if (!value || typeof value !== "object") throw new Error("settings.json debe contener un objeto");
  const candidate = value as Partial<RuntimeSettings>;
  const modes = Object.fromEntries(
    Object.entries(candidate.modes ?? {})
      .map(([id, mode]) => [id, normalizeMode(mode)] as const)
      .filter((entry): entry is [string, ExperienceMode] => entry[1] !== null),
  );
  const enabledModes = Object.entries(modes).filter(([, mode]) => mode.enabled);
  if (!enabledModes.length) throw new Error("settings.json necesita al menos un modo habilitado");

  const requestedDefault = typeof candidate.defaultMode === "string"
    ? candidate.defaultMode
    : "";
  const defaultMode = modes[requestedDefault]?.enabled
    ? requestedDefault
    : enabledModes[0][0];

  return {
    version: typeof candidate.version === "number" ? candidate.version : 1,
    defaultMode,
    rememberLastMode: candidate.rememberLastMode === true,
    loading: {
      durationSeconds: Math.max(0, Math.min(60, Number(candidate.loading?.durationSeconds) || 0)),
      modeSelectorEnabled: candidate.loading?.modeSelectorEnabled === true,
    },
    modes,
  };
}

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<RuntimeSettings>(cloneDefaults());
  const activeModeId = ref(DEFAULT_SETTINGS.defaultMode);
  const isReady = ref(false);
  const usedFallback = ref(false);

  const enabledModes = computed(() =>
    Object.entries(settings.value.modes)
      .filter(([, mode]) => mode.enabled)
      .map(([id, mode]) => ({ id, ...mode })),
  );
  const activeMode = computed(() =>
    settings.value.modes[activeModeId.value] ?? enabledModes.value[0],
  );
  const loadingDurationSeconds = computed(() => settings.value.loading.durationSeconds);
  const modeSelectorEnabled = computed(() =>
    settings.value.loading.modeSelectorEnabled && enabledModes.value.length > 1,
  );

  function hasScene(scene: SceneId) {
    return activeMode.value?.scenes.includes(scene) ?? false;
  }

  function selectMode(modeId: string) {
    if (!settings.value.modes[modeId]?.enabled) return;
    activeModeId.value = modeId;
    if (settings.value.rememberLastMode) localStorage.setItem(MODE_STORAGE_KEY, modeId);
  }

  async function loadSettings() {
    try {
      const response = await fetch(`${SETTINGS_URL}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`No se pudo cargar ${SETTINGS_URL}`);
      settings.value = normalizeSettings(await response.json());
    } catch (error) {
      console.warn("Se utilizará la configuración segura integrada.", error);
      settings.value = cloneDefaults();
      usedFallback.value = true;
    }

    const rememberedMode = settings.value.rememberLastMode
      ? localStorage.getItem(MODE_STORAGE_KEY)
      : null;
    selectMode(rememberedMode ?? settings.value.defaultMode);
    isReady.value = true;
  }

  return {
    settings,
    activeModeId,
    activeMode,
    enabledModes,
    isReady,
    usedFallback,
    loadingDurationSeconds,
    modeSelectorEnabled,
    hasScene,
    selectMode,
    loadSettings,
  };
});
