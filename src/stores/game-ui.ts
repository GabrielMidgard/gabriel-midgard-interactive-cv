import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  DamageEffect,
  NavigationPanel,
  PortraitState,
  ScreenEffect,
} from "@/types/game-ui";

const clamp = (value: number, maximum: number) =>
  Math.max(0, Math.min(maximum, value));

export const useGameUiStore = defineStore("game-ui", () => {
  const health = ref(100);
  const maxHealth = ref(100);
  const energy = ref(82);
  const maxEnergy = ref(100);
  const gold = ref(2480);
  const shielded = ref(false);
  const isTakingDamage = ref(false);
  const isRestoring = ref(false);
  const screenEffect = ref<ScreenEffect | null>(null);
  const screenEffectDurationMs = ref(0);
  const screenEffectSequence = ref(0);
  const activeNavigation = ref<NavigationPanel | null>(null);
  const missionExpanded = ref(true);
  let damageTimer: ReturnType<typeof setTimeout> | undefined;

  const portraitState = computed<PortraitState>(() => {
    if (shielded.value) return "shielded";
    const healthRatio = health.value / Math.max(1, maxHealth.value);
    if (healthRatio <= 0.25) return "critical";
    if (healthRatio <= 0.6) return "wounded";
    return "healthy";
  });

  function setHealth(value: number) {
    health.value = clamp(value, maxHealth.value);
  }

  function setEnergy(value: number) {
    energy.value = clamp(value, maxEnergy.value);
  }

  function setShielded(value: boolean) {
    shielded.value = value;
  }

  function receiveDamage(
    amount: number,
    effect: DamageEffect = "white-flash",
    durationMs = 1000,
  ) {
    if (damageTimer) clearTimeout(damageTimer);
    setHealth(health.value - Math.max(0, amount));
    isTakingDamage.value = true;
    isRestoring.value = false;
    screenEffect.value = effect;
    screenEffectDurationMs.value = Math.max(200, Math.min(7000, durationMs));
    screenEffectSequence.value += 1;
    damageTimer = setTimeout(() => {
      isTakingDamage.value = false;
      screenEffect.value = null;
      damageTimer = undefined;
    }, screenEffectDurationMs.value);
  }

  function restoreState(durationMs = 1800) {
    if (damageTimer) clearTimeout(damageTimer);
    health.value = maxHealth.value;
    energy.value = maxEnergy.value;
    shielded.value = false;
    isTakingDamage.value = false;
    isRestoring.value = true;
    screenEffect.value = "restoration";
    screenEffectDurationMs.value = Math.max(500, Math.min(5000, durationMs));
    screenEffectSequence.value += 1;
    damageTimer = setTimeout(() => {
      isRestoring.value = false;
      screenEffect.value = null;
      damageTimer = undefined;
    }, screenEffectDurationMs.value);
  }

  function resetCombatState() {
    if (damageTimer) clearTimeout(damageTimer);
    damageTimer = undefined;
    health.value = maxHealth.value;
    energy.value = maxEnergy.value;
    shielded.value = false;
    isTakingDamage.value = false;
    isRestoring.value = false;
    screenEffect.value = null;
    screenEffectDurationMs.value = 0;
  }

  function selectNavigation(panel: NavigationPanel) {
    activeNavigation.value = activeNavigation.value === panel ? null : panel;
  }

  function toggleMission() {
    missionExpanded.value = !missionExpanded.value;
  }

  return {
    health,
    maxHealth,
    energy,
    maxEnergy,
    gold,
    shielded,
    isTakingDamage,
    isRestoring,
    screenEffect,
    screenEffectDurationMs,
    screenEffectSequence,
    portraitState,
    activeNavigation,
    missionExpanded,
    setHealth,
    setEnergy,
    setShielded,
    receiveDamage,
    restoreState,
    resetCombatState,
    selectNavigation,
    toggleMission,
  };
});
