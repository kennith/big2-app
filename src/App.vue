<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import ActionControls from './components/ActionControls.vue';
import GameHeader from './components/GameHeader.vue';
import GameLog from './components/GameLog.vue';
import OpponentHand from './components/OpponentHand.vue';
import PlayerHand from './components/PlayerHand.vue';
import RulesModal from './components/RulesModal.vue';
import ScoreModal from './components/ScoreModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import TrickCenter from './components/TrickCenter.vue';
import { useBigTwo } from './composables/useBigTwo';

const {
  status,
  roundNumber,
  players,
  humanPlayer,
  currentPlayer,
  currentPlayerIndex,
  currentTrick,
  passCount,
  isFirstTurnOfGame,
  selectedCardIds,
  selectedCombo,
  selectedComboLocalizedName,
  validationResult,
  canPass,
  isHumanTurn,
  isBotThinking,
  lastAction,
  history,
  roundResult,
  matchScores,
  settings,
  stats,
  currentLanguage,
  t,
  startNewGame,
  startNewRound,
  toggleCardSelection,
  toggleGroupSelection,
  clearSelection,
  playCards,
  pass,
  giveHint,
  toggleSortMode,
  toggleLanguage,
  setLanguage,
} = useBigTwo();

const showRulesModal = ref(false);
const showSettingsModal = ref(false);
const showHistoryModal = ref(false);

function handleToggleSound() {
  settings.value.soundEnabled = !settings.value.soundEnabled;
}

function handleNextRound() {
  roundNumber.value += 1;
  startNewRound();
}

function handleResetGame() {
  if (confirm(t.value.resetConfirm)) {
    startNewGame();
  }
}

