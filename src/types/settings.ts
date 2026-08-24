export const SCENE_IDS = [
  "fantastic-town",
  "enchanted-forest",
  "castle-walls",
  "skills",
  "experience",
  "education",
  "contact",
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export interface ModeFeatures {
  map: boolean;
  menu: boolean;
  inventory: boolean;
}

export interface ExperienceMode {
  enabled: boolean;
  label: string;
  description: string;
  scenes: SceneId[];
  features: ModeFeatures;
}

export interface SceneModalPalette {
  sceneDomain: SceneDomain;
  runeColor: string;
  glowColor: string;
  auraColor: string;
  particleColors: string[];
}

export type SceneDomain = "phoenix" | "dragon";

export interface RuntimeSettings {
  version: number;
  defaultMode: string;
  rememberLastMode: boolean;
  loading: {
    durationSeconds: number;
    modeSelectorEnabled: boolean;
    celestialIntroEnabled: boolean;
    celestialIntroDurationSeconds: number;
    celestialIntroTransitionSeconds: number;
  };
  scrollGuide: {
    inactivitySeconds: number;
    dismissDelaySeconds: number;
  };
  modals: {
    sceneDurationSeconds: number;
    questDurationSeconds: number;
    scenePalettes: Record<string, SceneModalPalette>;
  };
  modes: Record<string, ExperienceMode>;
}
