<script setup lang="ts">
import type { ActiveMission } from "@/types/game-ui";

defineProps<{
  mission: ActiveMission;
  expanded: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <aside :class="[$style.mission, { [$style.collapsed]: !expanded }]">
    <button
      type="button"
      :class="$style.heading"
      :aria-expanded="expanded"
      aria-controls="active-mission-details"
      @click="$emit('toggle')"
    >
      <span>{{ mission.eyebrow }}</span>
      <i aria-hidden="true">⌄</i>
    </button>
    <div id="active-mission-details" :class="$style.details" :aria-hidden="!expanded">
      <strong>{{ mission.title }}</strong>
      <p><i aria-hidden="true">◆</i>{{ mission.objective }}</p>
    </div>
  </aside>
</template>

<style module lang="scss" src="./ActiveMission.module.scss"></style>
