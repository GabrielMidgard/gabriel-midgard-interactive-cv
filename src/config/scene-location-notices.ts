import type { SceneLocationNotice } from "@/components/modals/scenes/types";

const notices = {
  townEntrance: {
    id: "fantastic-town",
    eyebrow: "REGIÓN DESCUBIERTA",
    title: "Fantastic Town",
    runeText: "ᚠᚨᚾᛏᚨᛊᛏᛁᚲ ᛏᛟᚹᚾ",
    subtitle: "Donde la luz todavía habita",
    tone: "ember",
    paletteId: "fantastic-town",
  },
  valleyHomes: {
    id: "valley-homes",
    eyebrow: "NUEVO LUGAR",
    title: "Las Casas del Valle",
    runeText: "ᛚᚨᛊ ᚲᚨᛊᚨᛊ ᛞᛖᛚ ᚢᚨᛚᛚᛖ",
    tone: "ember",
    paletteId: "fantastic-town",
  },
  townMarket: {
    id: "town-market",
    eyebrow: "NUEVO LUGAR",
    title: "El Mercado de la Plaza",
    runeText: "ᛖᛚ ᛗᛖᚱᚲᚨᛞᛟ ᛞᛖ ᛚᚨ ᛈᛚᚨᛉᚨ",
    tone: "ember",
    paletteId: "fantastic-town",
  },
  ancientWell: {
    id: "ancient-well",
    eyebrow: "NUEVO LUGAR",
    title: "El Pozo Antiguo",
    runeText: "ᛖᛚ ᛈᛟᛉᛟ ᚨᚾᛏᛁᚷᚢᛟ",
    tone: "moon",
    paletteId: "fantastic-town",
  },
  whisperingForest: {
    id: "whispering-forest",
    eyebrow: "REGIÓN DESCUBIERTA",
    title: "Bosque de los Susurros",
    runeText: "ᛒᛟᛊᚲᚢᛖ ᛞᛖ ᛚᛟᛊ ᛊᚢᛊᚢᚱᚱᛟᛊ",
    subtitle: "El sendero entre dos mundos",
    tone: "moon",
    paletteId: "enchanted-forest-light",
  },
  luminousGrove: {
    id: "luminous-grove",
    eyebrow: "NUEVO LUGAR",
    title: "La Arboleda Luminosa",
    runeText: "ᛚᚨ ᚨᚱᛒᛟᛚᛖᛞᚨ ᛚᚢᛗᛁᚾᛟᛊᚨ",
    tone: "moon",
    paletteId: "enchanted-forest-light",
  },
  corruptedRoot: {
    id: "corrupted-root",
    eyebrow: "LA SOMBRA SE EXTIENDE",
    title: "La Raíz Corrompida",
    runeText: "ᛚᚨ ᚱᚨᛁᛉ ᚲᛟᚱᚱᛟᛗᛈᛁᛞᚨ",
    tone: "blood",
    paletteId: "enchanted-forest-corrupted",
  },
  deadLeaves: {
    id: "dead-leaves",
    eyebrow: "NUEVO LUGAR",
    title: "Donde Mueren las Hojas",
    runeText: "ᛞᛟᚾᛞᛖ ᛗᚢᛖᚱᛖᚾ ᛚᚨᛊ ᚺᛟᛃᚨᛊ",
    tone: "blood",
    paletteId: "enchanted-forest-corrupted",
  },
  castleWalls: {
    id: "castle-walls",
    eyebrow: "REGIÓN DESCUBIERTA",
    title: "Castle Walls",
    runeText: "ᚲᚨᛊᛏᛚᛖ ᚹᚨᛚᛚᛊ",
    subtitle: "Las puertas del oficio",
    tone: "blood",
    paletteId: "castle-walls",
  },
  technicalArsenal: {
    id: "technical-arsenal",
    eyebrow: "CAPÍTULO III",
    title: "Arsenal Técnico",
    runeText: "ᚨᚱᛊᛖᚾᚨᛚ ᛏᛖᚲᚾᛁᚲᛟ",
    tone: "blood",
    paletteId: "skills",
  },
  servedKingdoms: {
    id: "served-kingdoms",
    eyebrow: "CAPÍTULO IV",
    title: "Reinos Servidos",
    runeText: "ᚱᛖᛁᚾᛟᛊ ᛊᛖᚱᚢᛁᛞᛟᛊ",
    tone: "ember",
    paletteId: "experience",
  },
  recentBattles: {
    id: "recent-battles",
    eyebrow: "CAPÍTULO V",
    title: "Batallas Recientes",
    runeText: "ᛒᚨᛏᚨᛚᛚᚨᛊ ᚱᛖᚲᛁᛖᚾᛏᛖᛊ",
    tone: "blood",
    paletteId: "experience",
  },
  academy: {
    id: "academy",
    eyebrow: "CAPÍTULO VI",
    title: "La Academia",
    runeText: "ᛚᚨ ᚨᚲᚨᛞᛖᛗᛁᚨ",
    tone: "moon",
    paletteId: "education",
  },
  finalShrine: {
    id: "final-shrine",
    eyebrow: "MISIÓN COMPLETADA",
    title: "El Santuario Final",
    runeText: "ᛖᛚ ᛊᚨᚾᛏᚢᚨᚱᛁᛟ ᚠᛁᚾᚨᛚ",
    tone: "ember",
    paletteId: "contact",
  },
} satisfies Record<string, SceneLocationNotice>;

function resolveTownLocation(progress: number) {
  if (progress < 0.18) return notices.townEntrance;
  if (progress < 0.43) return notices.valleyHomes;
  if (progress < 0.72) return notices.townMarket;
  return notices.ancientWell;
}

function resolveForestLocation(progress: number) {
  if (progress < 0.18) return notices.whisperingForest;
  if (progress < 0.47) return notices.luminousGrove;
  if (progress < 0.76) return notices.corruptedRoot;
  return notices.deadLeaves;
}

export function resolveSceneLocationNotice(
  level: number,
  townProgress: number,
  forestProgress: number,
): SceneLocationNotice {
  if (level === 0) return resolveTownLocation(townProgress);
  if (level === 1) return resolveForestLocation(forestProgress);

  return [
    notices.castleWalls,
    notices.technicalArsenal,
    notices.servedKingdoms,
    notices.recentBattles,
    notices.academy,
    notices.finalShrine,
  ][Math.min(5, Math.max(0, level - 2))];
}

export const modalLabExamples: readonly SceneLocationNotice[] = [
  notices.townEntrance,
  notices.whisperingForest,
  notices.castleWalls,
  notices.finalShrine,
];
