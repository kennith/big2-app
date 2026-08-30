<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from '../engine/types';
import type { Translations } from '../i18n/translations';
import CardView from './CardView.vue';

interface Props {
  hand: Card[];
  selectedCardIds: Set<string>;
  isTurn: boolean;
  sortMode: 'rank' | 'suit' | 'combo';
  t: Translations;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggleCard', card: Card): void;
  (e: 'toggleSort'): void;
}>();

// Dynamic negative overlap margin based on number of cards in hand
const overlapMargin = computed(() => {
  const count = props.hand.length;
  if (count <= 5) return 'margin-left: 4px; margin-right: 4px;';
  if (count <= 8) return 'margin-left: -12px;';
  if (count <= 11) return 'margin-left: -20px;';
  return 'margin-left: -28px;';
});

const currentSortLabel = computed(() => {
  if (props.sortMode === 'rank') return props.t.rank;
  if (props.sortMode === 'suit') return props.t.suit;
  return props.t.combo;
});
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-4xl mx-auto px-2">
    <!-- Hand Header / Quick Controls -->
    <div class="flex items-center justify-between w-full max-w-2xl px-3 py-1 mb-1 text-xs text-slate-300">
      <div class="flex items-center gap-2">
        <span class="font-bold text-slate-100 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" :class="isTurn ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'"></span>
          {{ t.yourHand }} ({{ hand.length }} 張)
        </span>
        <span
          v-if="hand.length <= 3 && hand.length > 0"
          class="px-2 py-0.5 rounded-full bg-red-600/80 text-white font-black text-[10px] animate-bounce"
        >
          {{ hand.length === 1 ? t.lastCard : `${hand.length} ${t.cardsLeftAlert}` }}
        </span>
      </div>

      <button
        @click="emit('toggleSort')"
        class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700 text-xs text-amber-300 font-medium shadow-sm"
        title="Change card sorting"
      >
        <span>{{ t.sort }}:</span>
        <span class="font-bold text-white">{{ currentSortLabel }}</span>
      </button>
    </div>

    <!-- Cards Row -->
    <div
      class="flex items-center justify-center min-h-[120px] sm:min-h-[140px] pt-6 pb-2 px-4 w-full overflow-x-auto overflow-y-visible"
    >
      <div
        v-for="(card, index) in hand"
        :key="card.id"
        :style="[
          index > 0 ? overlapMargin : '',
          { zIndex: index + 1 }
        ]"
        class="transition-all duration-200"
      >
        <CardView
          :card="card"
          :is-selected="selectedCardIds.has(card.id)"
          size="md"
          @click="emit('toggleCard', card)"
        />
      </div>
    </div>
  </div>
</template>
