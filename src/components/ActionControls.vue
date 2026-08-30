<script setup lang="ts">
import { computed } from 'vue';
import type { HandCombo } from '../engine/types';
import type { Translations } from '../i18n/translations';

interface Props {
  isTurn: boolean;
  selectedCombo: HandCombo | null;
  selectedComboLocalizedName: string;
  validationResult: { valid: boolean; reason?: string };
  canPass: boolean;
  selectedCount: number;
  isFirstTurnOfGame: boolean;
  t: Translations;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'pass'): void;
  (e: 'hint'): void;
  (e: 'clear'): void;
}>();

const playButtonText = computed(() => {
  if (!props.isTurn) return props.t.waitingForTurn;
  if (props.selectedCount === 0) return props.t.selectCards;
  if (props.selectedCombo) return `${props.t.playCombo} ${props.selectedComboLocalizedName}`;
  return props.t.invalidCombo;
});
</script>

<template>
  <div class="flex flex-col items-center gap-2 w-full max-w-xl mx-auto px-4">
    <!-- Status message / Validation alert -->
    <div class="min-h-[22px] flex items-center justify-center text-xs">
      <span
        v-if="isTurn && selectedCount > 0 && !validationResult.valid"
        class="text-amber-400 bg-slate-900/90 px-3 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 font-medium animate-pulse"
      >
        ⚠️ {{ validationResult.reason }}
      </span>
      <span
        v-else-if="isTurn && selectedCount > 0 && validationResult.valid"
        class="text-emerald-300 bg-slate-900/90 px-3 py-0.5 rounded-full border border-emerald-500/30 font-medium"
      >
        ✓ {{ t.readyToPlay }} {{ selectedComboLocalizedName }}
      </span>
      <span
        v-else-if="isTurn && isFirstTurnOfGame"
        class="text-amber-300 font-medium bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-600/30"
      >
        {{ t.lead3DAlert }}
      </span>
    </div>

    <!-- Action Buttons Row -->
    <div class="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      <!-- Clear Selection Button -->
      <button
        v-if="selectedCount > 0"
        @click="emit('clear')"
        class="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs sm:text-sm font-semibold border border-slate-700 transition-all shadow"
      >
        {{ t.clear }} ({{ selectedCount }})
      </button>

      <!-- Hint Button -->
      <button
        v-if="isTurn"
        @click="emit('hint')"
        class="px-4 py-2 rounded-xl bg-blue-700/80 hover:bg-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold border border-blue-400/40 transition-all shadow-md flex items-center gap-1.5"
      >
        <span>💡</span>
        <span>{{ t.hint }}</span>
      </button>

      <!-- Pass Button -->
      <button
        v-if="isTurn"
        @click="emit('pass')"
        :disabled="!canPass"
        class="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5"
        :class="[
          canPass
            ? 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-400/40'
            : 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed',
        ]"
      >
        <span>{{ t.pass }}</span>
      </button>

      <!-- Play Cards Primary Button -->
      <button
        @click="emit('play')"
        :disabled="!isTurn || !validationResult.valid"
        class="px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
        :class="[
          isTurn && validationResult.valid
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 border border-emerald-300 ring-2 ring-emerald-400/50 shadow-emerald-900/50'
            : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed',
        ]"
      >
        <span>{{ playButtonText }}</span>
      </button>
    </div>
  </div>
</template>
