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

      <div class="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
        <template v-if="currentLanguage === 'zh-TW'">
          {{ t.round }} <span class="text-amber-400 font-bold">{{ roundNumber }}</span> 局
        </template>
        <template v-else>
          {{ t.round }} <span class="text-amber-400 font-bold">{{ roundNumber }}</span>
        </template>
      </div>
    </div>

    <!-- Match Scores Bar (Hidden on ultra-small screens, visible on md+) -->
    <div class="hidden md:flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-white/5 text-xs">
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

    <!-- Utility Action Buttons -->
    <div class="flex items-center gap-1.5 sm:gap-2">
      <!-- Language Toggle Button -->
      <button
        @click="emit('toggleLanguage')"
        class="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 text-xs font-bold border border-slate-700 transition flex items-center gap-1 shadow"
        title="切換語言 / Switch Language"
      >
        <span>🌐</span>
        <span>{{ currentLanguage === 'zh-TW' ? '繁中' : 'EN' }}</span>
      </button>

      <!-- Sound Toggle -->
      <button
        @click="emit('toggleSound')"
        class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition shadow"
        :title="soundEnabled ? t.muteSound : t.enableSound"
      >
        <span class="text-sm">{{ soundEnabled ? '🔊' : '🔇' }}</span>
      </button>

      <!-- Rules Button -->
      <button
        @click="emit('openRules')"
        class="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1 shadow"
        :title="t.rules"
      >
        <span>📖</span>
        <span class="hidden sm:inline">{{ t.rules }}</span>
      </button>

      <!-- History Button -->
      <button
        @click="emit('openHistory')"
        class="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1 shadow"
        :title="t.log"
      >
        <span>📜</span>
        <span class="hidden sm:inline">{{ t.log }}</span>
      </button>

      <!-- Settings Button -->
      <button
        @click="emit('openSettings')"
        class="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition shadow"
        :title="t.settings"
      >
        <span class="text-sm">⚙️</span>
      </button>

      <!-- New Game Button -->
      <button
        @click="emit('newGame')"
        class="px-3 py-1.5 rounded-xl bg-red-900/80 hover:bg-red-800 active:scale-95 text-red-100 text-xs font-bold border border-red-700/50 transition shadow"
        :title="t.reset"
      >
        <span>{{ t.reset }}</span>
      </button>
    </div>
  </header>
</template>
