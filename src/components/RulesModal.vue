<script setup lang="ts">
import type { Translations } from '../i18n/translations';

interface Props {
  t: Translations;
}

defineProps<Props>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-7 shadow-2xl flex flex-col max-h-[92dvh] text-slate-200 min-h-0">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-800 flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-xl sm:text-2xl">📖</span>
          <h2 class="text-base sm:text-xl font-bold text-amber-400">{{ t.rulesContent.title }}</h2>
        </div>
        <button
          @click="$emit('close')"
          class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center text-xs sm:text-sm font-bold border border-slate-700 transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- Modal Content (Scrollable) -->
      <div class="flex-1 overflow-y-auto min-h-0 py-3 sm:py-4 space-y-4 sm:space-y-5 text-xs sm:text-sm leading-relaxed pr-1">
        <!-- 1. Card Ranks & Suits -->
        <section class="space-y-2">
          <h3 class="font-bold text-slate-100 text-sm sm:text-base text-amber-300 flex items-center gap-1.5">
            <span>{{ t.rulesContent.section1Title }}</span>
          </h3>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <p>
              <strong>{{ t.rulesContent.rankOrder }}</strong><br />
              <code class="text-amber-300 font-mono">3 &lt; 4 &lt; 5 &lt; 6 &lt; 7 &lt; 8 &lt; 9 &lt; 10 &lt; J &lt; Q &lt; K &lt; A &lt; 2</code>
            </p>
            <p>
              <strong>{{ t.rulesContent.suitOrder }}</strong><br />
              <span class="text-red-400 font-bold">♦ {{ t.suits.D }}</span> &lt;
              <span class="text-emerald-400 font-bold">♣ {{ t.suits.C }}</span> &lt;
              <span class="text-red-500 font-bold">♥ {{ t.suits.H }}</span> &lt;
              <span class="text-slate-100 font-bold">♠ {{ t.suits.S }}</span>
            </p>
            <p class="text-slate-400 text-xs">
              {{ t.rulesContent.lowestHighestCard }}
            </p>
          </div>
        </section>

        <!-- 2. Valid Combinations -->
        <section class="space-y-2">
          <h3 class="font-bold text-slate-100 text-sm sm:text-base text-amber-300 flex items-center gap-1.5">
            <span>{{ t.rulesContent.section2Title }}</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div class="font-bold text-emerald-400 mb-1">{{ t.combos.single }}</div>
              <p class="text-slate-300 text-xs">{{ t.rulesContent.singleDesc }}</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div class="font-bold text-emerald-400 mb-1">{{ t.combos.pair }}</div>
              <p class="text-slate-300 text-xs">{{ t.rulesContent.pairDesc }}</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div class="font-bold text-emerald-400 mb-1">{{ t.combos.triple }}</div>
              <p class="text-slate-300 text-xs">{{ t.rulesContent.tripleDesc }}</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div class="font-bold text-emerald-400 mb-1">5-Card Hands</div>
              <p class="text-slate-300 text-xs">{{ t.rulesContent.fiveCardDesc }}</p>
            </div>
          </div>
        </section>

        <!-- 3. 5-Card Hierarchy -->
        <section class="space-y-2">
          <h3 class="font-bold text-slate-100 text-sm sm:text-base text-amber-300 flex items-center gap-1.5">
            <span>{{ t.rulesContent.section3Title }}</span>
          </h3>
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <span>{{ t.rulesContent.straightDesc }}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <span>{{ t.rulesContent.flushDesc }}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <span>{{ t.rulesContent.fullHouseDesc }}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <span>{{ t.rulesContent.quadDesc }}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
              <span>{{ t.rulesContent.straightFlushDesc }}</span>
            </div>
          </div>
        </section>

        <!-- 4. First Turn & Passing -->
        <section class="space-y-2">
          <h3 class="font-bold text-slate-100 text-sm sm:text-base text-amber-300 flex items-center gap-1.5">
            <span>{{ t.rulesContent.section4Title }}</span>
          </h3>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5 text-xs text-slate-300">
            <p>{{ t.rulesContent.firstTurnDesc }}</p>
            <p>{{ t.rulesContent.matchingDesc }}</p>
            <p>{{ t.rulesContent.trickResetDesc }}</p>
          </div>
        </section>

        <!-- 5. Scoring & Penalties -->
        <section class="space-y-2">
          <h3 class="font-bold text-slate-100 text-sm sm:text-base text-amber-300 flex items-center gap-1.5">
            <span>{{ t.rulesContent.section5Title }}</span>
          </h3>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1 text-xs text-slate-300">
            <p>{{ t.rulesContent.scoringDesc1 }}</p>
            <p>{{ t.rulesContent.scoringDesc2 }}</p>
            <p>{{ t.rulesContent.scoringDesc3 }}</p>
            <p>{{ t.rulesContent.scoringDesc4 }}</p>
          </div>
        </section>
      </div>

      <!-- Modal Footer (Fixed) -->
      <div class="pt-2 sm:pt-3 border-t border-slate-800 flex justify-end flex-shrink-0">
        <button
          @click="$emit('close')"
          class="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg cursor-pointer"
        >
          {{ t.gotIt }}
        </button>
      </div>
    </div>
  </div>
</template>
