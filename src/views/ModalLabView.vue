<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import ScrollGuidePreview from "@/components/test/modals/ScrollGuidePreview.vue";
import {
  adventureScrollTutorial,
  questModalLabExamples,
} from "@/config/quest-modal-notices";
import { modalLabExamples } from "@/config/scene-location-notices";
import { useQuestModalStore } from "@/stores/quest-modals";
import { useSceneModalStore } from "@/stores/scene-modals";
import { useSettingsStore } from "@/stores/settings";
import type { CssVariables } from "@/types/experience";

const sceneModalStore = useSceneModalStore();
const questModalStore = useQuestModalStore();
const settingsStore = useSettingsStore();
const backgroundColor = ref("#000000");
const scrollGuidePreviewVisible = ref(false);
let scrollGuidePreviewTimer: ReturnType<typeof setTimeout> | undefined;

const modalDurationSeconds = computed({
  get: () => settingsStore.sceneModalDurationSeconds,
  set: (value: number) => settingsStore.setSceneModalDurationSeconds(value),
});

const questDurationSeconds = computed({
  get: () => settingsStore.questModalDurationSeconds,
  set: (value: number) => settingsStore.setQuestModalDurationSeconds(value),
});

const pageStyle = computed(() => ({
  "--lab-background": backgroundColor.value,
}) as CssVariables);

const swatches = ["#000000", "#101617", "#2b1717", "#e8ded0"];

onMounted(() => {
  if (!settingsStore.isReady) void settingsStore.loadSettings();
});

onBeforeUnmount(() => {
  if (scrollGuidePreviewTimer) clearTimeout(scrollGuidePreviewTimer);
  sceneModalStore.resetLocation();
  questModalStore.reset();
});

function showSceneModal(notice: (typeof modalLabExamples)[number]) {
  hideScrollGuidePreview();
  questModalStore.reset();
  sceneModalStore.showNotice(notice);
}

function showQuestModal(notice: (typeof questModalLabExamples)[number]) {
  hideScrollGuidePreview();
  sceneModalStore.resetLocation();
  questModalStore.showNotice(notice);
}

function showScrollTutorial() {
  hideScrollGuidePreview();
  sceneModalStore.resetLocation();
  questModalStore.showNotice(adventureScrollTutorial);
}

function hideScrollGuidePreview() {
  if (scrollGuidePreviewTimer) clearTimeout(scrollGuidePreviewTimer);
  scrollGuidePreviewTimer = undefined;
  scrollGuidePreviewVisible.value = false;
}

function showScrollGuidePreview() {
  sceneModalStore.resetLocation();
  questModalStore.reset();
  hideScrollGuidePreview();
  scrollGuidePreviewVisible.value = true;
  const previewDurationMs = Math.max(7500, questDurationSeconds.value * 1000);
  scrollGuidePreviewTimer = setTimeout(hideScrollGuidePreview, previewDurationMs);
}
</script>

<template>
  <main :class="$style.lab" :style="pageStyle">
    <div :class="$style.ambient" aria-hidden="true" />

    <header :class="$style.header">
      <nav :class="$style.labLinks" aria-label="Laboratorios de interfaz">
        <RouterLink to="/" :class="$style.back">← VOLVER A LA EXPERIENCIA</RouterLink>
        <RouterLink to="/test/damage" :class="$style.back">PRUEBAS DE DAÑO</RouterLink>
      </nav>
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
      <div :class="$style.durationGroup">
        <label :class="$style.durationEditor">
          <span>ESCENA</span>
          <input
            v-model.number="modalDurationSeconds"
            type="number"
            min="1.5"
            max="12"
            step="0.1"
            aria-label="Duración del modal de escena en segundos"
          />
          <b>SEG.</b>
        </label>
        <label :class="$style.durationEditor">
          <span>PERGAMINO</span>
          <input
            v-model.number="questDurationSeconds"
            type="number"
            min="1.5"
            max="12"
            step="0.1"
            aria-label="Duración del modal de misión en segundos"
          />
          <b>SEG.</b>
        </label>
      </div>
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
        <small>FONDO DE SCROLL</small>
        <h2 id="catalog-heading">Avisos de escenario</h2>
      </div>

      <article v-for="notice in modalLabExamples" :key="notice.id" :class="$style.card">
        <span :class="[$style.tone, $style[notice.tone ?? 'blood']]" />
        <div>
          <small>{{ notice.eyebrow }}</small>
          <h3>{{ notice.title }}</h3>
          <p>{{ notice.subtitle ?? notice.runeText }}</p>
        </div>
        <button type="button" @click="showSceneModal(notice)">
          PROBAR MODAL
        </button>
      </article>

      <div :class="[$style.sectionHeading, $style.questHeading]">
        <small>PERGAMINO MEDIEVAL</small>
        <h2>Misiones y objetivos</h2>
      </div>

      <article v-for="notice in questModalLabExamples" :key="notice.id" :class="$style.card">
        <span :class="[$style.tone, $style.questTone, $style[notice.tone ?? 'parchment']]" />
        <div>
          <small>{{ notice.heading }}</small>
          <h3>{{ notice.title }}</h3>
          <p>{{ notice.description }}</p>
        </div>
        <button type="button" @click="showQuestModal(notice)">
          PROBAR PERGAMINO
        </button>
      </article>

      <div :class="[$style.sectionHeading, $style.questHeading]">
        <small>GUÍAS DE DESPLAZAMIENTO</small>
        <h2>Scroll y controles</h2>
      </div>

      <article :class="$style.card">
        <span :class="[$style.tone, $style.questTone, $style.parchment]" />
        <div>
          <small>PERGAMINO ESPECIAL</small>
          <h3>Completa la aventura</h3>
          <p>Prueba el pergamino con el ciclo de mouse, flechas y teclado WASD.</p>
        </div>
        <button type="button" @click="showScrollTutorial">
          PROBAR PERGAMINO
        </button>
      </article>

      <article :class="$style.card">
        <span :class="[$style.tone, $style.questTone, $style.royal]" />
        <div>
          <small>INDICADOR INFERIOR</small>
          <h3>Guía de desplazamiento</h3>
          <p>Prueba directamente la guía compacta que aparece tras un periodo sin movimiento.</p>
        </div>
        <button type="button" @click="showScrollGuidePreview">
          PROBAR GUÍA
        </button>
      </article>
    </section>

    <Teleport to="body">
      <div :class="$style.scrollGuidePreviewHost">
        <ScrollGuidePreview :visible="scrollGuidePreviewVisible" />
      </div>
    </Teleport>

    <footer :class="$style.footer">
      <span>Ruta directa</span>
      <code>http://localhost:5173/test/modals</code>
    </footer>
  </main>
</template>

<style module lang="scss" src="./ModalLabView.module.scss"></style>
