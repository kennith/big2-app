import confetti from 'canvas-confetti';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getBotMove } from '../engine/ai';
import { findAllCombos, identifyCombo, sortCardsByCombo } from '../engine/combos';
import {
  createDeck,
  dealCards,
  findStartingPlayerIndex,
  shuffleDeck,
  sortCardsByRank,
  sortCardsBySuit,
} from '../engine/deck';
import { calculateRoundScores, validatePlay } from '../engine/evaluator';
import type {
  Card,
  GameHistoryEntry,
  GameSettings,
  GameStatus,
  HandCombo,
  Player,
  RoundResult,
  Trick,
} from '../engine/types';
import { formatComboDisplayName } from '../i18n/formatters';
import { type Language, translations } from '../i18n/translations';
import { soundService } from '../services/sound';
import {
  loadSettings,
  loadStats,
  type PlayerStats,
  recordGameResult,
  saveSettings,
} from '../services/storage';

export function useBigTwo() {
  const status = ref<GameStatus>('ready');
  const roundNumber = ref(1);
  const currentPlayerIndex = ref(0);
  const currentTrick = ref<Trick | null>(null);
  const passCount = ref(0);
  const isFirstTurnOfGame = ref(true);
  const selectedCardIds = ref<Set<string>>(new Set());
  const history = ref<GameHistoryEntry[]>([]);
  const roundResult = ref<RoundResult | null>(null);
  const matchScores = ref<number[]>([0, 0, 0, 0]);
  const isBotThinking = ref(false);
  const botThinkingTimeout = ref<number | null>(null);

  const settings = ref<GameSettings>(loadSettings());
  const stats = ref<PlayerStats>(loadStats());

  // Localization computed
  const currentLanguage = computed<Language>(() => settings.value.language || 'zh-TW');
  const t = computed(() => translations[currentLanguage.value]);

  // Player configurations
  const players = ref<Player[]>([
    {
      id: 'player',
      name: currentLanguage.value === 'zh-TW' ? '你 (玩家)' : 'You',
      avatar: '🧑‍💼',
      isHuman: true,
      hand: [],
      position: 'bottom',
    },
    {
      id: 'bot-1',
      name: currentLanguage.value === 'zh-TW' ? '阿強 (Alex)' : 'Alex',
      avatar: '🤖',
      isHuman: false,
      hand: [],
      position: 'left',
      personality: 'aggressive',
    },
    {
      id: 'bot-2',
      name: currentLanguage.value === 'zh-TW' ? '小美 (Bella)' : 'Bella',
      avatar: '🦊',
      isHuman: false,
      hand: [],
      position: 'top',
      personality: 'balanced',
    },
    {
      id: 'bot-3',
      name: currentLanguage.value === 'zh-TW' ? '阿明 (Charlie)' : 'Charlie',
      avatar: '🐼',
      isHuman: false,
      hand: [],
      position: 'right',
      personality: 'cautious',
    },
  ]);

  // Sync localized player names on language switch
  watch(currentLanguage, (lang) => {
    players.value[0].name = lang === 'zh-TW' ? '你 (玩家)' : 'You';
    players.value[1].name = lang === 'zh-TW' ? '阿強 (Alex)' : 'Alex';
    players.value[2].name = lang === 'zh-TW' ? '小美 (Bella)' : 'Bella';
    players.value[3].name = lang === 'zh-TW' ? '阿明 (Charlie)' : 'Charlie';
  });

  const lastAction = ref<{
    playerIndex: number;
    action: 'play' | 'pass';
    text: string;
    timestamp: number;
  } | null>(null);

  // Sync sound settings
  watch(
    () => settings.value.soundEnabled,
    (val) => soundService.setEnabled(val),
    { immediate: true }
  );

  watch(
    () => settings.value.soundVolume,
    (val) => soundService.setVolume(val),
    { immediate: true }
  );

  watch(
    settings,
    (newSettings) => {
      saveSettings(newSettings);
    },
    { deep: true }
  );

  // Computed properties
  const humanPlayer = computed(() => players.value[0]);
  const currentPlayer = computed(() => players.value[currentPlayerIndex.value]);
  const isHumanTurn = computed(
    () => status.value === 'playing' && currentPlayerIndex.value === 0 && !isBotThinking.value
  );

  const selectedCards = computed<Card[]>(() => {
    return humanPlayer.value.hand.filter((c) => selectedCardIds.value.has(c.id));
  });

  const selectedCombo = computed<HandCombo | null>(() => {
    if (selectedCards.value.length === 0) return null;
    return identifyCombo(selectedCards.value);
  });

  const selectedComboLocalizedName = computed<string>(() => {
    return formatComboDisplayName(selectedCombo.value, currentLanguage.value);
  });

  const validationResult = computed(() => {
    if (!isHumanTurn.value) return { valid: false, reason: t.value.waitingForTurn };
    if (selectedCards.value.length === 0) return { valid: false, reason: t.value.selectCards };
    return validatePlay(selectedCombo.value, currentTrick.value, isFirstTurnOfGame.value);
  });

  const canPass = computed(() => {
    if (!isHumanTurn.value) return false;
    // Cannot pass if leading a free play or if it's the very first play of the game
    return currentTrick.value !== null;
  });

  /**
   * Sort the human player's hand according to current sort mode
   */
  function sortHumanHand() {
    if (settings.value.sortMode === 'suit') {
      players.value[0].hand = sortCardsBySuit(players.value[0].hand);
    } else if (settings.value.sortMode === 'combo') {
      players.value[0].hand = sortCardsByCombo(players.value[0].hand);
    } else {
      players.value[0].hand = sortCardsByRank(players.value[0].hand);
    }
  }

  /**
   * Toggle sort mode (rank -> suit -> combo -> rank)
   */
  function toggleSortMode() {
    if (settings.value.sortMode === 'rank') {
      settings.value.sortMode = 'suit';
    } else if (settings.value.sortMode === 'suit') {
      settings.value.sortMode = 'combo';
    } else {
      settings.value.sortMode = 'rank';
    }
    sortHumanHand();
    soundService.playClick();
  }

  /**
   * Toggle language between English and Traditional Chinese
   */
  function toggleLanguage() {
    settings.value.language = settings.value.language === 'zh-TW' ? 'en' : 'zh-TW';
    soundService.playClick();
  }

  function setLanguage(lang: Language) {
    settings.value.language = lang;
    soundService.playClick();
  }

  /**
   * Start a new match / game from round 1
   */
  function startNewGame() {
    matchScores.value = [0, 0, 0, 0];
    roundNumber.value = 1;
    startNewRound();
  }

  /**
   * Deal cards and start a new round
   */
  function startNewRound() {
    if (botThinkingTimeout.value) {
      clearTimeout(botThinkingTimeout.value);
      botThinkingTimeout.value = null;
    }

    status.value = 'dealing';
    selectedCardIds.value.clear();
    currentTrick.value = null;
    passCount.value = 0;
    history.value = [];
    roundResult.value = null;
    lastAction.value = null;
    isBotThinking.value = false;

    // Create, shuffle and deal cards
    const deck = shuffleDeck(createDeck());
    const hands = dealCards(deck);

    players.value.forEach((player, idx) => {
      player.hand = hands[idx];
    });

    sortHumanHand();

    // Sound effect
    soundService.playDeal();

    // Determine starting player (holder of 3♦)
    const starterIdx = findStartingPlayerIndex(hands);
    currentPlayerIndex.value = starterIdx;
    isFirstTurnOfGame.value = true;

    // Small delay to let deal animation play
    setTimeout(() => {
      status.value = 'playing';

      // Log first starter
      const starterName = players.value[starterIdx].name;
      addHistoryEntry(
        starterIdx,
        starterName,
        'pass',
        undefined,
        `${starterName} ${t.value.holds3DLead}`
      );

      // If starter is a bot, trigger bot turn
      if (!players.value[starterIdx].isHuman) {
        scheduleBotTurn();
      }
    }, 600);
  }

  /**
   * Card selection handling
   */
  function toggleCardSelection(card: Card) {
    if (status.value !== 'playing') return;
    if (selectedCardIds.value.has(card.id)) {
      selectedCardIds.value.delete(card.id);
    } else {
      selectedCardIds.value.add(card.id);
    }
    // Trigger reactivity
    selectedCardIds.value = new Set(selectedCardIds.value);
    soundService.playCardSelect();
  }

  /**
   * Toggle selection of an entire combination group of cards
   */
  function toggleGroupSelection(cards: Card[]) {
    if (status.value !== 'playing') return;
    const allSelected = cards.every((c) => selectedCardIds.value.has(c.id));
    if (allSelected) {
      cards.forEach((c) => selectedCardIds.value.delete(c.id));
    } else {
      cards.forEach((c) => selectedCardIds.value.add(c.id));
    }
    selectedCardIds.value = new Set(selectedCardIds.value);
    soundService.playCardSelect();
  }

  function clearSelection() {
    selectedCardIds.value.clear();
    selectedCardIds.value = new Set();
    soundService.playClick();
  }

  /**
   * Human plays selected cards
   */
  function playCards() {
    if (!validationResult.value.valid || !selectedCombo.value) return;

    const combo = selectedCombo.value;
    const cardsPlayed = combo.cards;
    const localizedName = formatComboDisplayName(combo, currentLanguage.value);

    // Remove cards from hand
    players.value[0].hand = players.value[0].hand.filter(
      (card) => !cardsPlayed.some((played) => played.id === card.id)
    );

    // Update trick
    currentTrick.value = {
      cards: cardsPlayed,
      combo,
      playedBy: 0,
      playerName: players.value[0].name,
      timestamp: Date.now(),
    };

    passCount.value = 0;
    isFirstTurnOfGame.value = false;
    selectedCardIds.value.clear();
    selectedCardIds.value = new Set();

    lastAction.value = {
      playerIndex: 0,
      action: 'play',
      text: `${t.value.playCombo} ${localizedName}`,
      timestamp: Date.now(),
    };

    addHistoryEntry(0, players.value[0].name, 'play', cardsPlayed, localizedName);
    soundService.playCardPlay();

    // Check if player won
    if (players.value[0].hand.length === 0) {
      handleRoundEnd(0);
      return;
    }

    // Advance turn
    advanceTurn();
  }

  /**
   * Human passes turn
   */
  function pass() {
    if (!canPass.value) return;

    passCount.value += 1;
    lastAction.value = {
      playerIndex: 0,
      action: 'pass',
      text: t.value.passed,
      timestamp: Date.now(),
    };

    addHistoryEntry(0, players.value[0].name, 'pass');
    soundService.playPass();

    // Check 3 consecutive passes
    if (passCount.value >= 3) {
      handleTrickCleared();
    } else {
      advanceTurn();
    }
  }

  /**
   * Give player a hint by auto-selecting the best valid combo
   */
  function giveHint() {
    if (!isHumanTurn.value) return;

    const allCombos = findAllCombos(humanPlayer.value.hand);
    const validMoves = allCombos.filter((combo) => {
      const { valid } = validatePlay(combo, currentTrick.value, isFirstTurnOfGame.value);
      return valid;
    });

    if (validMoves.length === 0) {
      if (canPass.value) {
        pass();
      }
      return;
    }

    // Sort to find lowest valid move
    const bestMove = getBotMove(
      humanPlayer.value,
      players.value,
      currentTrick.value,
      isFirstTurnOfGame.value
    );

    const targetCombo = bestMove || validMoves[0];
    selectedCardIds.value = new Set(targetCombo.cards.map((c) => c.id));
    soundService.playCardSelect();
  }

  /**
   * Handle when 3 passes occur and trick resets
   */
  function handleTrickCleared() {
    soundService.playTrickCleared();
    const lastWinnerIndex = currentTrick.value ? currentTrick.value.playedBy : 0;
    const lastWinnerName = players.value[lastWinnerIndex].name;

    currentTrick.value = null;
    passCount.value = 0;
    currentPlayerIndex.value = lastWinnerIndex;

    const message = t.value.trickClearedLead.replace('{name}', lastWinnerName);
    addHistoryEntry(lastWinnerIndex, lastWinnerName, 'pass', undefined, message);

    // If next is a bot, trigger their lead
    if (!players.value[lastWinnerIndex].isHuman) {
      scheduleBotTurn();
    }
  }

  /**
   * Advance turn clockwise
   */
  function advanceTurn() {
    currentPlayerIndex.value = (currentPlayerIndex.value + 1) % 4;

    // Check if next player is bot
    if (!players.value[currentPlayerIndex.value].isHuman) {
      scheduleBotTurn();
    } else {
      // If next is human and auto-pass is enabled & human has no moves:
      if (settings.value.autoPass && currentTrick.value !== null) {
        const allCombos = findAllCombos(humanPlayer.value.hand);
        const hasValidMoves = allCombos.some(
          (c) => validatePlay(c, currentTrick.value, isFirstTurnOfGame.value).valid
        );
        if (!hasValidMoves) {
          setTimeout(() => {
            if (isHumanTurn.value) pass();
          }, 600);
        }
      }
    }
  }

  /**
   * Schedule AI bot action with natural delay
   */
  function scheduleBotTurn() {
    isBotThinking.value = true;
    const delay = Math.max(400, settings.value.gameSpeedMs);

    botThinkingTimeout.value = window.setTimeout(() => {
      if (status.value !== 'playing') return;

      const botIndex = currentPlayerIndex.value;
      const bot = players.value[botIndex];
      const move = getBotMove(bot, players.value, currentTrick.value, isFirstTurnOfGame.value);

      isBotThinking.value = false;

      if (move) {
        // Bot plays cards
        const localizedName = formatComboDisplayName(move, currentLanguage.value);
        bot.hand = bot.hand.filter((c) => !move.cards.some((mc) => mc.id === c.id));
        currentTrick.value = {
          cards: move.cards,
          combo: move,
          playedBy: botIndex,
          playerName: bot.name,
          timestamp: Date.now(),
        };

        passCount.value = 0;
        isFirstTurnOfGame.value = false;

        lastAction.value = {
          playerIndex: botIndex,
          action: 'play',
          text: `${t.value.playCombo} ${localizedName}`,
          timestamp: Date.now(),
        };

        addHistoryEntry(botIndex, bot.name, 'play', move.cards, localizedName);
        soundService.playCardPlay();

        // Check if bot won
        if (bot.hand.length === 0) {
          handleRoundEnd(botIndex);
          return;
        }

        advanceTurn();
      } else {
        // Bot passes
        passCount.value += 1;
        lastAction.value = {
          playerIndex: botIndex,
          action: 'pass',
          text: t.value.passed,
          timestamp: Date.now(),
        };

        addHistoryEntry(botIndex, bot.name, 'pass');
        soundService.playPass();

        if (passCount.value >= 3) {
          handleTrickCleared();
        } else {
          advanceTurn();
        }
      }
    }, delay);
  }

  /**
   * Handle round completion & scoring
   */
  function handleRoundEnd(winnerIndex: number) {
    status.value = 'round_end';
    const result = calculateRoundScores(players.value, winnerIndex, roundNumber.value);
    roundResult.value = result;

    // Update cumulative scores
    result.penalties.forEach((p: { playerIndex: number; pointsLost: number }) => {
      matchScores.value[p.playerIndex] += p.pointsLost;
    });

    const isHumanWinner = winnerIndex === 0;
    const humanLostPoints = result.penalties[0].pointsLost;

    // Update player persistence stats
    stats.value = recordGameResult(isHumanWinner, humanLostPoints);

    if (isHumanWinner) {
      soundService.playWin();
      // Trigger victory confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      soundService.playLose();
    }
  }

  /**
   * Helper to log game history
   */
  function addHistoryEntry(
    playerIndex: number,
    playerName: string,
    action: 'play' | 'pass',
    cards?: Card[],
    comboName?: string
  ) {
    history.value.unshift({
      id: `${Date.now()}-${Math.random()}`,
      round: roundNumber.value,
      playerIndex,
      playerName,
      action,
      cards,
      comboName,
      timestamp: Date.now(),
    });
    // Keep max 50 entries
    if (history.value.length > 50) {
      history.value.pop();
    }
  }

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (status.value === 'playing' || status.value === 'dealing') {
      event.preventDefault();
      event.returnValue = t.value.leaveGameWarning;
      return t.value.leaveGameWarning;
    }
  }

  onMounted(() => {
    startNewRound();
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  return {
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
    selectedCards,
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
    sortHumanHand,
  };
}
