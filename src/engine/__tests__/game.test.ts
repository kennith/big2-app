import { describe, expect, it } from 'vitest';
import { getBotMove } from '../ai';
import {
  checkFlush,
  findAllCombos,
  identifyCombo,
  partitionHandByCombos,
  sortCardsByCombo,
} from '../combos';
import { compareCards, createDeck, dealCards, getCardValue } from '../deck';
import { calculateRoundScores, canBeatCombo, validatePlay } from '../evaluator';
import type { Card, Player, Trick } from '../types';

describe('Deck and Card Ranking', () => {
  it('should create 52 unique cards', () => {
    const deck = createDeck();
    expect(deck.length).toBe(52);
    const uniqueIds = new Set(deck.map((c) => c.id));
    expect(uniqueIds.size).toBe(52);
  });

  it('should correctly order cards from 3♦ to 2♠', () => {
    const threeDiamonds: Card = { id: '3-D', rank: '3', suit: 'D' };
    const threeSpades: Card = { id: '3-S', rank: '3', suit: 'S' };
    const twoDiamonds: Card = { id: '2-D', rank: '2', suit: 'D' };
    const twoSpades: Card = { id: '2-S', rank: '2', suit: 'S' };
    const aceSpades: Card = { id: 'A-S', rank: 'A', suit: 'S' };

    expect(getCardValue(threeDiamonds)).toBe(0); // lowest
    expect(getCardValue(twoSpades)).toBe(51); // highest

    expect(compareCards(threeDiamonds, threeSpades)).toBeLessThan(0);
    expect(compareCards(threeSpades, twoDiamonds)).toBeLessThan(0);
    expect(compareCards(aceSpades, twoDiamonds)).toBeLessThan(0);
  });

  it('should deal 13 cards to 4 players without duplication', () => {
    const deck = createDeck();
    const hands = dealCards(deck);
    expect(hands.length).toBe(4);
    hands.forEach((hand) => expect(hand.length).toBe(13));
    const allCards = hands.flat();
    expect(new Set(allCards.map((c) => c.id)).size).toBe(52);
  });
});

