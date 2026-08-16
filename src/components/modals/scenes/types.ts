export type SceneModalTone = "blood" | "ember" | "moon";

export interface SceneLocationNotice {
  id: string;
  eyebrow: string;
  title: string;
  runeText: string;
  subtitle?: string;
  tone?: SceneModalTone;
  durationMs?: number;
  paletteId?: string;
}
