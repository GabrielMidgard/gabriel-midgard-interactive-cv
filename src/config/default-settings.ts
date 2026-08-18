import type { RuntimeSettings } from "@/types/settings";

/** Respaldo seguro utilizado si settings.json no existe o contiene datos inválidos. */
export const DEFAULT_SETTINGS: RuntimeSettings = {
  version: 1,
  defaultMode: "cinematic",
  rememberLastMode: true,
  loading: {
    durationSeconds: 5,
    modeSelectorEnabled: false,
  },
  scrollGuide: {
    inactivitySeconds: 5,
    dismissDelaySeconds: 2,
  },
  modals: {
    sceneDurationSeconds: 2.3,
    questDurationSeconds: 5,
    scenePalettes: {
      default: {
        sceneDomain: "dragon",
        runeColor: "#e7dcc8",
        glowColor: "#c79d61",
        auraColor: "#5b261f",
        particleColors: ["#f0d4a0", "#d8b976", "#eee4d1"],
      },
      "fantastic-town": {
        sceneDomain: "phoenix",
        runeColor: "#bcecff",
        glowColor: "#7fd7c4",
        auraColor: "#315f72",
        particleColors: ["#8fddff", "#9cf0cc", "#d8c4ff", "#ffd6ea"],
      },
      "enchanted-forest-light": {
        sceneDomain: "phoenix",
        runeColor: "#c9ffe4",
        glowColor: "#72dfb0",
        auraColor: "#245d50",
        particleColors: ["#7ee8cf", "#a7ddff", "#d6bfff", "#d9ffa8"],
      },
      "enchanted-forest-corrupted": {
        sceneDomain: "dragon",
        runeColor: "#d3a6ff",
        glowColor: "#b255ff",
        auraColor: "#511b63",
        particleColors: ["#c879ff", "#ff4d78", "#7f54ff", "#e39aff"],
      },
      "castle-walls": {
        sceneDomain: "dragon",
        runeColor: "#ffb0b8",
        glowColor: "#ef3d50",
        auraColor: "#601725",
        particleColors: ["#ff4057", "#9e45ff", "#d72e8c", "#ff8b72"],
      },
      skills: {
        sceneDomain: "dragon",
        runeColor: "#f0c8a0",
        glowColor: "#d98850",
        auraColor: "#5c2c1d",
        particleColors: ["#f0a75f", "#ca6458", "#e7c28f"],
      },
      experience: {
        sceneDomain: "dragon",
        runeColor: "#efcfaa",
        glowColor: "#bd744a",
        auraColor: "#4f261d",
        particleColors: ["#d99562", "#e9bd82", "#9f5866"],
      },
      education: {
        sceneDomain: "dragon",
        runeColor: "#cbd8ff",
        glowColor: "#819bd8",
        auraColor: "#29385e",
        particleColors: ["#9db8ff", "#bfadff", "#9de1e8"],
      },
      contact: {
        sceneDomain: "dragon",
        runeColor: "#ffe5b0",
        glowColor: "#e1a24f",
        auraColor: "#632a20",
        particleColors: ["#ffca75", "#ff6f61", "#c06cff", "#ffe4a3"],
      },
    },
  },
  modes: {
    cinematic: {
      enabled: true,
      label: "CV interactivo",
      description: "Recorrido cinematográfico por el currículum.",
      scenes: [
        "fantastic-town",
        "enchanted-forest",
        "castle-walls",
        "skills",
        "experience",
        "education",
        "contact",
      ],
      features: { map: false, menu: false, inventory: false },
    },
  },
};
