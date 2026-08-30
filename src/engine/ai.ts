import { containsThreeOfDiamonds } from './deck';
import { findAllCombos } from './combos';
import { canBeatCombo, validatePlay } from './evaluator';
import type { HandCombo, Player, Trick } from './types';

/**
 * Evaluates candidate moves and selects the best move for a computer player.
 * Returns HandCombo to play, or null to pass.
 */
export function getBotMove(
  bot: Player,
  players: Player[],
  currentTrick: Trick | null,
  isFirstTurnOfGame: boolean
): HandCombo | null {
  const allCombos = findAllCombos(bot.hand);

  // Filter combos that are legal plays
  const validCombos = allCombos.filter((combo) => {
    const { valid } = validatePlay(combo, currentTrick, isFirstTurnOfGame);
    return valid;
  });

  if (validCombos.length === 0) {
    return null; // Must pass
  }

  // Check if any opponent is in danger (low cards: <= 3 cards left)
  const opponents = players.filter((p) => p.id !== bot.id);
  const minOpponentCards = Math.min(...opponents.map((p) => p.hand.length));
  const isDangerZone = minOpponentCards <= 3;
  const personality = bot.personality || 'balanced';

  // Case 1: Free Play / Leading a trick
  if (!currentTrick) {
    return selectLeadMove(validCombos, bot, isFirstTurnOfGame, isDangerZone, personality);
  }

  // Case 2: Responding to an active trick
  return selectResponseMessage(validCombos, currentTrick, bot, isDangerZone, personality);
}

/**
 * Choose what to lead when having free play
 */
function selectLeadMove(
  validCombos: HandCombo[],
  bot: Player,
  isFirstTurnOfGame: boolean,
  isDangerZone: boolean,
  personality: string
): HandCombo {
  // If first turn, we MUST play a combo containing 3♦
  if (isFirstTurnOfGame) {
    const validWith3D = validCombos.filter((c) => containsThreeOfDiamonds(c.cards));
    if (validWith3D.length > 0) {
      // Prioritize 5-card hands first, then triples, pairs, then single
      const fiveCard = validWith3D.filter((c) => c.cards.length === 5);
      if (fiveCard.length > 0) return getLowestCombo(fiveCard);

      const triples = validWith3D.filter((c) => c.type === 'TRIPLE');
      if (triples.length > 0) return getLowestCombo(triples);

      const pairs = validWith3D.filter((c) => c.type === 'PAIR');
      if (pairs.length > 0) return getLowestCombo(pairs);

      return validWith3D[0];
    }
  }

  // If bot can finish in 1 move, do it!
  const finishMove = validCombos.find((c) => c.cards.length === bot.hand.length);
  if (finishMove) {
    return finishMove;
  }

  // In danger zone (opponent has <= 3 cards):
  // Avoid leading low singles; prefer pairs, triples, or 5-card hands
  if (isDangerZone) {
    const multiCardCombos = validCombos.filter(
      (c) => c.cards.length >= 2 && !c.cards.some((card) => card.rank === '2')
    );
    if (multiCardCombos.length > 0) {
      return getLowestCombo(multiCardCombos);
    }
  }

  // Standard lead: prefer 5-card hands (Full House, Flush, Straight), then Triples, Pairs, Singles
  // Filter out standalone deuces unless forced
  const nonDeuceCombos = validCombos.filter((c) => !c.cards.every((card) => card.rank === '2'));
  const candidatePool = nonDeuceCombos.length > 0 ? nonDeuceCombos : validCombos;

  const fiveCards = candidatePool.filter((c) => c.cards.length === 5);
  if (fiveCards.length > 0 && personality !== 'cautious') {
    return getLowestCombo(fiveCards);
  }

  const triples = candidatePool.filter((c) => c.type === 'TRIPLE');
  if (triples.length > 0) {
    return getLowestCombo(triples);
  }

  const pairs = candidatePool.filter((c) => c.type === 'PAIR');
  if (pairs.length > 0) {
    return getLowestCombo(pairs);
  }

  // Fallback to lowest single
  const singles = candidatePool.filter((c) => c.type === 'SINGLE');
  return getLowestCombo(singles.length > 0 ? singles : validCombos);
}

/**
 * Choose response to an existing trick
 */
function selectResponseMessage(
  validCombos: HandCombo[],
  currentTrick: Trick,
  bot: Player,
  isDangerZone: boolean,
  personality: string
): HandCombo | null {
  // Sort candidate moves from lowest to highest
  const sorted = [...validCombos].sort((a, b) => {
    if (canBeatCombo(b, a)) return -1;
    if (canBeatCombo(a, b)) return 1;
    return 0;
  });

  const lowestValid = sorted[0];

  // If the lowest winning move uses a 2:
  const usesDeuce = lowestValid.cards.some((c) => c.rank === '2');

  if (usesDeuce) {
    // If an opponent is about to win, play the 2 to block them!
    if (isDangerZone) {
      return lowestValid;
    }

    // If bot has <= 3 cards, play the 2 to take control
    if (bot.hand.length <= 4) {
      return lowestValid;
    }

    // In aggressive mode, 60% chance to play 2
    if (personality === 'aggressive' && Math.random() < 0.6) {
      return lowestValid;
    }

    // In cautious mode, conserve the 2 unless trick is already high (e.g. Ace)
    if (personality === 'cautious') {
      if (currentTrick.combo.highestCard.rank === 'A') {
        return lowestValid;
      }
      return null; // Pass to conserve 2
    }

    // In balanced mode, play if trick is high (K or A)
    if (['K', 'A'].includes(currentTrick.combo.highestCard.rank)) {
      return lowestValid;
    }

    // Otherwise pass
    return null;
  }

  // Standard play: play lowest winning combo
  return lowestValid;
}

function getLowestCombo(combos: HandCombo[]): HandCombo {
  return combos.reduce((lowest, curr) => {
    return canBeatCombo(lowest, curr) ? curr : lowest;
  }, combos[0]);
}
