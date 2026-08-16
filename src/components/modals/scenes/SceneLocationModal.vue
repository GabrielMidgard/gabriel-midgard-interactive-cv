<script setup lang="ts">
import { computed } from "vue";
import type { CssVariables } from "@/types/experience";
import type { SceneModalPalette } from "@/types/settings";
import type { SceneLocationNotice } from "./types";

const props = defineProps<{
  notice: SceneLocationNotice | null;
  visible: boolean;
  presentationKey: number;
  durationMs: number;
  palette: SceneModalPalette;
}>();

const runes = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ"];
const particles = Array.from({ length: 28 }, (_, index) => index);
const runeParticles = Array.from({ length: 16 }, (_, index) => index);
const particleRunes = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ"];

const emblemSource = computed(() => props.palette.sceneDomain === "dragon"
  ? "/assets/modals/scenes/dragon-emblem.png"
  : "/assets/modals/scenes/phoenix-fire-emblem.png");
const emblemClass = computed(() => props.palette.sceneDomain === "dragon"
  ? "dragonEmblem"
  : "phoenixEmblem");

const modalStyle = computed(() => {
  const duration = Math.max(1500, props.durationMs);
  return {
    "--modal-duration": `${duration}ms`,
    "--modal-orbit-duration": `${duration * 1.12}ms`,
    "--modal-copy-duration": `${Math.max(260, duration * 0.2)}ms`,
    "--modal-eyebrow-delay": `${duration * 0.1}ms`,
    "--modal-rule-duration": `${Math.max(320, duration * 0.2)}ms`,
    "--modal-rule-delay": `${duration * 0.16}ms`,
    "--modal-cipher-duration": `${Math.max(520, duration * 0.34)}ms`,
    "--modal-cipher-delay": `${duration * 0.07}ms`,
    "--modal-title-duration": `${Math.max(420, duration * 0.22)}ms`,
    "--modal-title-delay": `${duration * 0.27}ms`,
    "--modal-subtitle-delay": `${duration * 0.42}ms`,
    "--modal-accent": props.palette.glowColor,
    "--modal-glow": props.palette.glowColor,
    "--modal-aura": props.palette.auraColor,
    "--rune-color": props.palette.runeColor,
  } as CssVariables;
});

function titleClass(title: string) {
  if (title.length >= 34) return "longTitle";
  if (title.length >= 21) return "compactTitle";
  return "shortTitle";
}

function runeStyle(index: number) {
  return {
    "--rune-angle": `${index * 30}deg`,
    "--rune-delay": `${(index % 5) * -0.14}s`,
  } as CssVariables;
}

function particleStyle(index: number, kind: "spark" | "rune") {
  const seed = kind === "rune" ? index + 31 : index;
  const spread = ((seed * 37) % 100) - 50;
  const drift = ((seed * 19) % 42) - 21;
  return {
    "--particle-x": `${spread}%`,
    "--particle-delay": `${(seed % 11) * -0.19}s`,
    "--particle-duration": `${2.2 + (seed % 6) * 0.28}s`,
    "--particle-size": kind === "rune"
      ? `${11 + (index % 4) * 1.5}px`
      : `${1.5 + (index % 3) * 0.7}px`,
    "--particle-drift": `${drift}px`,
    "--particle-color": props.palette.particleColors[
      seed % props.palette.particleColors.length
    ] ?? props.palette.runeColor,
  } as CssVariables;
}
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-active-class="$style.enterActive"
      :leave-active-class="$style.leaveActive"
      :enter-from-class="$style.enterFrom"
      :leave-to-class="$style.leaveTo"
    >
      <section
        v-if="visible && notice"
        :key="presentationKey"
        :class="[$style.notice, $style[notice.tone ?? 'blood']]"
        :style="modalStyle"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div :class="$style.magic" aria-hidden="true">
          <img
            :class="[$style.emblem, $style[emblemClass]]"
            :src="emblemSource"
            alt=""
          />
          <div :class="$style.runeOrbit">
            <i
              v-for="(rune, index) in runes"
              :key="`${rune}-${index}`"
              :style="runeStyle(index)"
            >{{ rune }}</i>
          </div>
          <div :class="$style.particles">
            <span
              v-for="particle in particles"
              :key="`spark-${particle}`"
              :style="particleStyle(particle, 'spark')"
            />
            <i
              v-for="particle in runeParticles"
              :key="`rune-particle-${particle}`"
              :style="particleStyle(particle, 'rune')"
            >{{ particleRunes[particle % particleRunes.length] }}</i>
          </div>
        </div>

        <div :class="$style.copy">
          <p :class="$style.eyebrow">{{ notice.eyebrow }}</p>
          <div :class="$style.rule"><i /></div>
          <div :class="[$style.titleStage, $style[titleClass(notice.title)]]">
            <span :class="$style.cipher" aria-hidden="true">{{ notice.runeText }}</span>
            <h2>{{ notice.title }}</h2>
          </div>
          <p v-if="notice.subtitle" :class="$style.subtitle">{{ notice.subtitle }}</p>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style module lang="scss" src="./SceneLocationModal.module.scss"></style>
