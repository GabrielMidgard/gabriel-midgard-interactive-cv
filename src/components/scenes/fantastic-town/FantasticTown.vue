<script setup lang="ts">
import type { CssVariables } from "@/types/experience";

const props = defineProps<{ widthVw: number }>();

const villagers = [
  { frame: 0, left: 54, height: 31, delay: -0.4, depth: "near", motion: "breathe" },
  { frame: 1, left: 88, height: 30, delay: -2.1, depth: "mid", motion: "curious" },
  { frame: 2, left: 137, height: 38, delay: -1.2, depth: "near", motion: "greet" },
  { frame: 3, left: 181, height: 39, delay: -3.4, depth: "near", motion: "work" },
  { frame: 5, left: 229, height: 37, delay: -0.8, depth: "mid", motion: "greet" },
  { frame: 4, left: 278, height: 40, delay: -2.8, depth: "near", motion: "ponder" },
  { frame: 0, left: 323, height: 27, delay: -1.7, depth: "far", motion: "curious" },
  { frame: 1, left: 351, height: 28, delay: -3.1, depth: "far", motion: "breathe" },
] as const;

const sceneStyle = { "--town-width": `${props.widthVw}vw` } as CssVariables;

function npcStyle(frame: number, left: number, height: number, delay: number) {
  return {
    "--npc-frame": `${frame * 20}%`,
    "--npc-left": `${left}vw`,
    "--npc-height": `${height}vh`,
    "--npc-width": `${height * 0.29}vh`,
    "--npc-delay": `${delay}s`,
  } as CssVariables;
}
</script>

<template>
  <section :class="$style.town" :style="sceneStyle" aria-labelledby="fantastic-town-title">
    <div :class="$style.panorama" aria-hidden="true"><i /></div>
    <div :class="$style.sunHaze" aria-hidden="true"><i /><i /><i /></div>

    <header :class="$style.intro">
      <span>PRÓLOGO · NIVEL DE INICIACIÓN</span>
      <h1 id="fantastic-town-title">Fantastic<br />Town</h1>
      <p>A las dos de la tarde comienza el viaje, entre la cal, el trigo y quienes aún conservan la luz.</p>
    </header>

    <div :class="$style.tutorial">
      <b>APRENDE A DESPLAZARTE</b>
      <span>↓ para avanzar&nbsp;&nbsp;·&nbsp;&nbsp;↑ para regresar</span>
    </div>

    <div :class="$style.villagers" aria-hidden="true">
      <div
        v-for="villager in villagers"
        :key="`${villager.frame}-${villager.left}`"
        :class="[$style.npc, $style[villager.depth]]"
        :style="npcStyle(villager.frame, villager.left, villager.height, villager.delay)"
      >
        <i :class="$style[villager.motion]" />
      </div>
    </div>

    <div :class="$style.ruinBlend" aria-hidden="true" />
  </section>
</template>

<style module lang="scss" src="./FantasticTown.module.scss"></style>
