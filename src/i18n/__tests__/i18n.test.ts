import { describe, expect, it } from 'vitest';
import { identifyCombo } from '../../engine/combos';
import { formatComboDisplayName } from '../formatters';

describe('i18n Combo Formatter', () => {
  it('formats Single card names in English and Traditional Chinese', () => {
    const single = identifyCombo([{ id: '2-S', rank: '2', suit: 'S' }]);
    expect(formatComboDisplayName(single, 'en')).toBe('2♠');
    expect(formatComboDisplayName(single, 'zh-TW')).toBe('單張 2♠');
  });

  it('formats Pair names in English and Traditional Chinese', () => {
    const pair = identifyCombo([
      { id: '10-D', rank: '10', suit: 'D' },
      { id: '10-S', rank: '10', suit: 'S' },
    ]);
    expect(formatComboDisplayName(pair, 'en')).toBe('Pair of 10s');
    expect(formatComboDisplayName(pair, 'zh-TW')).toBe('對 10');
  });

  it('formats Full House in English and Traditional Chinese', () => {
    const fullHouse = identifyCombo([
      { id: 'K-D', rank: 'K', suit: 'D' },
      { id: 'K-C', rank: 'K', suit: 'C' },
      { id: 'K-S', rank: 'K', suit: 'S' },
      { id: '4-H', rank: '4', suit: 'H' },
      { id: '4-S', rank: '4', suit: 'S' },
    ]);
    expect(formatComboDisplayName(fullHouse, 'en')).toBe('Full House (Ks full of 4s)');
    expect(formatComboDisplayName(fullHouse, 'zh-TW')).toBe('葫蘆 (K 帶 4)');
  });

  it('formats Quad / Bomb in English and Traditional Chinese', () => {
    const quad = identifyCombo([
      { id: '8-D', rank: '8', suit: 'D' },
      { id: '8-C', rank: '8', suit: 'C' },
      { id: '8-H', rank: '8', suit: 'H' },
      { id: '8-S', rank: '8', suit: 'S' },
      { id: '3-D', rank: '3', suit: 'D' },
    ]);
    expect(formatComboDisplayName(quad, 'en')).toBe('Four of a Kind (8s with 3)');
    expect(formatComboDisplayName(quad, 'zh-TW')).toBe('鐵支 (8 帶 3)');
  });

  it('formats Straight in English and Traditional Chinese', () => {
    const straight = identifyCombo([
      { id: '3-D', rank: '3', suit: 'D' },
      { id: '4-C', rank: '4', suit: 'C' },
      { id: '5-H', rank: '5', suit: 'H' },
      { id: '6-S', rank: '6', suit: 'S' },
      { id: '7-D', rank: '7', suit: 'D' },
    ]);
    expect(formatComboDisplayName(straight, 'en')).toBe('Straight (7-High)');
    expect(formatComboDisplayName(straight, 'zh-TW')).toBe('順子 (7 結尾)');
  });
});