describe('Combo Identification', () => {
  it('identifies Singles, Pairs, and Triples', () => {
    const single = identifyCombo([{ id: '8-H', rank: '8', suit: 'H' }]);
    expect(single?.type).toBe('SINGLE');

    const pair = identifyCombo([
      { id: '10-D', rank: '10', suit: 'D' },
      { id: '10-S', rank: '10', suit: 'S' },
    ]);
    expect(pair?.type).toBe('PAIR');
    expect(pair?.highestCard.suit).toBe('S');

    const triple = identifyCombo([
      { id: 'J-C', rank: 'J', suit: 'C' },
      { id: 'J-H', rank: 'J', suit: 'H' },
      { id: 'J-S', rank: 'J', suit: 'S' },
    ]);
    expect(triple?.type).toBe('TRIPLE');
  });

  it('identifies Straights including wrapping ones', () => {
    const regularStraight: Card[] = [
      { id: '3-D', rank: '3', suit: 'D' },
      { id: '4-C', rank: '4', suit: 'C' },
      { id: '5-H', rank: '5', suit: 'H' },
      { id: '6-S', rank: '6', suit: 'S' },
      { id: '7-D', rank: '7', suit: 'D' },
    ];
    const combo1 = identifyCombo(regularStraight);
    expect(combo1?.type).toBe('STRAIGHT');
    expect(combo1?.highestCard.rank).toBe('7');

    const wrapStraight: Card[] = [
      { id: '10-D', rank: '10', suit: 'D' },
      { id: 'J-C', rank: 'J', suit: 'C' },
      { id: 'Q-H', rank: 'Q', suit: 'H' },
      { id: 'K-S', rank: 'K', suit: 'S' },
      { id: 'A-D', rank: 'A', suit: 'D' },
    ];
    const combo2 = identifyCombo(wrapStraight);
    expect(combo2?.type).toBe('STRAIGHT');
    expect(combo2?.highestCard.rank).toBe('A');
  });

  it('identifies Flushes correctly', () => {
    const flush: Card[] = [
      { id: '3-H', rank: '3', suit: 'H' },
      { id: '6-H', rank: '6', suit: 'H' },
      { id: '8-H', rank: '8', suit: 'H' },
      { id: 'J-H', rank: 'J', suit: 'H' },
      { id: 'A-H', rank: 'A', suit: 'H' },
    ];
    const combo = identifyCombo(flush);
    expect(combo?.type).toBe('FLUSH');
    expect(combo?.highestCard.rank).toBe('A');
    expect(checkFlush(flush)?.isFlush).toBe(true);
  });

  it('identifies Full Houses correctly', () => {
    const fullHouse: Card[] = [
      { id: '9-D', rank: '9', suit: 'D' },
      { id: '9-C', rank: '9', suit: 'C' },
      { id: '9-S', rank: '9', suit: 'S' },
      { id: '4-H', rank: '4', suit: 'H' },
      { id: '4-S', rank: '4', suit: 'S' },
    ];
    const combo = identifyCombo(fullHouse);
    expect(combo?.type).toBe('FULL_HOUSE');
    expect(combo?.rankValue).toBe(6); // 9 is rank weight 6
  });

  it('identifies Quads (Four of a Kind) correctly', () => {
    const quad: Card[] = [
      { id: 'K-D', rank: 'K', suit: 'D' },
      { id: 'K-C', rank: 'K', suit: 'C' },
      { id: 'K-H', rank: 'K', suit: 'H' },
      { id: 'K-S', rank: 'K', suit: 'S' },
      { id: '5-D', rank: '5', suit: 'D' },
    ];
    const combo = identifyCombo(quad);
    expect(combo?.type).toBe('QUAD');
    expect(combo?.highestCard.rank).toBe('K');
  });

  it('identifies Straight Flush correctly', () => {
    const straightFlush: Card[] = [
      { id: '8-S', rank: '8', suit: 'S' },
      { id: '9-S', rank: '9', suit: 'S' },
      { id: '10-S', rank: '10', suit: 'S' },
      { id: 'J-S', rank: 'J', suit: 'S' },
      { id: 'Q-S', rank: 'Q', suit: 'S' },
    ];
    const combo = identifyCombo(straightFlush);
    expect(combo?.type).toBe('STRAIGHT_FLUSH');
  });

  it('finds all combinations in a 13-card hand', () => {
    const sampleHand: Card[] = [
      { id: '3-D', rank: '3', suit: 'D' },
      { id: '3-C', rank: '3', suit: 'C' },
      { id: '4-H', rank: '4', suit: 'H' },
      { id: '5-S', rank: '5', suit: 'S' },
      { id: '6-D', rank: '6', suit: 'D' },
      { id: '7-C', rank: '7', suit: 'C' },
      { id: '8-H', rank: '8', suit: 'H' },
      { id: '9-S', rank: '9', suit: 'S' },
      { id: '10-D', rank: '10', suit: 'D' },
      { id: 'J-C', rank: 'J', suit: 'C' },
      { id: 'Q-H', rank: 'Q', suit: 'H' },
      { id: 'K-S', rank: 'K', suit: 'S' },
      { id: '2-S', rank: '2', suit: 'S' },
    ];
    const combos = findAllCombos(sampleHand);
    expect(combos.length).toBeGreaterThan(15);
    expect(combos.some((c) => c.type === 'PAIR')).toBe(true);
    expect(combos.some((c) => c.type === 'STRAIGHT')).toBe(true);
  });

  it('sorts hand by combinations (5-cards -> Triples -> Pairs -> Singles)', () => {
    // Hand containing:
    // Full House: 9D, 9C, 9S, 4H, 4S (5 cards)
    // Triple: JC, JH, JS (3 cards)
    // Pair: 10D, 10S (2 cards)
    // Singles: 3D, KD, 2S (3 cards)
    const testHand: Card[] = [
      { id: '3-D', rank: '3', suit: 'D' },
      { id: '4-H', rank: '4', suit: 'H' },
      { id: '4-S', rank: '4', suit: 'S' },
      { id: '9-D', rank: '9', suit: 'D' },
      { id: '9-C', rank: '9', suit: 'C' },
      { id: '9-S', rank: '9', suit: 'S' },
      { id: '10-D', rank: '10', suit: 'D' },
      { id: '10-S', rank: '10', suit: 'S' },
      { id: 'J-C', rank: 'J', suit: 'C' },
      { id: 'J-H', rank: 'J', suit: 'H' },
      { id: 'J-S', rank: 'J', suit: 'S' },
      { id: 'K-D', rank: 'K', suit: 'D' },
      { id: '2-S', rank: '2', suit: 'S' },
    ];

    const sortedByCombo = sortCardsByCombo(testHand);
    expect(sortedByCombo.length).toBe(13);

    // The first 5 cards should form Full House of Js full of 10s
    const first5 = sortedByCombo.slice(0, 5);
    expect(identifyCombo(first5)?.type).toBe('FULL_HOUSE');

    // The next 5 cards should form Full House of 9s full of 4s
    const next5 = sortedByCombo.slice(5, 10);
    expect(identifyCombo(next5)?.type).toBe('FULL_HOUSE');

    // The remaining 3 cards should be singles: 3D, KD, 2S
    const last3 = sortedByCombo.slice(10, 13);
    expect(last3.map((c) => c.rank)).toEqual(['3', 'K', '2']);
  });

  it('partitions hand into labeled combo groups', () => {
    const testHand: Card[] = [
      { id: '3-D', rank: '3', suit: 'D' },
      { id: '4-H', rank: '4', suit: 'H' },
      { id: '4-S', rank: '4', suit: 'S' },
      { id: '9-D', rank: '9', suit: 'D' },
      { id: '9-C', rank: '9', suit: 'C' },
      { id: '9-S', rank: '9', suit: 'S' },
      { id: '10-D', rank: '10', suit: 'D' },
      { id: '10-S', rank: '10', suit: 'S' },
      { id: 'J-C', rank: 'J', suit: 'C' },
      { id: 'J-H', rank: 'J', suit: 'H' },
      { id: 'J-S', rank: 'J', suit: 'S' },
      { id: 'K-D', rank: 'K', suit: 'D' },
      { id: '2-S', rank: '2', suit: 'S' },
    ];

    const groups = partitionHandByCombos(testHand);
    expect(groups.length).toBe(3);
    expect(groups[0].type).toBe('FULL_HOUSE');
    expect(groups[0].cards.length).toBe(5);
    expect(groups[1].type).toBe('FULL_HOUSE');
    expect(groups[1].cards.length).toBe(5);
    expect(groups[2].type).toBe('SINGLE');
    expect(groups[2].cards.length).toBe(3);
  });
});

