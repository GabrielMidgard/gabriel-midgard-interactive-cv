<script setup lang="ts">
import type { DamageEffect } from "@/types/game-ui";
import type { CssVariables } from "@/types/experience";

const props = defineProps<{
  effect: DamageEffect;
  durationMs: number;
}>();

const effectStyle = {
  "--damage-duration": `${props.durationMs}ms`,
} as CssVariables;
</script>

<template>
  <div
    :class="[$style.overlay, $style[effect]]"
    :style="effectStyle"
    role="status"
    aria-live="assertive"
  >
    <span :class="$style.srOnly">Daño recibido</span>
  </div>
</template>

<style module lang="scss" src="./DamageEffectOverlay.module.scss"></style>
