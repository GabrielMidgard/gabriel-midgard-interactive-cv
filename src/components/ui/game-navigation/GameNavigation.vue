<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import type { NavigationPanel } from "@/types/game-ui";

const props = defineProps<{
  activePanel: NavigationPanel | null;
}>();

const emit = defineEmits<{
  select: [panel: NavigationPanel];
}>();

const items: { id: NavigationPanel; label: string; key: string; symbol: string }[] = [
  { id: "map", label: "MAPA", key: "M", symbol: "✥" },
  { id: "inventory", label: "INVENTARIO", key: "I", symbol: "◇" },
  { id: "journal", label: "DIARIO", key: "J", symbol: "▤" },
];

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
      :class="{ [$style.active]: props.activePanel === item.id }"
      :aria-pressed="props.activePanel === item.id"
      @click="emit('select', item.id)"
    >
      <i aria-hidden="true">{{ item.symbol }}</i>
      <span>{{ item.label }}</span>
      <kbd>{{ item.key }}</kbd>
    </button>
  </nav>
</template>

<style module lang="scss" src="./GameNavigation.module.scss"></style>
