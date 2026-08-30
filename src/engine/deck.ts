import type { Card, Rank, Suit } from './types';

export const SUITS: Suit[] = ['D', 'C', 'H', 'S'];
export const RANKS: Rank[] = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];

export const SUIT_WEIGHTS: Record<Suit, number> = {
  D: 0, // Diamonds (Lowest)
  C: 1, // Clubs
  H: 2, // Hearts
  S: 3, // Spades (Highest)
};

export const RANK_WEIGHTS: Record<Rank, number> = {
  '3': 0,
  '4': 1,
  '5': 2,
  '6': 3,
  '7': 4,
  '8': 5,
  '9': 6,
  '10': 7,
  'J': 8,
  'Q': 9,
  'K': 10,
  'A': 11,
  '2': 12,
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  D: '♦',
  C: '♣',
  H: '♥',
  S: '♠',
};

export const SUIT_NAMES: Record<Suit, string> = {
  D: 'Diamond',
  C: 'Club',
  H: 'Heart',
  S: 'Spade',
};

export const RANK_LABELS: Record<Rank, string> = {
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  'J': 'J',
  'Q': 'Q',
  'K': 'K',
  'A': 'A',
  '2': '2',
};

export function getRankWeight(rank: Rank): number {
  return RANK_WEIGHTS[rank];
}

export function getSuitWeight(suit: Suit): number {
  return SUIT_WEIGHTS[suit];
}

/**
 * Returns a unique numeric value for a card from 0 (3♦) to 51 (2♠)
 */
export function getCardValue(card: Card): number {
  return getRankWeight(card.rank) * 4 + getSuitWeight(card.suit);
}

/**
 * Compares two single cards according to Big 2 rules
 */
export function compareCards(a: Card, b: Card): number {
  return getCardValue(a) - getCardValue(b);
}

/**
 * Creates a standard 52-card deck
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push({
        id: `${rank}-${suit}`,
        rank,
        suit,
      });
    }
  }
  return deck;
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sorts cards by Big 2 rank and suit (Ascending: 3♦ -> 2♠)
 */
export function sortCardsByRank(cards: Card[]): Card[] {
  return [...cards].sort(compareCards);
}

/**
 * Sorts cards grouped by Suit, then by Rank inside each suit
 */
export function sortCardsBySuit(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const suitDiff = getSuitWeight(a.suit) - getSuitWeight(b.suit);
    if (suitDiff !== 0) return suitDiff;
    return getRankWeight(a.rank) - getRankWeight(b.rank);
  });
}

/**
 * Deals 52 cards into 4 hands of 13 cards each, sorted by default
 */
export function dealCards(shuffledDeck: Card[]): [Card[], Card[], Card[], Card[]] {
  const hands: [Card[], Card[], Card[], Card[]] = [[], [], [], []];
  for (let i = 0; i < 52; i++) {
    hands[i % 4].push(shuffledDeck[i]);
  }
  return [
    sortCardsByRank(hands[0]),
    sortCardsByRank(hands[1]),
    sortCardsByRank(hands[2]),
    sortCardsByRank(hands[3]),
  ];
}

/**
 * Identifies which player index (0..3) holds the 3 of Diamonds (3♦)
 */
export function findStartingPlayerIndex(hands: Card[][]): number {
  for (let i = 0; i < hands.length; i++) {
    if (hands[i].some((c) => c.rank === '3' && c.suit === 'D')) {
      return i;
    }
  }
  return 0;
}

/**
 * Check if a set of cards contains 3♦
 */
export function containsThreeOfDiamonds(cards: Card[]): boolean {
  return cards.some((c) => c.rank === '3' && c.suit === 'D');
}
