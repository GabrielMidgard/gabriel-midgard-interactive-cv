<script setup lang="ts">
import { computed } from "vue";
import type { CssVariables } from "@/types/experience";
import ScrollGuide from "./ScrollGuide.vue";
import type { QuestScrollNotice } from "./QuestScroll.types";

const props = defineProps<{
  notice: QuestScrollNotice | null;
  visible: boolean;
  presentationKey: number;
  durationMs: number;
}>();

const heading = computed(() => props.notice?.heading.toLocaleUpperCase("es-MX") ?? "");

const modalStyle = computed(() => {
  const duration = Math.max(1500, props.durationMs);
  const openDuration = Math.min(860, Math.max(560, duration * 0.27));

  return {
    "--quest-duration": `${duration}ms`,
    "--quest-open-duration": `${openDuration}ms`,
    "--quest-heading-delay": `${openDuration * 0.72}ms`,
    "--quest-panel-delay": `${openDuration * 0.94}ms`,
  } as CssVariables;
});
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-active-class="$style.enterActive"
      :leave-active-class="$style.leaveActive"
      :enter-from-class="$style.enterFrom"
      :leave-to-class="$style.leaveTo"
    >
      <aside
        v-if="visible && notice"
        :key="presentationKey"
        :class="[
          $style.notice,
          $style[notice.tone ?? 'parchment'],
          { [$style.scrollGuideNotice]: notice.variant === 'scroll-guide' },
        ]"
        :style="modalStyle"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div :class="$style.scrollHeader">
          <div :class="$style.sheet">
            <h2>{{ heading }}</h2>
          </div>
          <span :class="[$style.roller, $style.leftRoller]" aria-hidden="true" />
          <span :class="[$style.roller, $style.rightRoller]" aria-hidden="true" />
        </div>

        <div
          :class="[
            $style.details,
            { [$style.scrollDetails]: notice.variant === 'scroll-guide' },
          ]"
        >
          <template v-if="notice.variant === 'scroll-guide'">
            <ScrollGuide size="modal" />
          </template>
          <template v-else>
            <h3 v-if="notice.title">{{ notice.title }}</h3>
            <p v-if="notice.description"><i aria-hidden="true">◇</i>{{ notice.description }}</p>
          </template>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style module lang="scss" src="./QuestScroll.module.scss"></style>
