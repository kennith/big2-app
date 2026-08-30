<script setup lang="ts">
import type { GameSettings } from '../engine/types';
import type { Language, Translations } from '../i18n/translations';
import type { PlayerStats } from '../services/storage';

interface Props {
  settings: GameSettings;
  stats: PlayerStats;
  t: Translations;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'setLanguage', lang: Language): void;
}>();
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <!-- Max height container locked to viewport with inner scrolling for iPhone SE compatibility -->
    <div class="w-full max-w-md max-h-[92dvh] bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4 text-slate-200 min-h-0">
      <!-- Modal Header (Fixed) -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-800 flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          <h2 class="text-base sm:text-lg font-bold text-amber-400">{{ t.settings }}</h2>
        </div>
        <button
          @click="$emit('close')"
          class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-700 transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Settings List (Scrollable) -->
      <div class="flex-1 overflow-y-auto min-h-0 space-y-3 sm:space-y-4 pr-1 text-xs sm:text-sm">
        <!-- Language Switcher Option -->
        <div class="p-2.5 sm:p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
          <div class="font-semibold text-slate-100 flex items-center gap-1.5">
            <span>🌐</span>
            <span>{{ t.language }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="emit('setLanguage', 'zh-TW')"
              class="py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              :class="
                settings.language === 'zh-TW'
                  ? 'bg-amber-500 text-slate-950 border-amber-300'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              "
            >
              <span>🇹🇼 / 🇭🇰</span>
              <span>繁體中文</span>
            </button>
            <button
              @click="emit('setLanguage', 'en')"
              class="py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              :class="
                settings.language === 'en'
                  ? 'bg-amber-500 text-slate-950 border-amber-300'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              "
            >
              <span>🇺🇸 / 🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>

        <!-- Sound Toggle -->
        <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div>
            <div class="font-semibold text-slate-100">{{ t.soundEffects }}</div>
            <div class="text-slate-400 text-xs">{{ t.soundEffectsDesc }}</div>
          </div>
          <button
            @click="settings.soundEnabled = !settings.soundEnabled"
            class="w-12 h-6 rounded-full transition-colors relative border border-white/10 cursor-pointer"
            :class="settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'"
          >
            <div
              class="w-4 h-4 rounded-full bg-white transition-transform transform absolute top-0.5"
              :class="settings.soundEnabled ? 'right-1' : 'left-1'"
            ></div>
          </button>
        </div>

        <!-- Volume Slider -->
        <div v-if="settings.soundEnabled" class="p-2.5 sm:p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-slate-100">{{ t.volume }}</span>
            <span class="font-mono text-amber-400">{{ Math.round(settings.soundVolume * 100) }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            v-model.number="settings.soundVolume"
            class="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        <!-- Bot Turn Speed -->
        <div class="p-2.5 sm:p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
          <div class="font-semibold text-slate-100">{{ t.botSpeed }}</div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in [
                { label: t.fast, ms: 400 },
                { label: t.normal, ms: 750 },
                { label: t.relaxed, ms: 1200 },
              ]"
              :key="opt.ms"
              @click="settings.gameSpeedMs = opt.ms"
              class="py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer"
              :class="
                settings.gameSpeedMs === opt.ms
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              "
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Auto Pass -->
        <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
          <div>
            <div class="font-semibold text-slate-100">{{ t.autoPass }}</div>
            <div class="text-slate-400 text-xs">{{ t.autoPassDesc }}</div>
          </div>
          <button
            @click="settings.autoPass = !settings.autoPass"
            class="w-12 h-6 rounded-full transition-colors relative border border-white/10 cursor-pointer"
            :class="settings.autoPass ? 'bg-emerald-500' : 'bg-slate-700'"
          >
            <div
              class="w-4 h-4 rounded-full bg-white transition-transform transform absolute top-0.5"
              :class="settings.autoPass ? 'right-1' : 'left-1'"
            ></div>
          </button>
        </div>

        <!-- Career Statistics Summary -->
        <div class="p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div class="font-bold text-amber-300 text-xs tracking-wider uppercase">{{ t.careerStats }}</div>
          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <div class="text-slate-400">{{ t.roundsPlayed }}</div>
              <div class="text-base font-bold text-white">{{ stats.gamesPlayed }}</div>
            </div>
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <div class="text-slate-400">{{ t.roundsWon }}</div>
              <div class="text-base font-bold text-emerald-400">
                {{ stats.gamesWon }}
                <span class="text-xs text-slate-400 font-normal">
                  ({{ stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0 }}%)
                </span>
              </div>
            </div>
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <div class="text-slate-400">{{ t.winStreak }}</div>
              <div class="text-base font-bold text-amber-300">{{ stats.currentWinStreak }} ({{ t.best }}: {{ stats.maxWinStreak }})</div>
            </div>
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <div class="text-slate-400">{{ t.totalPenaltyPts }}</div>
              <div class="text-base font-bold text-red-300">{{ stats.totalPointsLost }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close Button (Fixed) -->
      <div class="pt-2 border-t border-slate-800 flex justify-end flex-shrink-0">
        <button
          @click="$emit('close')"
          class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
        >
          {{ t.close }}
        </button>
      </div>
    </div>
  </div>
</template>