describe('Hand Evaluator & Move Rules', () => {
  it('compares singles: 2♠ beats all other singles', () => {
    const twoSpades = identifyCombo([{ id: '2-S', rank: '2', suit: 'S' }])!;
    const twoHearts = identifyCombo([{ id: '2-H', rank: '2', suit: 'H' }])!;
    const aceSpades = identifyCombo([{ id: 'A-S', rank: 'A', suit: 'S' }])!;

    expect(canBeatCombo(twoSpades, twoHearts)).toBe(true);
    expect(canBeatCombo(twoHearts, twoSpades)).toBe(false);
    expect(canBeatCombo(twoHearts, aceSpades)).toBe(true);
  });

  it('compares 5-card hierarchies: Full House beats Flush beats Straight', () => {
    const straight = identifyCombo([
      { id: '3-D', rank: '3', suit: 'D' },
      { id: '4-C', rank: '4', suit: 'C' },
      { id: '5-H', rank: '5', suit: 'H' },
      { id: '6-S', rank: '6', suit: 'S' },
      { id: '7-D', rank: '7', suit: 'D' },
    ])!;

    const flush = identifyCombo([
      { id: '3-H', rank: '3', suit: 'H' },
      { id: '6-H', rank: '6', suit: 'H' },
      { id: '8-H', rank: '8', suit: 'H' },
      { id: 'J-H', rank: 'J', suit: 'H' },
      { id: 'K-H', rank: 'K', suit: 'H' },
    ])!;

    const fullHouse = identifyCombo([
      { id: '4-D', rank: '4', suit: 'D' },
      { id: '4-C', rank: '4', suit: 'C' },
      { id: '4-S', rank: '4', suit: 'S' },
      { id: '3-H', rank: '3', suit: 'H' },
      { id: '3-S', rank: '3', suit: 'S' },
    ])!;

    expect(canBeatCombo(flush, straight)).toBe(true);
    expect(canBeatCombo(fullHouse, flush)).toBe(true);
    expect(canBeatCombo(straight, fullHouse)).toBe(false);
  });

  it('enforces 3♦ on first play of game', () => {
    const comboWithout3D = identifyCombo([{ id: '4-D', rank: '4', suit: 'D' }])!;
    const comboWith3D = identifyCombo([{ id: '3-D', rank: '3', suit: 'D' }])!;

    const invalidRes = validatePlay(comboWithout3D, null, true);
    expect(invalidRes.valid).toBe(false);

    const validRes = validatePlay(comboWith3D, null, true);
    expect(validRes.valid).toBe(true);
  });

  it('calculates score penalties with 1x, 2x, and 3x multipliers', () => {
    const mockPlayers: Player[] = [
      { id: 'p0', name: 'Winner', avatar: '', isHuman: true, position: 'bottom', hand: [] },
      {
        id: 'p1',
        name: 'Player 1 (5 cards)',
        avatar: '',
        isHuman: false,
        position: 'left',
        hand: new Array(5).fill({ id: '3-D', rank: '3', suit: 'D' }),
      },
      {
        id: 'p2',
        name: 'Player 2 (10 cards)',
        avatar: '',
        isHuman: false,
        position: 'top',
        hand: new Array(10).fill({ id: '4-D', rank: '4', suit: 'D' }),
      },
      {
        id: 'p3',
        name: 'Player 3 (13 cards)',
        avatar: '',
        isHuman: false,
        position: 'right',
        hand: new Array(13).fill({ id: '5-D', rank: '5', suit: 'D' }),
      },
    ];

    const result = calculateRoundScores(mockPlayers, 0, 1);
    expect(result.penalties[0].pointsLost).toBe(0); // winner
    expect(result.penalties[1].multiplier).toBe(1);
    expect(result.penalties[1].pointsLost).toBe(5); // 5 * 1
    expect(result.penalties[2].multiplier).toBe(2);
    expect(result.penalties[2].pointsLost).toBe(20); // 10 * 2
    expect(result.penalties[3].multiplier).toBe(3);
    expect(result.penalties[3].pointsLost).toBe(39); // 13 * 3
  });
});

