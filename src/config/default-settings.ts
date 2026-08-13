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
