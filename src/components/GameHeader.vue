<script setup lang="ts">
import type { Player } from '../engine/types';
import type { Language, Translations } from '../i18n/translations';

interface Props {
  roundNumber: number;
  players: Player[];
  matchScores: number[];
  soundEnabled: boolean;
  currentLanguage: Language;
  t: Translations;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggleSound'): void;
  (e: 'toggleLanguage'): void;
  (e: 'openRules'): void;
  (e: 'openSettings'): void;
  (e: 'openHistory'): void;
  (e: 'newGame'): void;
}>();
</script>

<template>
  <header class="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-slate-950/80 border-b border-white/10 backdrop-blur-md sticky top-0 z-40">
    <!-- Game Title & Round -->
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="flex items-center gap-1.5 font-black text-base sm:text-xl tracking-wider text-amber-400">
        <span class="text-xl sm:text-2xl">♠️</span>
        <span class="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
          {{ t.gameTitle }}
        </span>
      </div>

      <div class="h-8 inline-flex items-center px-2.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
        <template v-if="currentLanguage === 'zh-TW'">
          {{ t.round }} <span class="text-amber-400 font-bold mx-0.5">{{ roundNumber }}</span> 局
        </template>
        <template v-else>
          {{ t.round }} <span class="text-amber-400 font-bold mx-0.5">{{ roundNumber }}</span>
        </template>
      </div>
    </div>

    <!-- Match Scores Bar (Hidden on ultra-small screens, visible on md+) -->
    <div class="hidden md:flex items-center gap-2 bg-slate-900/90 h-8 px-3 rounded-xl border border-white/5 text-xs">
      <span class="text-slate-400 font-medium">{{ t.scores }}:</span>
      <div v-for="(player, idx) in players" :key="player.id" class="flex items-center gap-1">
        <span class="text-slate-300">{{ player.name }}:</span>
        <span
          class="font-bold font-mono px-1.5 py-0.2 rounded"
          :class="idx === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-200'"
        >
          {{ matchScores[idx] }}
        </span>
      </div>
    </div>

    <!-- Utility Action Buttons (Standardized identical height h-8 sm:h-9) -->
    <div class="flex items-center gap-1.5 sm:gap-2">
      <!-- Language Toggle Button -->
      <button
        @click="emit('toggleLanguage')"
        class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 text-xs font-bold border border-slate-700 transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        title="切換語言 / Switch Language"
      >
        <span class="text-sm leading-none">🌐</span>
        <span>{{ currentLanguage === 'zh-TW' ? '繁中' : 'EN' }}</span>
      </button>

      <!-- Sound Toggle -->
      <button
        @click="emit('toggleSound')"
        class="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition shadow-sm inline-flex items-center justify-center cursor-pointer"
        :title="soundEnabled ? t.muteSound : t.enableSound"
      >
        <span class="text-sm leading-none">{{ soundEnabled ? '🔊' : '🔇' }}</span>
      </button>

      <!-- Rules Button -->
      <button
        @click="emit('openRules')"
        class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        :title="t.rules"
      >
        <span class="text-sm leading-none">📖</span>
        <span class="hidden sm:inline">{{ t.rules }}</span>
      </button>

      <!-- History Button -->
      <button
        @click="emit('openHistory')"
        class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        :title="t.log"
      >
        <span class="text-sm leading-none">📜</span>
        <span class="hidden sm:inline">{{ t.log }}</span>
      </button>

      <!-- Settings Button -->
      <button
        @click="emit('openSettings')"
        class="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition shadow-sm inline-flex items-center justify-center cursor-pointer"
        :title="t.settings"
      >
        <span class="text-sm leading-none">⚙️</span>
      </button>

      <!-- New Game Button -->
      <button
        @click="emit('newGame')"
        class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-red-900/80 hover:bg-red-800 active:scale-95 text-red-100 text-xs font-bold border border-red-700/50 transition shadow-sm inline-flex items-center justify-center cursor-pointer"
        :title="t.reset"
      >
        <span>{{ t.reset }}</span>
      </button>
    </div>
  </header>
</template>
