export type QuestModalTone = "parchment" | "royal" | "warning";

export interface QuestScrollNotice {
  id: string;
  heading: string;
  title?: string;
  description?: string;
  variant?: "default" | "scroll-guide" | "start-guide";
  tone?: QuestModalTone;
  durationMs?: number;
}
