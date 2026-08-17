<script setup lang="ts">
import { storeToRefs } from "pinia";
import DamageEffectOverlay from "@/components/ui/damage-effect/DamageEffectOverlay.vue";
import GameNavigation from "@/components/ui/game-navigation/GameNavigation.vue";
import PlayerStatusHud from "@/components/ui/player-status/PlayerStatusHud.vue";
import ScrollGuide from "@/components/ui/scroll-guide/ScrollGuide.vue";
import { useGameUiStore } from "@/stores/game-ui";

const gameUi = useGameUiStore();
const {
  health,
  maxHealth,
  energy,
  maxEnergy,
  gold,
  portraitState,
  isTakingDamage,
  isRestoring,
  screenEffect,
  screenEffectDurationMs,
  screenEffectSequence,
  activeNavigation,
} = storeToRefs(gameUi);
</script>

<template>
  <div :class="$style.interface" aria-label="Interfaz de aventura">
    <div :class="$style.playerStatus">
      <PlayerStatusHud
        :health="health"
        :max-health="maxHealth"
        :energy="energy"
        :max-energy="maxEnergy"
        :gold="gold"
        :portrait-state="portraitState"
        :damaged="isTakingDamage"
        :restored="isRestoring"
      />
    </div>
    <div :class="$style.navigation">
      <GameNavigation
        :active-panel="activeNavigation"
        @select="gameUi.selectNavigation"
      />
    </div>
    <div :class="$style.scrollGuide">
      <ScrollGuide />
    </div>
    <DamageEffectOverlay
      v-if="screenEffect"
      :key="screenEffectSequence"
      :effect="screenEffect"
      :duration-ms="screenEffectDurationMs"
    />
  </div>
</template>

<style module lang="scss" src="./GameInterface.module.scss"></style>
