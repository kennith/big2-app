import {
  compareCards,
  getRankWeight,
  getSuitWeight,
  sortCardsByRank,
  SUIT_NAMES,
  SUIT_SYMBOLS,
} from './deck';
import type { Card, HandCombo, HandComboType, Rank } from './types';

// The 5-card hand tier hierarchy (1 to 5)
export const FIVE_CARD_TIERS: Record<HandComboType, number> = {
  SINGLE: 0,
  PAIR: 0,
  TRIPLE: 0,
  STRAIGHT: 1,
  FLUSH: 2,
  FULL_HOUSE: 3,
  QUAD: 4,
  STRAIGHT_FLUSH: 5,
};

// All valid 5-rank straight sequences (ranks ordered by logical sequence, with their highest rank)
// Standard Big 2 valid straights: 3-4-5-6-7 up to 10-J-Q-K-A, plus A-2-3-4-5 and 2-3-4-5-6
export const VALID_STRAIGHT_SEQUENCES: { ranks: Rank[]; highestRank: Rank }[] = [
  { ranks: ['3', '4', '5', '6', '7'], highestRank: '7' },
  { ranks: ['4', '5', '6', '7', '8'], highestRank: '8' },
  { ranks: ['5', '6', '7', '8', '9'], highestRank: '9' },
  { ranks: ['6', '7', '8', '9', '10'], highestRank: '10' },
  { ranks: ['7', '8', '9', '10', 'J'], highestRank: 'J' },
  { ranks: ['8', '9', '10', 'J', 'Q'], highestRank: 'Q' },
  { ranks: ['9', '10', 'J', 'Q', 'K'], highestRank: 'K' },
  { ranks: ['10', 'J', 'Q', 'K', 'A'], highestRank: 'A' },
  { ranks: ['J', 'Q', 'K', 'A', '2'], highestRank: '2' },
  { ranks: ['A', '2', '3', '4', '5'], highestRank: '2' },
  { ranks: ['2', '3', '4', '5', '6'], highestRank: '2' },
];

/**
 * Checks if 5 cards form a Straight.
 * Returns the highest card if true, null otherwise.
 */
export function checkStraight(cards: Card[]): { isStraight: boolean; highestCard: Card } | null {
  if (cards.length !== 5) return null;
  const ranksInHand = cards.map((c) => c.rank);

  for (const seq of VALID_STRAIGHT_SEQUENCES) {
    const matches = seq.ranks.every((r) => ranksInHand.includes(r));
    if (matches && new Set(ranksInHand).size === 5) {
      // Find the card matching highestRank in this sequence
      const highestRankCards = cards.filter((c) => c.rank === seq.highestRank);
      // Pick the one with highest suit
      const highestCard = highestRankCards.sort(compareCards)[highestRankCards.length - 1];
      return { isStraight: true, highestCard };
    }
  }

  return null;
}

/**
 * Checks if 5 cards form a Flush (all same suit).
 */
export function checkFlush(cards: Card[]): { isFlush: boolean; highestCard: Card } | null {
  if (cards.length !== 5) return null;
  const suit = cards[0].suit;
  if (cards.every((c) => c.suit === suit)) {
    const sorted = sortCardsByRank(cards);
    return { isFlush: true, highestCard: sorted[4] };
  }
  return null;
}

/**
 * Group cards by rank
 */
export function groupByRank(cards: Card[]): Map<Rank, Card[]> {
  const map = new Map<Rank, Card[]>();
  for (const card of cards) {
    const group = map.get(card.rank) || [];
    group.push(card);
    map.set(card.rank, group);
  }
  return map;
}

/**
 * Identifies the combination type and returns a HandCombo object, or null if invalid.
 */
