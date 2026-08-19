import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { DEFAULT_SETTINGS } from "@/config/default-settings";
import { SCENE_IDS } from "@/types/settings";
import type {
  ExperienceMode,
  RuntimeSettings,
  SceneDomain,
  SceneId,
  SceneModalPalette,
} from "@/types/settings";

const SETTINGS_URL = "/settings.json";
const MODE_STORAGE_KEY = "gabriel-midgard-experience-mode";
const sceneIds = new Set<string>(SCENE_IDS);
const MIN_SCENE_MODAL_SECONDS = 1.5;
const MAX_SCENE_MODAL_SECONDS = 12;
const MIN_QUEST_MODAL_SECONDS = 1.5;
const MAX_QUEST_MODAL_SECONDS = 12;
const MIN_SCROLL_GUIDE_INACTIVITY_SECONDS = 1;
const MAX_SCROLL_GUIDE_INACTIVITY_SECONDS = 60;
const MIN_SCROLL_GUIDE_DISMISS_SECONDS = 0;
const MAX_SCROLL_GUIDE_DISMISS_SECONDS = 10;
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;

function cloneDefaults(): RuntimeSettings {
  return structuredClone(DEFAULT_SETTINGS);
}

function normalizeSceneModalDuration(value: unknown) {
  const duration = Number(value);
  if (!Number.isFinite(duration)) return DEFAULT_SETTINGS.modals.sceneDurationSeconds;
  return Math.max(MIN_SCENE_MODAL_SECONDS, Math.min(MAX_SCENE_MODAL_SECONDS, duration));
}

function normalizeQuestModalDuration(value: unknown) {
  const duration = Number(value);
  if (!Number.isFinite(duration)) return DEFAULT_SETTINGS.modals.questDurationSeconds;
  return Math.max(MIN_QUEST_MODAL_SECONDS, Math.min(MAX_QUEST_MODAL_SECONDS, duration));
}

function normalizeSeconds(value: unknown, fallback: number, minimum: number, maximum: number) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return fallback;
  return Math.max(minimum, Math.min(maximum, seconds));
}

function normalizeColor(value: unknown, fallback: string) {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value)
    ? value
    : fallback;
}

function normalizeSceneModalPalette(
  value: unknown,
  fallback: SceneModalPalette,
): SceneModalPalette {
  const candidate = value && typeof value === "object"
    ? value as Partial<SceneModalPalette>
    : {};
  const particleColors = Array.isArray(candidate.particleColors)
    ? candidate.particleColors.filter(
      (color): color is string => typeof color === "string" && HEX_COLOR_PATTERN.test(color),
    ).slice(0, 8)
    : [];
  const rawDomain: unknown = candidate.sceneDomain;
  const requestedDomain = rawDomain === "phonix"
    ? "phoenix"
    : rawDomain;
  const sceneDomain: SceneDomain = requestedDomain === "phoenix" || requestedDomain === "dragon"
    ? requestedDomain
    : fallback.sceneDomain;

  return {
    sceneDomain,
    runeColor: normalizeColor(candidate.runeColor, fallback.runeColor),
    glowColor: normalizeColor(candidate.glowColor, fallback.glowColor),
    auraColor: normalizeColor(candidate.auraColor, fallback.auraColor),
    particleColors: particleColors.length ? particleColors : [...fallback.particleColors],
  };
}

function normalizeSceneModalPalettes(value: unknown) {
  const defaults = DEFAULT_SETTINGS.modals.scenePalettes;
  const fallback = defaults.default;
  const candidates = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  const paletteIds = new Set([...Object.keys(defaults), ...Object.keys(candidates)]);

  return Object.fromEntries(
    [...paletteIds].map((paletteId) => [
      paletteId,
      normalizeSceneModalPalette(candidates[paletteId], defaults[paletteId] ?? fallback),
    ]),
  );
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
    scrollGuide: {
      inactivitySeconds: normalizeSeconds(
        candidate.scrollGuide?.inactivitySeconds,
        DEFAULT_SETTINGS.scrollGuide.inactivitySeconds,
        MIN_SCROLL_GUIDE_INACTIVITY_SECONDS,
        MAX_SCROLL_GUIDE_INACTIVITY_SECONDS,
      ),
      dismissDelaySeconds: normalizeSeconds(
        candidate.scrollGuide?.dismissDelaySeconds,
        DEFAULT_SETTINGS.scrollGuide.dismissDelaySeconds,
        MIN_SCROLL_GUIDE_DISMISS_SECONDS,
        MAX_SCROLL_GUIDE_DISMISS_SECONDS,
      ),
    },
    modals: {
      sceneDurationSeconds: normalizeSceneModalDuration(
        candidate.modals?.sceneDurationSeconds,
      ),
      questDurationSeconds: normalizeQuestModalDuration(
        candidate.modals?.questDurationSeconds,
      ),
      scenePalettes: normalizeSceneModalPalettes(candidate.modals?.scenePalettes),
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
  const scrollGuideInactivitySeconds = computed(
    () => settings.value.scrollGuide.inactivitySeconds,
  );
  const scrollGuideDismissDelaySeconds = computed(
    () => settings.value.scrollGuide.dismissDelaySeconds,
  );
  const sceneModalDurationSeconds = computed(() => settings.value.modals.sceneDurationSeconds);
  const questModalDurationSeconds = computed(() => settings.value.modals.questDurationSeconds);
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

  function setSceneModalDurationSeconds(value: number) {
    settings.value.modals.sceneDurationSeconds = normalizeSceneModalDuration(value);
  }

  function setQuestModalDurationSeconds(value: number) {
    settings.value.modals.questDurationSeconds = normalizeQuestModalDuration(value);
  }

  function getSceneModalPalette(paletteId = "default") {
    return settings.value.modals.scenePalettes[paletteId]
      ?? settings.value.modals.scenePalettes.default
      ?? DEFAULT_SETTINGS.modals.scenePalettes.default;
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
    scrollGuideInactivitySeconds,
    scrollGuideDismissDelaySeconds,
    sceneModalDurationSeconds,
    questModalDurationSeconds,
    modeSelectorEnabled,
    hasScene,
    getSceneModalPalette,
    selectMode,
    setSceneModalDurationSeconds,
    setQuestModalDurationSeconds,
    loadSettings,
  };
});
