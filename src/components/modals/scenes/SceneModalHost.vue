<script setup lang="ts">
import { storeToRefs } from "pinia";
import SceneLocationModal from "./SceneLocationModal.vue";
import { useSceneModalStore } from "@/stores/scene-modals";

const modalStore = useSceneModalStore();
const {
  current,
  visible,
  presentationKey,
  currentDurationMs,
  currentPalette,
} = storeToRefs(modalStore);
</script>

<template>
  <SceneLocationModal
    :notice="current"
    :visible="visible"
    :presentation-key="presentationKey"
    :duration-ms="currentDurationMs"
    :palette="currentPalette"
  />
</template>