export function identifyCombo(cards: Card[]): HandCombo | null {
  if (!cards || cards.length === 0) return null;
  const count = cards.length;
  const sorted = sortCardsByRank(cards);

  // 1-card Hand: Single
  if (count === 1) {
    const card = cards[0];
    return {
      type: 'SINGLE',
      cards: [card],
      highestCard: card,
      rankValue: getRankWeight(card.rank),
      displayRank: `${card.rank}${SUIT_SYMBOLS[card.suit]}`,
    };
  }

  // 2-card Hand: Pair
  if (count === 2) {
    if (cards[0].rank === cards[1].rank) {
      const highestCard = compareCards(cards[0], cards[1]) > 0 ? cards[0] : cards[1];
      return {
        type: 'PAIR',
        cards: sorted,
        highestCard,
        rankValue: getRankWeight(cards[0].rank),
        displayRank: `Pair of ${cards[0].rank}s`,
      };
    }
    return null;
  }

  // 3-card Hand: Triple
  if (count === 3) {
    if (cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank) {
      return {
        type: 'TRIPLE',
        cards: sorted,
        highestCard: sorted[2],
        rankValue: getRankWeight(cards[0].rank),
        displayRank: `Triple ${cards[0].rank}s`,
      };
    }
    return null;
  }

  // 5-card Hands
  if (count === 5) {
    const straightInfo = checkStraight(cards);
    const flushInfo = checkFlush(cards);
    const rankGroups = groupByRank(cards);
    const groupSizes = Array.from(rankGroups.values()).map((g) => g.length).sort((a, b) => b - a);

    // 1. Straight Flush
    if (straightInfo && flushInfo) {
      return {
        type: 'STRAIGHT_FLUSH',
        cards: sorted,
        highestCard: straightInfo.highestCard,
        rankValue: getRankWeight(straightInfo.highestCard.rank),
        displayRank: `Straight Flush (${SUIT_NAMES[straightInfo.highestCard.suit]}, ${straightInfo.highestCard.rank}-High)`,
      };
    }

    // 2. Four of a Kind (Quad + 1 kicker)
    if (groupSizes[0] === 4 && groupSizes[1] === 1) {
      const quadGroup = Array.from(rankGroups.values()).find((g) => g.length === 4)!;
      const kickerGroup = Array.from(rankGroups.values()).find((g) => g.length === 1)!;
      const quadHighestCard = sortCardsByRank(quadGroup)[3];
      return {
        type: 'QUAD',
        cards: [...sortCardsByRank(quadGroup), ...kickerGroup],
        highestCard: quadHighestCard,
        rankValue: getRankWeight(quadGroup[0].rank),
        displayRank: `Four of a Kind (${quadGroup[0].rank}s with ${kickerGroup[0].rank})`,
      };
    }

    // 3. Full House (3 + 2)
    if (groupSizes[0] === 3 && groupSizes[1] === 2) {
      const tripleGroup = Array.from(rankGroups.values()).find((g) => g.length === 3)!;
      const pairGroup = Array.from(rankGroups.values()).find((g) => g.length === 2)!;
      const tripleHighest = sortCardsByRank(tripleGroup)[2];
      return {
        type: 'FULL_HOUSE',
        cards: [...sortCardsByRank(tripleGroup), ...sortCardsByRank(pairGroup)],
        highestCard: tripleHighest,
        rankValue: getRankWeight(tripleGroup[0].rank),
        displayRank: `Full House (${tripleGroup[0].rank}s full of ${pairGroup[0].rank}s)`,
      };
    }

    // 4. Flush
    if (flushInfo) {
      return {
        type: 'FLUSH',
        cards: sorted,
        highestCard: flushInfo.highestCard,
        rankValue: getSuitWeight(flushInfo.highestCard.suit),
        displayRank: `Flush (${SUIT_NAMES[flushInfo.highestCard.suit]}, ${flushInfo.highestCard.rank}-High)`,
      };
    }

    // 5. Straight
    if (straightInfo) {
      return {
        type: 'STRAIGHT',
        cards: sorted,
        highestCard: straightInfo.highestCard,
        rankValue: getRankWeight(straightInfo.highestCard.rank),
        displayRank: `Straight (${straightInfo.highestCard.rank}-High)`,
      };
    }

    return null;
  }

  // Any other card counts (4 cards alone) are not valid hands in standard Big 2
  return null;
}

/**
 * Finds all valid combinations in a given hand.
 */
export function findAllCombos(hand: Card[]): HandCombo[] {
  const combos: HandCombo[] = [];
  const sorted = sortCardsByRank(hand);

  // Singles
  for (const card of sorted) {
    combos.push(identifyCombo([card])!);
  }

  // Pairs
  const rankGroups = groupByRank(hand);
  for (const [_, cards] of rankGroups) {
    if (cards.length >= 2) {
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
          const combo = identifyCombo([cards[i], cards[j]]);
          if (combo) combos.push(combo);
        }
      }
    }
  }

  // Triples
  for (const [_, cards] of rankGroups) {
    if (cards.length >= 3) {
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
          for (let k = j + 1; k < cards.length; k++) {
            const combo = identifyCombo([cards[i], cards[j], cards[k]]);
            if (combo) combos.push(combo);
          }
        }
      }
    }
  }

  // 5-Card hands if player has >= 5 cards
  if (hand.length >= 5) {
    // Generate all 5-combinations
    const generate5CardSubsets = (arr: Card[], start: number, current: Card[]) => {
      if (current.length === 5) {
        const combo = identifyCombo(current);
        if (combo) combos.push(combo);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        generate5CardSubsets(arr, i + 1, current);
        current.pop();
      }
    };
    generate5CardSubsets(hand, 0, []);
  }

  return combos;
}

export interface HandComboGroup {
  id: string;
  type: HandComboType;
  combo: HandCombo | null;
  cards: Card[];
}

/**
 * Partitions a hand into distinct combination groups:
 * 1. Best 5-card combinations (Straight Flush, Quad, Full House, Flush, Straight)
 * 2. Triples
 * 3. Pairs
 * 4. Remaining Singles
 */
