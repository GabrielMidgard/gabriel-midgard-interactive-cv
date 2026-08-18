<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import ConversationContinueGuide from "./ConversationContinueGuide.vue";
import type {
  ConversationActor,
  ConversationChoice,
  ConversationDefinition,
} from "@/types/conversations";

const props = defineProps<{
  visible: boolean;
  conversation: ConversationDefinition | null;
}>();

const emit = defineEmits<{
  close: [];
  complete: [conversationId: string];
  choice: [choice: ConversationChoice];
}>();

const modal = ref<HTMLElement | null>(null);
const currentNodeId = ref("");
const continueGuideVisible = ref(false);
let continueGuideTimer: ReturnType<typeof setTimeout> | undefined;

const CONTINUE_GUIDE_DELAY_MS = 3000;

const actors = computed(() => Object.values(props.conversation?.actors ?? {}));
const currentNode = computed(() => props.conversation?.nodes[currentNodeId.value] ?? null);
const speaker = computed(() => currentNode.value
  ? props.conversation?.actors[currentNode.value.speaker] ?? null
  : null);
const choices = computed(() => currentNode.value?.choices ?? []);

function resetConversation() {
  currentNodeId.value = props.conversation?.startNode ?? "";
  void nextTick(() => modal.value?.focus());
}

function hideContinueGuide() {
  if (continueGuideTimer) clearTimeout(continueGuideTimer);
  continueGuideTimer = undefined;
  continueGuideVisible.value = false;
}

function scheduleContinueGuide() {
  hideContinueGuide();
  if (!props.visible || !currentNode.value || choices.value.length) return;

  continueGuideTimer = setTimeout(() => {
    continueGuideVisible.value = true;
    continueGuideTimer = undefined;
  }, CONTINUE_GUIDE_DELAY_MS);
}

function actorSprite(actor: ConversationActor) {
  if (actor.id !== currentNode.value?.speaker) return actor.sprites.neutral;
  const emotion = currentNode.value.emotion ?? "neutral";
  return actor.sprites[emotion] ?? actor.sprites.neutral;
}

function closeConversation() {
  hideContinueGuide();
  emit("close");
}

function completeConversation() {
  if (props.conversation) emit("complete", props.conversation.id);
  closeConversation();
}

function advance() {
  if (!currentNode.value || choices.value.length) return;
  hideContinueGuide();
  if (!currentNode.value.next) {
    completeConversation();
    return;
  }
  currentNodeId.value = currentNode.value.next;
}

function selectChoice(choice: ConversationChoice) {
  hideContinueGuide();
  emit("choice", choice);
  currentNodeId.value = choice.next;
}

watch(
  [() => props.visible, () => props.conversation?.id],
  ([visible]) => {
    if (visible) resetConversation();
  },
  { immediate: true },
);

watch(
  [() => props.visible, currentNodeId],
  ([visible]) => {
    if (visible) scheduleContinueGuide();
    else hideContinueGuide();
  },
  { immediate: true },
);

onBeforeUnmount(hideContinueGuide);
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-active-class="$style.enterActive"
      :leave-active-class="$style.leaveActive"
      :enter-from-class="$style.fadeState"
      :leave-to-class="$style.fadeState"
    >
      <section
        v-if="visible && conversation && currentNode"
        ref="modal"
        :class="$style.modal"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        :aria-label="`Conversación con ${speaker?.name ?? 'un personaje'}`"
        @keydown.enter.prevent="advance"
        @keydown.space.prevent="advance"
        @keydown.esc="closeConversation"
      >
        <div :class="$style.actors" aria-hidden="true">
          <figure
            v-for="actor in actors"
            :key="`${actor.id}-${currentNodeId}`"
            :class="[
              $style.actor,
              $style[actor.side],
              $style[actor.id],
              $style[actor.size ?? 'medium'],
              {
                [$style.activeActor]: actor.id === currentNode.speaker,
                [$style.inactiveActor]: actor.id !== currentNode.speaker,
              },
              actor.id === currentNode.speaker && currentNode.position
                ? $style[currentNode.position]
                : null,
              actor.id === currentNode.speaker && currentNode.emotion
                ? $style[currentNode.emotion]
                : null,
              actor.id === currentNode.speaker && currentNode.motion
                ? $style[currentNode.motion]
                : null,
            ]"
          >
            <div :class="$style.portrait">
              <img :src="actorSprite(actor)" :alt="actor.name" />
            </div>
          </figure>
        </div>

        <div :class="$style.vignette" aria-hidden="true" />

        <div
          :class="[
            $style.dialogue,
            speaker?.side === 'right' ? $style.speakerRight : $style.speakerLeft,
          ]"
        >
          <div :class="$style.ornateFrame" aria-hidden="true">
            <i :class="[$style.frameRail, $style.frameRailTop]" />
            <i :class="[$style.frameRail, $style.frameRailRight]" />
            <i :class="[$style.frameRail, $style.frameRailBottom]" />
            <i :class="[$style.frameRail, $style.frameRailLeft]" />
            <span :class="[$style.frameCorner, $style.frameCornerTopLeft]" />
            <span :class="[$style.frameCorner, $style.frameCornerTopRight]" />
            <span :class="[$style.frameCorner, $style.frameCornerBottomRight]" />
            <span :class="[$style.frameCorner, $style.frameCornerBottomLeft]" />
          </div>

          <div :class="$style.nameplate">
            <i :class="[$style.nameRoller, $style.nameRollerLeft]" aria-hidden="true" />
            <span :class="$style.nameSheet">
              <small>{{ speaker?.name }}</small>
            </span>
            <i :class="[$style.nameRoller, $style.nameRollerRight]" aria-hidden="true" />
          </div>

          <p :key="currentNodeId" :class="$style.line" aria-live="polite">
            {{ currentNode.text }}
          </p>

          <div v-if="choices.length" :class="$style.choices">
            <button
              v-for="choice in choices"
              :key="choice.id"
              type="button"
              @click="selectChoice(choice)"
            >
              <i aria-hidden="true">◇</i>
              {{ choice.text }}
            </button>
          </div>

          <button
            v-else
            type="button"
            :class="$style.advance"
            @click="advance"
          >
            {{ currentNode.next ? "CONTINUAR" : "FINALIZAR" }}
            <span aria-hidden="true">›</span>
          </button>

          <div :class="$style.progress" aria-hidden="true">
            <i
              v-for="nodeId in Object.keys(conversation.nodes)"
              :key="nodeId"
              :class="{ [$style.currentProgress]: nodeId === currentNodeId }"
            />
          </div>
        </div>

        <button type="button" :class="$style.close" aria-label="Cerrar conversación" @click="closeConversation">
          ×
        </button>

        <ConversationContinueGuide
          :visible="continueGuideVisible"
          :placement="speaker?.side === 'right' ? 'left' : 'right'"
        />
      </section>
    </Transition>
  </Teleport>
</template>

<style module lang="scss" src="./ConversationModal.module.scss"></style>
