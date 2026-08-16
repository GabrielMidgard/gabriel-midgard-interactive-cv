<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import ActiveMission from "@/components/ui/active-mission/ActiveMission.vue";
import DamageEffectOverlay from "@/components/ui/damage-effect/DamageEffectOverlay.vue";
import GameNavigation from "@/components/ui/game-navigation/GameNavigation.vue";
import PlayerStatusHud from "@/components/ui/player-status/PlayerStatusHud.vue";
import ScrollGuide from "@/components/ui/scroll-guide/ScrollGuide.vue";
import { useGameUiStore } from "@/stores/game-ui";
import type { ActiveMission as Mission } from "@/types/game-ui";

const props = defineProps<{
  level: number;
}>();

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
  missionExpanded,
} = storeToRefs(gameUi);

const missions: Mission[] = [
  { eyebrow: "MISIÓN ACTIVA", title: "Cruzar la villa", objective: "Encuentra el sendero del bosque" },
  { eyebrow: "MISIÓN ACTIVA", title: "Atravesar el bosque", objective: "Sigue el camino hacia las ruinas" },
  { eyebrow: "MISIÓN ACTIVA", title: "Cruzar los muros del castillo", objective: "Encuentra la entrada" },
  { eyebrow: "MISIÓN ACTIVA", title: "Dominar el arsenal técnico", objective: "Examina las disciplinas del desarrollador" },
  { eyebrow: "MISIÓN ACTIVA", title: "Conocer los reinos servidos", objective: "Recorre la experiencia profesional" },
  { eyebrow: "MISIÓN ACTIVA", title: "Revivir las batallas recientes", objective: "Descubre los proyectos más importantes" },
  { eyebrow: "MISIÓN ACTIVA", title: "Visitar la academia", objective: "Consulta la formación del caballero" },
  { eyebrow: "MISIÓN FINAL", title: "Construyamos algo memorable", objective: "Envía un mensaje a Gabriel" },
];

const activeMission = computed(() => missions[Math.min(props.level, missions.length - 1)]);
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
    <div :class="$style.mission">
      <ActiveMission
        :mission="activeMission"
        :expanded="missionExpanded"
        @toggle="gameUi.toggleMission"
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
