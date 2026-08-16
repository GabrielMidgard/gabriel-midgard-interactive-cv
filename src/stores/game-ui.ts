import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { DamageEffect, NavigationPanel, PortraitState } from "@/types/game-ui";

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
  const damageEffect = ref<DamageEffect | null>(null);
  const damageEffectDurationMs = ref(0);
  const damageSequence = ref(0);
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
    damageEffect.value = effect;
    damageEffectDurationMs.value = Math.max(200, Math.min(5000, durationMs));
    damageSequence.value += 1;
    damageTimer = setTimeout(() => {
      isTakingDamage.value = false;
      damageEffect.value = null;
      damageTimer = undefined;
    }, damageEffectDurationMs.value);
  }

  function resetCombatState() {
    if (damageTimer) clearTimeout(damageTimer);
    damageTimer = undefined;
    health.value = maxHealth.value;
    energy.value = maxEnergy.value;
    shielded.value = false;
    isTakingDamage.value = false;
    damageEffect.value = null;
    damageEffectDurationMs.value = 0;
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
    damageEffect,
    damageEffectDurationMs,
    damageSequence,
    portraitState,
    activeNavigation,
    missionExpanded,
    setHealth,
    setEnergy,
    setShielded,
    receiveDamage,
    resetCombatState,
    selectNavigation,
    toggleMission,
  };
});
