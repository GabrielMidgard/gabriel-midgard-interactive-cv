<script setup lang="ts">
import type { CssVariables } from "@/types/experience";

const props = defineProps<{
  startVw: number;
  widthVw: number;
  livingTreeTransform: string;
  corruptedTreeTransform: string;
}>();

const sceneStyle = {
  "--forest-start": `${props.startVw}vw`,
  "--forest-width": `${props.widthVw}vw`,
} as CssVariables;
</script>

<template>
  <section :class="$style.forest" :style="sceneStyle" aria-labelledby="enchanted-forest-title">
    <div :class="$style.panorama" aria-hidden="true"><i /></div>
    <div :class="$style.corruption" aria-hidden="true" />
    <div :class="$style.motes" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>

    <header :class="$style.intro">
      <span>NIVEL I · EL SENDERO ENTRE MUNDOS</span>
      <h2 id="enchanted-forest-title">El bosque<br />de los susurros</h2>
      <p>La luz aún habita entre las raíces, pero algo antiguo ha comenzado a devorar el camino.</p>
    </header>
  </section>

  <Teleport to="body">
    <div
      :class="[$style.thresholdTree, $style.livingTree]"
      :style="{ transform: livingTreeTransform }"
      aria-hidden="true"
    />
    <div
      :class="[$style.thresholdTree, $style.corruptedTree]"
      :style="{ transform: corruptedTreeTransform }"
      aria-hidden="true"
    />
  </Teleport>
</template>

<style module lang="scss" src="./EnchantedForest.module.scss"></style>
