<script setup lang="ts">
defineProps<{
  visible: boolean;
  placement: "left" | "right";
}>();
</script>

<template>
  <Transition
    :enter-active-class="$style.enterActive"
    :leave-active-class="$style.leaveActive"
    :enter-from-class="$style.hiddenState"
    :leave-to-class="$style.hiddenState"
  >
    <aside
      v-if="visible"
      :class="[$style.guide, $style[placement]]"
      role="status"
      aria-live="polite"
    >
      <div :class="$style.spaceKey" aria-hidden="true">
        <span>ESPACIO</span>
        <i />
      </div>
      <p>ESPACIO · CONTINUAR</p>
    </aside>
  </Transition>
</template>

<style module lang="scss" src="./ConversationContinueGuide.module.scss"></style>
