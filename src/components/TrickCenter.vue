<script setup lang="ts">
import { computed } from 'vue';
import type { Trick } from '../engine/types';
import { formatComboDisplayName } from '../i18n/formatters';
import type { Language, Translations } from '../i18n/translations';
import CardView from './CardView.vue';

interface Props {
  currentTrick: Trick | null;
  passCount: number;
  isFirstTurnOfGame: boolean;
  currentPlayerName: string;
  isHumanTurn: boolean;
  currentLanguage: Language;
  t: Translations;
}

const props = defineProps<Props>();

const hasActiveTrick = computed(() => props.currentTrick !== null);

const localizedTrickComboName = computed(() => {
  if (!props.currentTrick) return '';
  return formatComboDisplayName(props.currentTrick.combo, props.currentLanguage);
});
</script>

<template>
  <div class="relative flex flex-col items-center justify-center min-h-[170px] sm:min-h-[200px] w-full max-w-xl mx-auto px-4 py-2">
    <!-- Center Play Field Backdrop -->
    <div class="absolute inset-0 rounded-3xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm pointer-events-none shadow-inner"></div>

    <!-- Active Played Cards -->
    <div v-if="hasActiveTrick && currentTrick" class="relative z-10 flex flex-col items-center gap-3">
      <!-- Combo Info Header Badge -->
      <div class="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 px-3.5 py-1 rounded-full shadow-lg text-xs sm:text-sm">
        <span class="text-amber-400 font-bold">{{ localizedTrickComboName }}</span>
        <span class="text-slate-400">•</span>
        <span class="text-slate-200">{{ t.playedBy }} <strong class="text-white">{{ currentTrick.playerName }}</strong></span>
      </div>

      <!-- Fanned Cards Stack -->
      <div class="flex items-center justify-center pt-1 pb-2">
        <div
          v-for="(card, index) in currentTrick.cards"
          :key="card.id"
          class="transition-all duration-300 transform -mx-2 sm:-mx-3 animate-play"
          :style="{
            transform: `rotate(${(index - (currentTrick.cards.length - 1) / 2) * 5}deg)`,
            zIndex: index + 1,
          }"
        >
          <CardView :card="card" size="md" />
        </div>
      </div>

      <!-- Passes Tracker -->
      <div v-if="passCount > 0" class="flex items-center gap-1.5 text-xs text-amber-200/90 bg-slate-900/75 px-3 py-0.5 rounded-full border border-white/10">
        <span class="font-semibold">{{ passCount }}</span>
        <span>{{ passCount === 1 ? t.playersPassed1 : t.playersPassedPlural }}</span>
        <div class="flex gap-1 ml-1">
          <span
            v-for="dot in 3"
            :key="dot"
            class="w-1.5 h-1.5 rounded-full"
            :class="dot <= passCount ? 'bg-amber-400' : 'bg-slate-700'"
          ></span>
        </div>
      </div>
    </div>

    <!-- Empty Table / Free Play Lead State -->
    <div v-else class="relative z-10 flex flex-col items-center gap-2 text-center p-4">
      <div
        v-if="isFirstTurnOfGame"
        class="flex flex-col items-center gap-1 bg-amber-950/80 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-2xl shadow-lg animate-pulse"
      >
        <div class="flex items-center gap-1.5 font-bold text-sm sm:text-base">
          <span class="text-red-400 text-lg">♦</span>
          <span>{{ t.startingMove3D }}</span>
        </div>
        <span class="text-xs text-amber-300/80">
          {{ isHumanTurn ? t.mustPlay3DYou : `${currentPlayerName} ${t.mustPlay3DBot}` }}
        </span>
      </div>

      <div
        v-else
        class="flex flex-col items-center gap-1 bg-slate-900/80 border border-emerald-400/40 text-emerald-200 px-4 py-2.5 rounded-2xl shadow-lg"
      >
        <div class="font-bold text-sm sm:text-base text-emerald-300">
          {{ t.freePlay }}
        </div>
        <span class="text-xs text-slate-300">
          {{ isHumanTurn ? t.freePlayYou : `${currentPlayerName} ${t.freePlayBot}` }}
        </span>
      </div>
    </div>
  </div>
</template>
