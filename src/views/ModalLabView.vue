<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { modalLabExamples } from "@/config/scene-location-notices";
import { useSceneModalStore } from "@/stores/scene-modals";
import { useSettingsStore } from "@/stores/settings";
import type { CssVariables } from "@/types/experience";

const sceneModalStore = useSceneModalStore();
const settingsStore = useSettingsStore();
const backgroundColor = ref("#000000");

const modalDurationSeconds = computed({
  get: () => settingsStore.sceneModalDurationSeconds,
  set: (value: number) => settingsStore.setSceneModalDurationSeconds(value),
});

const pageStyle = computed(() => ({
  "--lab-background": backgroundColor.value,
}) as CssVariables);

const swatches = ["#000000", "#101617", "#2b1717", "#e8ded0"];

onMounted(() => {
  if (!settingsStore.isReady) void settingsStore.loadSettings();
});
</script>

<template>
  <main :class="$style.lab" :style="pageStyle">
    <div :class="$style.ambient" aria-hidden="true" />

    <header :class="$style.header">
      <RouterLink to="/" :class="$style.back">← VOLVER A LA EXPERIENCIA</RouterLink>
      <p>LABORATORIO DE INTERFAZ · MODALS / SCENES</p>
      <h1>Modales de escena</h1>
      <span>Prueba cada aviso sobre distintos tonos sin entrar al recorrido completo.</span>
    </header>

    <section :class="$style.controls" aria-labelledby="background-heading">
      <div>
        <small>LIENZO DE PRUEBA</small>
        <h2 id="background-heading">Color de fondo</h2>
      </div>
      <label :class="$style.colorPicker">
        <input v-model="backgroundColor" type="color" aria-label="Editar color de fondo" />
        <span>{{ backgroundColor.toUpperCase() }}</span>
      </label>
      <label :class="$style.durationEditor">
        <span>DURACIÓN</span>
        <input
          v-model.number="modalDurationSeconds"
          type="number"
          min="1.5"
          max="12"
          step="0.1"
          aria-label="Duración del modal en segundos"
        />
        <b>SEG.</b>
      </label>
      <div :class="$style.swatches" aria-label="Colores sugeridos">
        <button
          v-for="swatch in swatches"
          :key="swatch"
          type="button"
          :style="{ backgroundColor: swatch }"
          :aria-label="`Usar fondo ${swatch}`"
          @click="backgroundColor = swatch"
        />
      </div>
      <button type="button" :class="$style.reset" @click="backgroundColor = '#000000'">
        RESTABLECER NEGRO
      </button>
    </section>

    <section :class="$style.catalog" aria-labelledby="catalog-heading">
      <div :class="$style.sectionHeading">
        <small>CATÁLOGO INTERACTIVO</small>
        <h2 id="catalog-heading">Ejemplos disponibles</h2>
      </div>

      <article v-for="notice in modalLabExamples" :key="notice.id" :class="$style.card">
        <span :class="[$style.tone, $style[notice.tone ?? 'blood']]" />
        <div>
          <small>{{ notice.eyebrow }}</small>
          <h3>{{ notice.title }}</h3>
          <p>{{ notice.subtitle ?? notice.runeText }}</p>
        </div>
        <button type="button" @click="sceneModalStore.showNotice(notice)">
          PROBAR MODAL
        </button>
      </article>
    </section>

    <footer :class="$style.footer">
      <span>Ruta directa</span>
      <code>http://localhost:5173/test/modals</code>
    </footer>
  </main>
</template>

<style module lang="scss" src="./ModalLabView.module.scss"></style>
