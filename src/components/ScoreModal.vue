<script setup lang="ts">
import type { Player, RoundResult } from '../engine/types';
import type { Translations } from '../i18n/translations';

interface Props {
  roundResult: RoundResult;
  players: Player[];
  matchScores: number[];
  t: Translations;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'nextRound'): void;
  (e: 'newGame'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="w-full max-w-lg max-h-[92dvh] bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4 text-slate-100 min-h-0">
      <!-- Winner Banner -->
      <div class="flex flex-col items-center text-center gap-1 pb-2 border-b border-slate-800 flex-shrink-0">
        <div class="text-3xl sm:text-5xl animate-bounce">
          {{ roundResult.winnerIndex === 0 ? '🏆' : '👑' }}
        </div>
        <h2 class="text-lg sm:text-2xl font-black text-amber-400">
          {{ roundResult.winnerIndex === 0 ? t.victory : `${roundResult.winnerName} ${t.wonRound}` }}
        </h2>
        <p class="text-[11px] sm:text-sm text-slate-400">
          {{ t.round }} {{ roundResult.round }} {{ t.roundCompleted }}
        </p>
      </div>

      <!-- Score Breakdown Table (Scrollable) -->
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full text-xs sm:text-sm text-left">
          <thead>
            <tr class="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <th class="py-2 px-2">{{ t.player }}</th>
              <th class="py-2 px-2 text-center">{{ t.cardsLeft }}</th>
              <th class="py-2 px-2 text-center">{{ t.multiplier }}</th>
              <th class="py-2 px-2 text-right">{{ t.roundPts }}</th>
              <th class="py-2 px-2 text-right">{{ t.totalPts }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-mono">
            <tr
              v-for="penalty in roundResult.penalties"
              :key="penalty.playerIndex"
              :class="[
                penalty.playerIndex === roundResult.winnerIndex ? 'bg-amber-500/10 font-bold' : '',
                penalty.playerIndex === 0 ? 'text-emerald-300' : 'text-slate-200',
              ]"
            >
              <!-- Player Name -->
              <td class="py-2.5 px-2 font-sans flex items-center gap-1.5">
                <span>{{ players[penalty.playerIndex].avatar }}</span>
                <span>{{ penalty.playerName }}</span>
                <span v-if="penalty.playerIndex === roundResult.winnerIndex" class="text-amber-400 text-xs">⭐</span>
              </td>

              <!-- Cards Left -->
              <td class="py-2.5 px-2 text-center">
                {{ penalty.cardsLeft }}
              </td>

              <!-- Multiplier -->
              <td class="py-2.5 px-2 text-center">
                <span
                  v-if="penalty.multiplier > 1"
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold"
                  :class="penalty.multiplier === 3 ? 'bg-red-600/80 text-white' : 'bg-amber-600/80 text-white'"
                >
                  {{ penalty.multiplier }}x ({{ penalty.multiplier === 3 ? t.triplePenalty : t.doublePenalty }})
                </span>
                <span v-else class="text-slate-500 text-xs">1x</span>
              </td>

              <!-- Round Points -->
              <td class="py-2.5 px-2 text-right font-bold" :class="penalty.pointsLost > 0 ? 'text-red-400' : 'text-emerald-400'">
                +{{ penalty.pointsLost }}
              </td>

              <!-- Total Match Score -->
              <td class="py-2.5 px-2 text-right font-bold text-amber-300">
                {{ matchScores[penalty.playerIndex] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Buttons (Fixed) -->
      <div class="flex items-center gap-2.5 sm:gap-3 pt-2 flex-shrink-0">
        <button
          @click="emit('newGame')"
          class="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs sm:text-sm border border-slate-700 transition shadow cursor-pointer"
        >
          {{ t.resetMatch }}
        </button>

        <button
          @click="emit('nextRound')"
          class="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm border border-amber-300 shadow-xl active:scale-95 transition"
        >
          {{ t.nextRound }}
        </button>
      </div>
    </div>
  </div>
</template>
