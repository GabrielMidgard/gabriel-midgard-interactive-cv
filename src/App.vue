<script setup lang="ts">
import { RouterView } from "vue-router";
import QuestScrollHost from "@/components/modals/questScroll/QuestScrollHost.vue";
import SceneModalHost from "@/components/modals/scenes/SceneModalHost.vue";
</script>

<template>
  <RouterView />
  <SceneModalHost />
  <QuestScrollHost />
</template>
