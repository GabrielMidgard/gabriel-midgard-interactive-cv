<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const visible = ref(true);
const touchOnly = ref(false);

const label = computed(() => touchOnly.value ? "DESLIZA · AVANZAR" : "SCROLL · AVANZAR");

function dismiss() {
  visible.value = false;
}

onMounted(() => {
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
  touchOnly.value = !hasFinePointer && navigator.maxTouchPoints > 0;
  window.addEventListener("wheel", dismiss, { passive: true });
  window.addEventListener("touchmove", dismiss, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("wheel", dismiss);
  window.removeEventListener("touchmove", dismiss);
});
</script>

<template>
  <Transition :enter-active-class="$style.enter" :leave-active-class="$style.leave">
    <aside v-if="visible" :class="$style.guide" aria-label="Instrucciones de desplazamiento">
      <div :class="[$style.gesture, { [$style.touch]: touchOnly }]" aria-hidden="true">
        <i />
        <span>⌄</span>
      </div>
      <p>{{ label }}</p>
    </aside>
  </Transition>
</template>

<style module lang="scss" src="./ScrollGuide.module.scss"></style>