export function partitionHandByCombos(
  cards: Card[],
  strategy: 'default' | 'pairs_triples' | 'straights' | 'flushes' | 'full_house' = 'default'
): HandComboGroup[] {
  let pool = sortCardsByRank([...cards]);
  const groups: HandComboGroup[] = [];
  let groupId = 0;

  const extract5CardCombos = (filterType?: (c: HandCombo) => boolean) => {
    while (pool.length >= 5) {
      const allCombos = findAllCombos(pool);
      let fiveCardCombos = allCombos.filter((c) => c.cards.length === 5);
      if (filterType) {
        fiveCardCombos = fiveCardCombos.filter(filterType);
      }
      if (fiveCardCombos.length === 0) break;

      fiveCardCombos.sort((a, b) => {
        const tierDiff = FIVE_CARD_TIERS[b.type] - FIVE_CARD_TIERS[a.type];
        if (tierDiff !== 0) return tierDiff;
        return b.rankValue - a.rankValue;
      });

      const bestCombo = fiveCardCombos[0];
      const comboCardIds = new Set(bestCombo.cards.map((c) => c.id));
      const sortedCards = sortCardsByRank(bestCombo.cards);
      groups.push({
        id: `group-${groupId++}`,
        type: bestCombo.type,
        combo: bestCombo,
        cards: sortedCards,
      });
      pool = pool.filter((c) => !comboCardIds.has(c.id));
    }
  };

  const extractTriples = () => {
    const rankGroups = groupByRank(pool);
    for (const [_, groupCards] of rankGroups) {
      if (groupCards.length >= 3) {
        const tripleCards = groupCards.slice(0, 3);
        const tripleIds = new Set(tripleCards.map((c) => c.id));
        const sortedTriple = sortCardsByRank(tripleCards);
        const combo = identifyCombo(sortedTriple);
        groups.push({
          id: `group-${groupId++}`,
          type: 'TRIPLE',
          combo,
          cards: sortedTriple,
        });
        pool = pool.filter((c) => !tripleIds.has(c.id));
      }
    }
  };

  const extractPairs = () => {
    const rankGroups = groupByRank(pool);
    for (const [_, groupCards] of rankGroups) {
      if (groupCards.length >= 2) {
        const pairCards = groupCards.slice(0, 2);
        const pairIds = new Set(pairCards.map((c) => c.id));
        const sortedPair = sortCardsByRank(pairCards);
        const combo = identifyCombo(sortedPair);
        groups.push({
          id: `group-${groupId++}`,
          type: 'PAIR',
          combo,
          cards: sortedPair,
        });
        pool = pool.filter((c) => !pairIds.has(c.id));
      }
    }
  };

  if (strategy === 'pairs_triples') {
    // Triples and pairs prioritized first
    extractTriples();
    extractPairs();
    extract5CardCombos();
  } else if (strategy === 'straights') {
    // Straights / Straight flushes prioritized first
    extract5CardCombos((c) => c.type === 'STRAIGHT' || c.type === 'STRAIGHT_FLUSH');
    extractTriples();
    extractPairs();
    extract5CardCombos();
  } else if (strategy === 'flushes') {
    // Flushes prioritized first
    extract5CardCombos((c) => c.type === 'FLUSH' || c.type === 'STRAIGHT_FLUSH');
    extractTriples();
    extractPairs();
    extract5CardCombos();
  } else if (strategy === 'full_house') {
    // Full houses prioritized first
    extract5CardCombos((c) => c.type === 'FULL_HOUSE');
    extractTriples();
    extractPairs();
    extract5CardCombos();
  } else {
    // Default: Best 5-card combinations first
    extract5CardCombos();
    extractTriples();
    extractPairs();
  }

  // Remaining are singles
  if (pool.length > 0) {
    const sortedSingles = sortCardsByRank(pool);
    groups.push({
      id: `group-${groupId++}`,
      type: 'SINGLE',
      combo: null,
      cards: sortedSingles,
    });
  }

  return groups;
}

/**
 * Returns all distinct valid combination partitioning arrangements for a hand of cards.
 */
export function getDistinctComboPartitions(cards: Card[]): HandComboGroup[][] {
  const strategies: Array<'default' | 'pairs_triples' | 'straights' | 'flushes' | 'full_house'> = [
    'default',
    'pairs_triples',
    'straights',
    'flushes',
    'full_house',
  ];

  const results: HandComboGroup[][] = [];
  const seenSignatures = new Set<string>();

  for (const strat of strategies) {
    const partition = partitionHandByCombos(cards, strat);
    // Build unique signature: e.g. "FULL_HOUSE:4-D,4-C,4-H,5-D,5-C|PAIR:8-D,8-C"
    const sig = partition
      .map((g) => `${g.type}:${g.cards.map((c) => c.id).sort().join(',')}`)
      .join('|');

    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      results.push(partition);
    }
  }

  return results.length > 0 ? results : [partitionHandByCombos(cards, 'default')];
}

/**
 * Sorts cards by combinations:
 * Extracts 5-card combinations first, then Triples, then Pairs, then remaining Singles.
 */
export function sortCardsByCombo(cards: Card[]): Card[] {
  const groups = partitionHandByCombos(cards);
  return groups.flatMap((g) => g.cards);
}


