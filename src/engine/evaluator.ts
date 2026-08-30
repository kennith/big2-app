import { compareCards, containsThreeOfDiamonds, getSuitWeight } from './deck';
import { FIVE_CARD_TIERS } from './combos';
import type { HandCombo, Player, RoundResult, Trick } from './types';

/**
 * Determines whether candidateCombo can beat currentCombo.
 * Returns true if candidate beats current, false otherwise.
 */
export function canBeatCombo(candidate: HandCombo, current: HandCombo): boolean {
  const candCardsCount = candidate.cards.length;
  const currCardsCount = current.cards.length;

  // Single (1 card)
  if (currCardsCount === 1) {
    if (candCardsCount !== 1) return false;
    return compareCards(candidate.highestCard, current.highestCard) > 0;
  }

  // Pair (2 cards)
  if (currCardsCount === 2) {
    if (candCardsCount !== 2) return false;
    if (candidate.rankValue !== current.rankValue) {
      return candidate.rankValue > current.rankValue;
    }
    return getSuitWeight(candidate.highestCard.suit) > getSuitWeight(current.highestCard.suit);
  }

  // Triple (3 cards)
  if (currCardsCount === 3) {
    if (candCardsCount !== 3) return false;
    return candidate.rankValue > current.rankValue;
  }

  // 5-Card Combinations
  if (currCardsCount === 5) {
    if (candCardsCount !== 5) return false;

    const candTier = FIVE_CARD_TIERS[candidate.type];
    const currTier = FIVE_CARD_TIERS[current.type];

    if (candTier > currTier) return true;
    if (candTier < currTier) return false;

    // Tiers are equal:
    switch (candidate.type) {
      case 'STRAIGHT': {
        if (candidate.rankValue !== current.rankValue) {
          return candidate.rankValue > current.rankValue;
        }
        return getSuitWeight(candidate.highestCard.suit) > getSuitWeight(current.highestCard.suit);
      }

      case 'FLUSH': {
        const candSuitWeight = getSuitWeight(candidate.highestCard.suit);
        const currSuitWeight = getSuitWeight(current.highestCard.suit);
        if (candSuitWeight !== currSuitWeight) {
          return candSuitWeight > currSuitWeight;
        }
        // Same suit: compare highest card
        return compareCards(candidate.highestCard, current.highestCard) > 0;
      }

      case 'FULL_HOUSE': {
        return candidate.rankValue > current.rankValue;
      }

      case 'QUAD': {
        return candidate.rankValue > current.rankValue;
      }

      case 'STRAIGHT_FLUSH': {
        if (candidate.rankValue !== current.rankValue) {
          return candidate.rankValue > current.rankValue;
        }
        return getSuitWeight(candidate.highestCard.suit) > getSuitWeight(current.highestCard.suit);
      }

      default:
        return false;
    }
  }

  return false;
}

/**
 * Validates whether a candidate play is allowed in the current game state.
 */
export function validatePlay(
  combo: HandCombo | null,
  currentTrick: Trick | null,
  isFirstTurnOfGame: boolean
): { valid: boolean; reason?: string } {
  if (!combo) {
    return { valid: false, reason: 'Invalid combination' };
  }

  // First turn of the round requires playing 3♦
  if (isFirstTurnOfGame && !containsThreeOfDiamonds(combo.cards)) {
    return { valid: false, reason: 'First play of the game must include 3 of Diamonds (3♦)' };
  }

  // Free play (lead)
  if (!currentTrick) {
    return { valid: true };
  }

  // Responding to current trick
  if (combo.cards.length !== currentTrick.cards.length) {
    return {
      valid: false,
      reason: `Must play ${currentTrick.cards.length} cards to match the current trick`,
    };
  }

  if (!canBeatCombo(combo, currentTrick.combo)) {
    return { valid: false, reason: 'Play does not beat the current hand' };
  }

  return { valid: true };
}

/**
 * Calculates end of round score and penalty points
 */
export function calculateRoundScores(
  players: Player[],
  winnerIndex: number,
  roundNumber: number
): RoundResult {
  const winner = players[winnerIndex];
  const penalties = players.map((player, idx) => {
    if (idx === winnerIndex) {
      return {
        playerIndex: idx,
        playerName: player.name,
        cardsLeft: 0,
        multiplier: 1,
        pointsLost: 0,
        deucesLeft: 0,
      };
    }

    const cardsLeft = player.hand.length;
    let multiplier = 1;
    if (cardsLeft >= 13) {
      multiplier = 3; // Triple penalty for 13 unplayed cards
    } else if (cardsLeft >= 10) {
      multiplier = 2; // Double penalty for 10-12 cards
    }

    const deucesLeft = player.hand.filter((c) => c.rank === '2').length;
    const pointsLost = cardsLeft * multiplier;

    return {
      playerIndex: idx,
      playerName: player.name,
      cardsLeft,
      multiplier,
      pointsLost,
      deucesLeft,
    };
  });

  return {
    round: roundNumber,
    winnerIndex,
    winnerName: winner.name,
    penalties,
  };
}
