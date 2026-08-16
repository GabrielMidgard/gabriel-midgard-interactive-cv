export type PortraitState = "healthy" | "wounded" | "critical" | "shielded";

export type NavigationPanel = "map" | "inventory" | "journal";

export type DamageEffect = "white-flash" | "blood-pulse" | "ember-burn" | "drowning";

export type ScreenEffect = DamageEffect | "restoration";

export interface ActiveMission {
  eyebrow: string;
  title: string;
  objective: string;
}
