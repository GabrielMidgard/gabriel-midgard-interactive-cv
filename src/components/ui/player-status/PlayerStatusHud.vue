<script setup lang="ts">
import type { PortraitState } from "@/types/game-ui";

withDefaults(defineProps<{
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  portraitState?: PortraitState;
  damaged?: boolean;
  restored?: boolean;
  finePortraitSrc?: string;
  damagePortraitSrc?: string;
  restoredPortraitSrc?: string;
  borderSrc?: string;
}>(), {
  portraitState: "healthy",
  damaged: false,
  restored: false,
  finePortraitSrc: "/assets/characters/main-character/knight-status-fine.png",
  damagePortraitSrc: "/assets/characters/main-character/knight-status-damage.png",
  restoredPortraitSrc: "/assets/characters/main-character/knight-status-restaured.png",
  borderSrc: "/assets/characters/main-character/phonix_border.png",
});

const percentage = (value: number, maximum: number) =>
  `${Math.max(0, Math.min(100, (value / Math.max(1, maximum)) * 100))}%`;
</script>

<template>
  <section :class="$style.status" aria-label="Estado del personaje">
    <div
      :class="[
        $style.crest,
        { [$style.damaged]: damaged, [$style.restored]: restored },
      ]"
      :data-state="portraitState"
    >
      <div :class="$style.portraitFrame">
        <img
          :class="[$style.portrait, $style.finePortrait]"
          :src="finePortraitSrc"
          alt="Retrato de Gabriel como caballero"
        />
        <img
          :class="[$style.portrait, $style.damagePortrait]"
          :src="damagePortraitSrc"
          alt=""
          aria-hidden="true"
        />
        <img
          :class="[$style.portrait, $style.restoredPortrait]"
          :src="restoredPortraitSrc"
          alt=""
          aria-hidden="true"
        />
        <i :class="$style.damageVeil" aria-hidden="true" />
      </div>
      <img :class="$style.phoenixBorder" :src="borderSrc" alt="" aria-hidden="true" />
    </div>

    <div :class="$style.readout">
      <div :class="$style.barRow">
        <span>VIDA</span>
        <div
          :class="[$style.bar, $style.health]"
          role="progressbar"
          aria-label="Vida"
          :aria-valuenow="health"
          aria-valuemin="0"
          :aria-valuemax="maxHealth"
        >
          <i :style="{ width: percentage(health, maxHealth) }" />
        </div>
      </div>
      <div :class="$style.barRow">
        <span>ENERGÍA</span>
        <div
          :class="[$style.bar, $style.energy]"
          role="progressbar"
          aria-label="Energía"
          :aria-valuenow="energy"
          aria-valuemin="0"
          :aria-valuemax="maxEnergy"
        >
          <i :style="{ width: percentage(energy, maxEnergy) }" />
        </div>
      </div>
      <div :class="$style.gold" aria-label="Oro disponible">
        <img
          :class="$style.goldBag"
          src="/assets/icons/icon-bag_money.png"
          alt=""
          aria-hidden="true"
        />
        <span>{{ gold.toLocaleString("es-MX") }}</span>
        <small>ORO</small>
      </div>
    </div>
  </section>
</template>

<style module lang="scss" src="./PlayerStatusHud.module.scss"></style>
