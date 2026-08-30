<script setup lang="ts">
import type { GameHistoryEntry } from '../engine/types';
import type { Translations } from '../i18n/translations';
import CardView from './CardView.vue';

interface Props {
  history: GameHistoryEntry[];
  t: Translations;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="w-full max-w-md h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col text-slate-200">
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
        <div class="flex items-center gap-2">
          <span class="text-xl">📜</span>
          <h2 class="text-base font-bold text-amber-400">{{ t.actionLogTitle }}</h2>
        </div>
        <button
          @click="emit('close')"
          class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-700 transition"
        >
          ✕
        </button>
      </div>

      <!-- Log Entries -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="history.length === 0" class="text-center py-8 text-slate-500 text-xs">
          {{ t.noPlaysYet }}
        </div>

        <div
          v-for="entry in history"
          :key="entry.id"
          class="p-3 rounded-2xl border text-xs transition"
          :class="[
            entry.action === 'play'
              ? 'bg-slate-800/80 border-slate-700'
              : 'bg-slate-950/40 border-slate-800/80 opacity-75',
            entry.playerIndex === 0 ? 'border-emerald-500/40' : '',
          ]"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-bold text-sm" :class="entry.playerIndex === 0 ? 'text-emerald-400' : 'text-slate-200'">
              {{ entry.playerName }}
            </span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="entry.action === 'play' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'"
            >
              {{ entry.action === 'play' ? t.playCombo : t.passed }}
            </span>
          </div>

          <div v-if="entry.comboName" class="text-amber-300 font-medium text-xs mb-2">
            {{ entry.comboName }}
          </div>

          <!-- Card mini pills if cards were played -->
          <div v-if="entry.cards && entry.cards.length > 0" class="flex flex-wrap gap-1 items-center mt-1">
            <div v-for="card in entry.cards" :key="card.id" class="transform scale-75 origin-top-left -mr-3 -mb-4">
              <CardView :card="card" size="sm" :is-interactive="false" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