describe('Bot AI Move Generation', () => {
  it('bot leads with 3♦ on first turn', () => {
    const bot: Player = {
      id: 'bot-1',
      name: 'Alex',
      avatar: '',
      isHuman: false,
      position: 'left',
      personality: 'aggressive',
      hand: [
        { id: '3-D', rank: '3', suit: 'D' },
        { id: '3-S', rank: '3', suit: 'S' },
        { id: '8-H', rank: '8', suit: 'H' },
        { id: 'K-S', rank: 'K', suit: 'S' },
      ],
    };

    const players: Player[] = [
      bot,
      { id: 'p2', name: '', avatar: '', isHuman: false, position: 'top', hand: [] },
    ];

    const move = getBotMove(bot, players, null, true);
    expect(move).not.toBeNull();
    expect(move?.cards.some((c) => c.rank === '3' && c.suit === 'D')).toBe(true);
  });

  it('bot passes if cannot beat trick', () => {
    const bot: Player = {
      id: 'bot-1',
      name: 'Charlie',
      avatar: '',
      isHuman: false,
      position: 'right',
      personality: 'cautious',
      hand: [
        { id: '4-D', rank: '4', suit: 'D' },
        { id: '5-S', rank: '5', suit: 'S' },
      ],
    };

    const highTrick: Trick = {
      cards: [{ id: '2-S', rank: '2', suit: 'S' }],
      combo: identifyCombo([{ id: '2-S', rank: '2', suit: 'S' }])!,
      playedBy: 0,
      playerName: 'You',
      timestamp: Date.now(),
    };

    const move = getBotMove(bot, [bot], highTrick, false);
    expect(move).toBeNull(); // passes
  });
});
