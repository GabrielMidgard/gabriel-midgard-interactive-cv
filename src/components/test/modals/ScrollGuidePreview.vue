<script setup lang="ts">
import ScrollGuideControls from "@/components/modals/questScroll/ScrollGuide.vue";

defineProps<{
  visible: boolean;
}>();
</script>

<template>
  <Transition :enter-active-class="$style.enter" :leave-active-class="$style.leave">
    <aside
      v-if="visible"
      :class="$style.guide"
      aria-label="Vista de prueba de los controles de desplazamiento"
    >
      <ScrollGuideControls size="compact" />
    </aside>
  </Transition>
</template>

<style module lang="scss" src="./ScrollGuidePreview.module.scss"></style>
