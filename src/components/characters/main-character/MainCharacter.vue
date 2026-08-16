<script setup lang="ts">
import { computed, useCssModule } from "vue";
import type { MotionState } from "@/types/experience";

const props = defineProps<{
  motion: MotionState;
  backwards: boolean;
  left: string;
}>();
const styles = useCssModule();

const playerClasses = computed(() => [
  styles.player,
  styles[props.motion],
  props.backwards ? styles.backwards : "",
]);
</script>

<template>
  <div :class="playerClasses" :style="{ left }" aria-hidden="true">
    <i />
  </div>
</template>

<style module lang="scss" src="./MainCharacter.module.scss"></style>
