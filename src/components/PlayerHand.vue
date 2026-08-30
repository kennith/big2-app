<script setup lang="ts">
import { computed } from 'vue';
import { type HandComboGroup, partitionHandByCombos } from '../engine/combos';
import type { Card } from '../engine/types';
import { formatComboDisplayName } from '../i18n/formatters';
import type { Language, Translations } from '../i18n/translations';
import CardView from './CardView.vue';

interface Props {
  hand: Card[];
  selectedCardIds: Set<string>;
  isTurn: boolean;
  sortMode: 'rank' | 'suit' | 'combo';
  currentLanguage: Language;
  t: Translations;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggleCard', card: Card): void;
  (e: 'toggleGroup', cards: Card[]): void;
  (e: 'toggleSort'): void;
}>();

// Dynamic negative overlap margin based on number of cards in hand
const overlapMargin = computed(() => {
  const count = props.hand.length;
  if (count <= 4) return 'margin-left: 3px; margin-right: 3px;';
  if (count <= 7) return 'margin-left: -14px;';
  if (count <= 10) return 'margin-left: -22px;';
  return 'margin-left: -32px;';
});

const currentSortLabel = computed(() => {
  if (props.sortMode === 'rank') return props.t.rank;
  if (props.sortMode === 'suit') return props.t.suit;
  return props.t.combo;
});

// Combination groupings when in combo sort mode
const comboGroups = computed<HandComboGroup[]>(() => {
  if (props.sortMode !== 'combo') return [];
  return partitionHandByCombos(props.hand);
});

function getGroupLabel(group: HandComboGroup): string {
  if (group.combo) {
    return formatComboDisplayName(group.combo, props.currentLanguage);
  }
  if (props.currentLanguage === 'zh-TW') {
    return `單張 (${group.cards.length}張)`;
  }
  return `Singles (${group.cards.length})`;
}

function getGroupIcon(type: string): string {
  switch (type) {
    case 'STRAIGHT_FLUSH':
      return '👑';
    case 'QUAD':
      return '💣';
    case 'FULL_HOUSE':
      return '🏠';
    case 'FLUSH':
      return '🌸';
    case 'STRAIGHT':
      return '⚡';
    case 'TRIPLE':
      return '☘️';
    case 'PAIR':
      return '👥';
    case 'SINGLE':
    default:
      return '🃏';
  }
}

function getGroupBadgeClass(group: HandComboGroup): string {
  const allSelected = group.cards.every((c) => props.selectedCardIds.has(c.id));
  const base = allSelected
    ? 'ring-2 ring-amber-400 font-extrabold shadow-amber-500/40 '
    : 'opacity-90 hover:opacity-100 ';

  switch (group.type) {
    case 'STRAIGHT_FLUSH':
      return base + 'bg-emerald-600/90 text-white border border-emerald-300';
    case 'QUAD':
      return base + 'bg-orange-600/90 text-white border border-orange-300';
    case 'FULL_HOUSE':
      return base + 'bg-amber-600/90 text-white border border-amber-300';
    case 'FLUSH':
      return base + 'bg-blue-600/90 text-white border border-blue-300';
    case 'STRAIGHT':
      return base + 'bg-purple-600/90 text-white border border-purple-300';
    case 'TRIPLE':
      return base + 'bg-indigo-600/90 text-white border border-indigo-300';
    case 'PAIR':
      return base + 'bg-teal-600/90 text-white border border-teal-300';
    case 'SINGLE':
    default:
      return 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default opacity-80';
  }
}

function handleSelectGroup(group: HandComboGroup) {
  if (group.type === 'SINGLE') return; // Cannot select multiple singles as a combo play
  emit('toggleGroup', group.cards);
}
</script>

<template>
  <div class="flex flex-col items-center w-full max-w-5xl mx-auto px-2">
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
        class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700 text-xs text-amber-300 font-medium shadow-sm cursor-pointer"
        title="Change card sorting"
      >
        <span>{{ t.sort }}:</span>
        <span class="font-bold text-white">{{ currentSortLabel }}</span>
      </button>
    </div>

    <!-- Cards Row: Combo Mode (With Hints on Top of each Combo) -->
    <div
      v-if="sortMode === 'combo'"
      class="flex items-end justify-center min-h-[105px] sm:min-h-[140px] pt-1 pb-1 px-1 w-full overflow-x-auto gap-1.5 sm:gap-3"
    >
      <div
        v-for="group in comboGroups"
        :key="group.id"
        class="flex flex-col items-center p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-md transition-all hover:border-slate-500"
      >
        <!-- Interactive Hint badge for multi-card combination -->
        <button
          v-if="group.type !== 'SINGLE'"
          @click="handleSelectGroup(group)"
          class="mb-1 sm:mb-2 px-2 sm:px-2.5 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-tight transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
          :class="getGroupBadgeClass(group)"
          title="點擊全選/取消此組合 / Click to toggle combo selection"
        >
          <span>{{ getGroupIcon(group.type) }}</span>
          <span>{{ getGroupLabel(group) }}</span>
        </button>

        <!-- Static info badge for singles (non-clickable) -->
        <div
          v-else
          class="mb-1 sm:mb-2 px-2 sm:px-2.5 py-0.2 sm:py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-tight bg-slate-800/90 text-slate-400 border border-slate-700/80 select-none flex items-center gap-1 cursor-default opacity-85 shadow-sm"
          title="單張請點選個別卡牌 / Click individual cards to play a single"
        >
          <span>{{ getGroupIcon(group.type) }}</span>
          <span>{{ getGroupLabel(group) }}</span>
        </div>

        <!-- Cards in this combination -->
        <div class="flex items-center justify-center pt-0.5 px-0.5">
          <div
            v-for="(card, cardIdx) in group.cards"
            :key="card.id"
            :style="[
              cardIdx > 0 ? (group.cards.length > 3 ? 'margin-left: -22px;' : 'margin-left: -12px;') : '',
              { zIndex: cardIdx + 1 }
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
    </div>

    <!-- Cards Row: Rank / Suit Mode (Continuous Fanned Layout) -->
    <div
      v-else
      class="flex items-center justify-center min-h-[90px] sm:min-h-[140px] pt-4 sm:pt-6 pb-1 sm:pb-2 px-2 sm:px-4 w-full overflow-x-auto overflow-y-visible"
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
