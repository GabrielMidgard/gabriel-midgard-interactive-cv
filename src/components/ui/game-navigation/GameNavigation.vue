<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import type { NavigationPanel } from "@/types/game-ui";

const props = defineProps<{
  activePanel: NavigationPanel | null;
}>();

const emit = defineEmits<{
  select: [panel: NavigationPanel];
}>();

const items: { id: NavigationPanel; label: string; key: string; icon: string }[] = [
  { id: "map", label: "MAPA", key: "M", icon: "/assets/icons/icon-map.png" },
  {
    id: "inventory",
    label: "INVENTARIO",
    key: "I",
    icon: "/assets/icons/icon_inventary.png",
  },
  { id: "journal", label: "DIARIO", key: "J", icon: "/assets/icons/icon-diary.png" },
];

const cornerPositions = ["topLeft", "topRight", "bottomRight", "bottomLeft"] as const;

function handleKeyboard(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;
  if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
  const item = items.find(({ key }) => key.toLowerCase() === event.key.toLowerCase());
  if (item) emit("select", item.id);
}

onMounted(() => window.addEventListener("keydown", handleKeyboard));
onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyboard));
</script>

<template>
  <nav :class="$style.navigation" aria-label="Menú de aventura">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :class="[$style[item.id], { [$style.active]: props.activePanel === item.id }]"
      :aria-pressed="props.activePanel === item.id"
      @click="emit('select', item.id)"
    >
      <i :class="$style.iconWell" aria-hidden="true">
        <img :src="item.icon" alt="" />
      </i>
      <span>{{ item.label }}</span>
      <kbd>[{{ item.key }}]</kbd>
      <i
        v-for="position in cornerPositions"
        :key="position"
        :class="[$style.corner, $style[position]]"
        aria-hidden="true"
      >
        <img src="/assets/icons/icon-btn-corner.png" alt="" />
      </i>
    </button>
  </nav>
</template>

<style module lang="scss" src="./GameNavigation.module.scss"></style>
