import type { QuestScrollNotice } from "@/components/modals/quests/types";

export const adventureScrollTutorial = {
  id: "adventure-scroll-tutorial",
  heading: "COMPLETA LA AVENTURA",
  variant: "scroll-guide",
  tone: "parchment",
} satisfies QuestScrollNotice;

export const questModalLabExamples: readonly QuestScrollNotice[] = [
  {
    id: "active-castle-mission",
    heading: "MISIÓN ACTIVA",
    title: "Cruzar los muros del castillo",
    description: "Encuentra la entrada antes de que la última luz abandone las almenas.",
    tone: "parchment",
  },
  {
    id: "new-forest-objective",
    heading: "NUEVO OBJETIVO",
    title: "Recuperar el sello del bosque",
    description: "Sigue las runas azules y descubre qué está corrompiendo las raíces antiguas.",
    tone: "royal",
  },
];
