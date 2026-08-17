<script setup lang="ts">
import { storeToRefs } from "pinia";
import QuestScroll from "./QuestScroll.vue";
import { useQuestModalStore } from "@/stores/quest-modals";

const modalStore = useQuestModalStore();
const {
  current,
  visible,
  presentationKey,
  currentDurationMs,
} = storeToRefs(modalStore);
</script>

<template>
  <QuestScroll
    :notice="current"
    :visible="visible"
    :presentation-key="presentationKey"
    :duration-ms="currentDurationMs"
  />
</template>
