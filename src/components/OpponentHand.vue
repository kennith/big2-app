<script setup lang="ts">
import { computed } from 'vue';
import type { Player } from '../engine/types';
import type { Translations } from '../i18n/translations';
import CardView from './CardView.vue';

interface Props {
  player: Player;
  isActive: boolean;
  isThinking: boolean;
  lastActionText?: string | null;
  matchScore: number;
  t: Translations;
}

const props = defineProps<Props>();

const isLowCards = computed(() => props.player.hand.length <= 3 && props.player.hand.length > 0);

// Visible card back representations (limit display to max 6 visible stacked card-backs for clean, compact UI)
const visibleCardCount = computed(() => {
  return Math.min(props.player.hand.length, 6);
});

const personalityLabel = computed(() => {
  const p = props.player.personality || 'balanced';
  return props.t.personalities[p];
});

const personalityColor = computed(() => {
  switch (props.player.personality) {
    case 'aggressive':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'cautious':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'balanced':
    default:
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-1 transition-all duration-300 relative w-full max-w-[125px] sm:max-w-[145px]">
    <!-- Player Profile Card -->
    <div
      class="flex flex-col items-center p-2 rounded-2xl backdrop-blur-md bg-slate-900/85 border transition-all duration-300 shadow-lg w-full"
      :class="[
        isActive
          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20 scale-105'
          : 'border-white/10 opacity-90',
        isLowCards ? 'border-red-500/60 ring-2 ring-red-500/30' : '',
      ]"
    >
      <div class="relative">
        <div
          class="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-800 border-2 flex items-center justify-center text-2xl sm:text-3xl shadow-inner relative"
          :class="isActive ? 'border-amber-400 animate-pulse' : 'border-slate-600'"
        >
          <span>{{ player.avatar }}</span>
        </div>

        <!-- Remaining Cards Badge -->
        <div
          class="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[11px] font-black shadow-md flex items-center gap-0.5 border"
          :class="[
            isLowCards
              ? 'bg-red-600 text-white border-red-300 animate-bounce'
              : 'bg-emerald-600 text-white border-emerald-300',
          ]"
          title="Cards in hand"
        >
          <span>{{ player.hand.length }}</span>
          <span class="text-[10px] opacity-80">🂠</span>
        </div>
      </div>

      <!-- Player Name & Stats -->
      <div class="mt-1 text-center w-full overflow-hidden">
        <div class="font-bold text-xs sm:text-sm text-slate-100 truncate px-0.5">
          {{ player.name }}
        </div>
        <div class="flex items-center justify-center gap-1 mt-0.5">
          <span
            class="text-[10px] px-1.5 py-0.2 rounded border font-medium tracking-wider truncate max-w-full"
            :class="personalityColor"
          >
            {{ personalityLabel }}
          </span>
        </div>
        <div class="text-[11px] text-slate-400 mt-0.5 font-mono">
          {{ t.totalPts }}: <span class="text-amber-300 font-semibold">{{ matchScore }}</span>
        </div>
      </div>

      <!-- Turn / Thinking / Action Bubble -->
      <div v-if="isActive && isThinking" class="mt-1 flex items-center justify-center gap-1 text-[11px] text-amber-300 font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
        <span>{{ t.thinking }}</span>
      </div>

      <div
        v-else-if="lastActionText"
        class="mt-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 truncate max-w-full text-center"
      >
        {{ lastActionText }}
      </div>
    </div>

    <!-- Opponent's Stacked / Fanned Cards Visual -->
    <div
      v-if="player.hand.length > 0"
      class="flex relative items-center justify-center h-12 sm:h-14 mt-0.5"
    >
      <div
        v-for="index in visibleCardCount"
        :key="index"
        class="transition-all duration-300"
        :style="{
          marginLeft: index > 1 ? '-26px' : '0px',
          transform: `rotate(${(index - (visibleCardCount + 1) / 2) * 3}deg)`,
        }"
      >
        <CardView is-back size="sm" />
      </div>
    </div>
  </div>
</template>
