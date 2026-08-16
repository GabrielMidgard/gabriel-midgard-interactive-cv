<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import DamageEffectOverlay from "@/components/ui/damage-effect/DamageEffectOverlay.vue";
import PlayerStatusHud from "@/components/ui/player-status/PlayerStatusHud.vue";
import { useGameUiStore } from "@/stores/game-ui";
import type { DamageEffect } from "@/types/game-ui";

interface AttackPreset {
  id: string;
  label: string;
  description: string;
  damage: number;
  effect: DamageEffect;
  durationMs: number;
}

const attacks = [
  {
    id: "flash",
    label: "Destello de impacto",
    description: "La pantalla se vuelve blanca durante un segundo.",
    damage: 10,
    effect: "white-flash",
    durationMs: 1000,
  },
  {
    id: "blood",
    label: "Golpe contundente",
    description: "Un pulso rojo parpadea durante tres segundos.",
    damage: 28,
    effect: "blood-pulse",
    durationMs: 3000,
  },
  {
    id: "ember",
    label: "Quemadura de brasas",
    description: "El borde arde y se desvanece gradualmente.",
    damage: 18,
    effect: "ember-burn",
    durationMs: 2000,
  },
  {
    id: "drowning",
    label: "Ahogamiento",
    description: "La visión pulsa y se oscurece progresivamente hasta casi desaparecer.",
    damage: 35,
    effect: "drowning",
    durationMs: 5500,
  },
] as const satisfies readonly AttackPreset[];

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
} = storeToRefs(gameUi);

onBeforeUnmount(() => gameUi.resetCombatState());
</script>

<template>
  <main :class="$style.lab">
    <div :class="$style.ambient" aria-hidden="true" />

    <header :class="$style.header">
      <nav :class="$style.links" aria-label="Laboratorios de interfaz">
        <RouterLink to="/">← VOLVER A LA EXPERIENCIA</RouterLink>
        <RouterLink to="/test/modals">MODALES DE ESCENA</RouterLink>
      </nav>
      <p>LABORATORIO DE INTERFAZ · COMBAT / DAMAGE</p>
      <h1>Respuesta al daño</h1>
      <span>Prueba el cambio de retrato, la pérdida de vida y los efectos de pantalla.</span>
    </header>

    <section :class="$style.preview" aria-labelledby="preview-heading">
      <div :class="$style.previewCopy">
        <small>ESTADO ACTUAL</small>
        <h2 id="preview-heading">Retrato reactivo</h2>
        <p>La ilustración dañada permanece mientras dura el efecto y después regresa al estado normal.</p>
      </div>
      <div :class="$style.hudPreview">
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
      <button type="button" :class="$style.reset" @click="gameUi.restoreState()">
        RESTAURAR ESTADO
      </button>
    </section>

    <section :class="$style.attacks" aria-labelledby="attacks-heading">
      <div :class="$style.sectionHeading">
        <small>SIMULADOR</small>
        <h2 id="attacks-heading">Ataques disponibles</h2>
      </div>
      <article v-for="attack in attacks" :key="attack.id" :class="$style.attackCard">
        <div>
          <small>−{{ attack.damage }} VIDA · {{ attack.durationMs / 1000 }} SEG.</small>
          <h3>{{ attack.label }}</h3>
          <p>{{ attack.description }}</p>
        </div>
        <button
          type="button"
          :disabled="isTakingDamage || health <= 0"
          @click="gameUi.receiveDamage(attack.damage, attack.effect, attack.durationMs)"
        >
          RECIBIR DAÑO
        </button>
      </article>
    </section>

    <footer :class="$style.footer">
      <span>Ruta directa</span>
      <code>http://localhost:5173/test/damage</code>
    </footer>

    <DamageEffectOverlay
      v-if="screenEffect"
      :key="screenEffectSequence"
      :effect="screenEffect"
      :duration-ms="screenEffectDurationMs"
    />
  </main>
</template>

<style module lang="scss" src="./DamageLabView.module.scss"></style>
