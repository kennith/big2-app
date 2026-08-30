<script setup lang="ts">
import { computed } from 'vue';
import { SUIT_SYMBOLS } from '../engine/deck';
import type { Card } from '../engine/types';

interface Props {
  card?: Card;
  isBack?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isBack: false,
  isSelected: false,
  isDisabled: false,
  size: 'md',
  rotation: 0,
});

const isRed = computed(() => {
  if (!props.card) return false;
  return props.card.suit === 'D' || props.card.suit === 'H';
});

const suitSymbol = computed(() => {
  if (!props.card) return '';
  return SUIT_SYMBOLS[props.card.suit];
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-10 h-14 text-xs shadow';
    case 'lg':
      return 'w-20 h-28 sm:w-24 sm:h-34 text-base shadow-xl';
    case 'md':
    default:
      return 'w-14 h-20 sm:w-18 sm:h-26 md:w-20 md:h-28 text-sm shadow-md';
  }
});

const roundedClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'rounded-md';
    case 'lg':
      return 'rounded-xl';
    case 'md':
    default:
      return 'rounded-lg';
  }
});
</script>

<template>
  <div
    class="relative select-none transition-all duration-150 cursor-pointer flex-shrink-0"
    :class="[
      sizeClasses,
      roundedClass,
      isSelected
        ? '-translate-y-5 shadow-card-selected ring-2 ring-amber-400'
        : 'hover:-translate-y-1 hover:ring-2 hover:ring-amber-300 hover:shadow-lg',
      isDisabled ? 'opacity-50 cursor-not-allowed filter grayscale-[20%]' : '',
    ]"
    :style="{
      transform: isSelected
        ? `translateY(-20px) rotate(${rotation}deg)`
        : `rotate(${rotation}deg)`,
    }"
  >
    <!-- Card Back -->
    <div
      v-if="isBack || !card"
      class="w-full h-full bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-900 border-2 border-slate-200/40 flex items-center justify-center p-1 shadow-inner overflow-hidden"
      :class="roundedClass"
    >
      <div class="w-full h-full border border-dashed border-indigo-300/30 rounded flex items-center justify-center bg-indigo-950/40">
        <div class="w-6 h-6 rounded-full border border-indigo-400/40 flex items-center justify-center">
          <span class="text-[10px] font-bold text-indigo-200">🂠</span>
        </div>
      </div>
    </div>

    <!-- Card Front -->
    <div
      v-else
      class="w-full h-full bg-gradient-to-b from-white to-gray-50 border border-slate-300 flex flex-col justify-between p-1 sm:p-1.5 overflow-hidden font-mono font-bold leading-tight"
      :class="[roundedClass, isRed ? 'text-red-600' : 'text-slate-900']"
    >
      <!-- Top Left Rank & Suit -->
      <div class="flex flex-col items-center self-start text-left leading-none">
        <span class="text-xs sm:text-sm font-extrabold tracking-tighter">{{ card.rank }}</span>
        <span class="text-xs sm:text-base leading-none -mt-0.5">{{ suitSymbol }}</span>
      </div>

      <!-- Center Big Suit / Rank Watermark -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
        <span class="text-xl sm:text-2xl md:text-3xl filter drop-shadow-sm">{{ suitSymbol }}</span>
      </div>

      <!-- Bottom Right Inverted Rank & Suit -->
      <div class="flex flex-col items-center self-end text-right leading-none rotate-180">
        <span class="text-xs sm:text-sm font-extrabold tracking-tighter">{{ card.rank }}</span>
        <span class="text-xs sm:text-base leading-none -mt-0.5">{{ suitSymbol }}</span>
      </div>
    </div>
  </div>
</template>
