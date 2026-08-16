<script setup lang="ts">
import { RouterView } from "vue-router";
import QuestModalHost from "@/components/modals/quests/QuestModalHost.vue";
import SceneModalHost from "@/components/modals/scenes/SceneModalHost.vue";
</script>

<template>
  <RouterView />
  <SceneModalHost />
  <QuestModalHost />
</template>
