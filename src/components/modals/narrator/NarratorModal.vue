<script setup lang="ts">
import { onBeforeUnmount, watch } from "vue";
import type { CssVariables } from "@/types/experience";

const props = withDefaults(defineProps<{
  visible: boolean;
  message: string;
  presentationKey?: number;
}>(), {
  presentationKey: 0,
});

const runeAlphabet = ["ᚨ", "ᛉ", "ᚱ", "ᚾ", "ᛃ", "ᛇ", "ᛏ", "ᛟ", "ᚲ", "ᛞ", "ᛒ", "ᚷ"];

const orbitRunes = runeAlphabet.map((symbol, index) => ({
  symbol,
  style: { "--rune-index": index } as CssVariables,
}));

const floatingRunes = Array.from({ length: 28 }, (_, index) => ({
  symbol: runeAlphabet[index % runeAlphabet.length],
  style: {
    "--rune-x": `${(index * 37 + 9) % 96}%`,
    "--rune-delay": `${-((index * 0.43) % 6.8)}s`,
    "--rune-duration": `${5.2 + (index % 6) * 0.55}s`,
    "--rune-scale": `${0.7 + (index % 5) * 0.13}`,
  } as CssVariables,
}));

const glitchBands = Array.from({ length: 16 }, (_, index) => ({
  style: {
    "--glitch-top": `${(index * 29 + 3) % 97}%`,
    "--glitch-height": `${0.7 + (index % 4) * 0.48}vh`,
    "--glitch-delay": `${-index * 0.13}s`,
    "--glitch-duration": `${0.72 + (index % 5) * 0.16}s`,
  } as CssVariables,
}));

function lockScreen() {
  document.body.classList.add("narrator-modal-open");
}

function unlockScreen() {
  document.body.classList.remove("narrator-modal-open");
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) lockScreen();
  },
  { immediate: true },
);

onBeforeUnmount(unlockScreen);
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-active-class="$style.enterActive"
      :leave-active-class="$style.leaveActive"
      :enter-from-class="$style.fadeState"
      :leave-to-class="$style.fadeState"
      @after-leave="unlockScreen"
    >
      <section
        v-if="visible"
        :key="presentationKey"
        :class="$style.modal"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div :class="$style.glitchBands" aria-hidden="true">
          <i v-for="(band, index) in glitchBands" :key="index" :style="band.style" />
        </div>

        <div :class="$style.runeRain" aria-hidden="true">
          <span
            v-for="(rune, index) in floatingRunes"
            :key="index"
            :style="rune.style"
          >{{ rune.symbol }}</span>
        </div>

        <div :class="$style.oracle">
          <div :class="$style.orbit" aria-hidden="true">
            <span
              v-for="(rune, index) in orbitRunes"
              :key="index"
              :style="rune.style"
            >{{ rune.symbol }}</span>
          </div>

          <div :class="$style.copy">
            <blockquote>“{{ message }}”</blockquote>
          </div>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style module lang="scss" src="./NarratorModal.module.scss"></style>
