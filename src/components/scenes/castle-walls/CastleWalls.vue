<script setup lang="ts">
const props = defineProps<{
  startVw: number;
  wallTransform: string;
  postTransform: string;
}>();
</script>

<template>
  <div :class="$style.scenario" :style="{ left: `${props.startVw}vw` }" aria-hidden="true" />

  <section
    :class="['zone', $style.profileZone]"
    :style="{ left: `${props.startVw + 100}vw` }"
    aria-labelledby="perfil-title"
  >
    <div :class="[$style.legend, $style.legendOrigin]">
      <small>CAPÍTULO I · EL ORIGEN</small>
      <h2 id="perfil-title">Una leyenda escrita en código</h2>
      <p>En Guadalajara comenzó el viaje de un creador inquieto, guiado por la curiosidad y el deseo de convertir problemas complejos en experiencias claras.</p>
    </div>

    <div :class="[$style.legend, $style.legendCalling]">
      <small>EL LLAMADO</small>
      <h2>Construir, aprender y guiar</h2>
      <p>Durante más de ocho años ha creado productos web y móviles, liderado equipos y compartido conocimiento con nuevas generaciones.</p>
      <blockquote>“Meticuloso, innovador y orientado a resolver problemas.”</blockquote>
    </div>

    <div :class="[$style.raven, $style.ravenDistant]" aria-hidden="true"><i /></div>
    <div :class="$style.wanderer" aria-hidden="true"><i /></div>
    <div :class="$style.castleThreshold"><span>LAS PUERTAS DEL OFICIO</span><b>ENTRAR AL CASTILLO</b></div>
    <div :class="['gate', $style.levelGate]"><b>NIVEL 3</b></div>
  </section>

  <Teleport to="body">
    <div :class="[$style.castleWallTransition, $style.castleWallBack]" :style="{ transform: wallTransform }" aria-hidden="true" />
    <div :class="[$style.castleWallTransition, $style.castleWallFront]" :style="{ transform: wallTransform }" aria-hidden="true" />
    <div :class="$style.foregroundPost" :style="{ transform: postTransform }" aria-hidden="true">
      <div :class="[$style.raven, $style.ravenForeground]"><i /></div>
    </div>
  </Teleport>
</template>

<style module lang="scss" src="./CastleWalls.module.scss"></style>
