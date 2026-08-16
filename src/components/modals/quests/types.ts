export type QuestModalTone = "parchment" | "royal" | "warning";

export interface QuestScrollNotice {
  id: string;
  heading: string;
  title: string;
  description?: string;
  tone?: QuestModalTone;
  durationMs?: number;
}