function handleKeyDown(event: KeyboardEvent) {
  // Ignore when focused inside form inputs
  const target = event.target as HTMLElement | null;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
    return;
  }

  // Handle modal closing on Escape
  if (showRulesModal.value || showSettingsModal.value || showHistoryModal.value) {
    if (event.key === 'Escape') {
      showRulesModal.value = false;
      showSettingsModal.value = false;
      showHistoryModal.value = false;
    }
    return;
  }

  const key = event.key.toLowerCase();

  // Pass shortcut: 'p'
  if (key === 'p') {
    if (isHumanTurn.value && canPass.value) {
      event.preventDefault();
      pass();
    }
    return;
  }

  // Play shortcut: 'Enter' or ' ' (Space)
  if (event.key === 'Enter' || event.key === ' ') {
    if (isHumanTurn.value && validationResult.value.valid) {
      event.preventDefault();
      playCards();
    }
    return;
  }

  // Hint shortcut: 'h'
  if (key === 'h') {
    if (isHumanTurn.value) {
      event.preventDefault();
      giveHint();
    }
    return;
  }

  // Clear selection: 'c' or 'Escape'
  if (key === 'c' || event.key === 'Escape') {
    if (selectedCardIds.value.size > 0) {
      event.preventDefault();
      clearSelection();
    }
    return;
  }

  // Sort toggle shortcut: 's'
  if (key === 's') {
    event.preventDefault();
    toggleSortMode();
    return;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="h-screen h-[100dvh] max-h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans overflow-hidden">
    <!-- Game Header Navigation -->
    <GameHeader
      :round-number="roundNumber"
      :players="players"
      :match-scores="matchScores"
      :sound-enabled="settings.soundEnabled"
      :current-language="currentLanguage"
      :t="t"
      @toggle-sound="handleToggleSound"
      @toggle-language="toggleLanguage"
      @open-rules="showRulesModal = true"
      @open-settings="showSettingsModal = true"
      @open-history="showHistoryModal = true"
      @new-game="handleResetGame"
    />

    <!-- Main Poker Table Arena -->
    <main class="flex-1 flex flex-col justify-between p-1 sm:p-4 max-w-7xl w-full mx-auto relative overflow-hidden min-h-0">
      <!-- Subtle Clean Arena Backdrop -->
      <div class="absolute inset-1 sm:inset-4 rounded-3xl bg-slate-900/25 border border-slate-800/50 pointer-events-none -z-0 shadow-inner"></div>

      <!-- Top Row: 3 Computer Opponents (Alex, Bella, Charlie) in a single row -->
      <div class="relative z-10 flex items-start justify-center gap-1.5 sm:gap-4 md:gap-8 pt-1 sm:pt-4 px-1 w-full max-w-4xl mx-auto flex-shrink-0">
        <!-- Alex / 阿強 -->
        <OpponentHand
          :player="players[1]"
          :is-active="currentPlayerIndex === 1 && status === 'playing'"
          :is-thinking="currentPlayerIndex === 1 && isBotThinking"
          :last-action-text="lastAction?.playerIndex === 1 ? lastAction.text : null"
          :match-score="matchScores[1]"
          :t="t"
        />

        <!-- Bella / 小美 -->
        <OpponentHand
          :player="players[2]"
          :is-active="currentPlayerIndex === 2 && status === 'playing'"
          :is-thinking="currentPlayerIndex === 2 && isBotThinking"
          :last-action-text="lastAction?.playerIndex === 2 ? lastAction.text : null"
          :match-score="matchScores[2]"
          :t="t"
        />

        <!-- Charlie / 阿明 -->
        <OpponentHand
          :player="players[3]"
          :is-active="currentPlayerIndex === 3 && status === 'playing'"
          :is-thinking="currentPlayerIndex === 3 && isBotThinking"
          :last-action-text="lastAction?.playerIndex === 3 ? lastAction.text : null"
          :match-score="matchScores[3]"
          :t="t"
        />
      </div>

      <!-- Center Row: Trick Center Field -->
      <div class="relative z-10 flex items-center justify-center my-auto py-1 sm:py-4 px-2 w-full min-h-0">
        <TrickCenter
          :current-trick="currentTrick"
          :pass-count="passCount"
          :is-first-turn-of-game="isFirstTurnOfGame"
          :current-player-name="currentPlayer.name"
          :is-human-turn="isHumanTurn"
          :current-language="currentLanguage"
          :t="t"
        />
      </div>

      <!-- Bottom Section: Action Bar & Human Hand (Fits 1/3 of screen height on mobile) -->
      <div class="relative z-10 flex flex-col items-center justify-between sm:justify-start gap-2 sm:gap-4 md:gap-5 h-[33.333dvh] sm:h-auto pb-1 sm:pb-3 w-full flex-shrink-0 min-h-0">
        <!-- Human Action Controls Bar -->
        <ActionControls
          :is-turn="isHumanTurn"
          :selected-combo="selectedCombo"
          :selected-combo-localized-name="selectedComboLocalizedName"
          :validation-result="validationResult"
          :can-pass="canPass"
          :selected-count="selectedCardIds.size"
          :is-first-turn-of-game="isFirstTurnOfGame"
          :t="t"
          @play="playCards"
          @pass="pass"
          @hint="giveHint"
          @clear="clearSelection"
        />

        <!-- Human Hand -->
        <PlayerHand
          :hand="humanPlayer.hand"
          :selected-card-ids="selectedCardIds"
          :is-turn="isHumanTurn"
          :sort-mode="settings.sortMode"
          :current-language="currentLanguage"
          :t="t"
          @toggle-card="toggleCardSelection"
          @toggle-group="toggleGroupSelection"
          @toggle-sort="toggleSortMode"
        />
      </div>
    </main>

    <!-- Modals -->
    <ScoreModal
      v-if="status === 'round_end' && roundResult"
      :round-result="roundResult"
      :players="players"
      :match-scores="matchScores"
      :t="t"
      @next-round="handleNextRound"
      @new-game="startNewGame"
    />

    <RulesModal
      v-if="showRulesModal"
      :t="t"
      @close="showRulesModal = false"
    />

    <SettingsModal
      v-if="showSettingsModal"
      :settings="settings"
      :stats="stats"
      :t="t"
      @set-language="setLanguage"
      @close="showSettingsModal = false"
    />

    <GameLog
      v-if="showHistoryModal"
      :history="history"
      :t="t"
      @close="showHistoryModal = false"
    />
  </div>
</template>
