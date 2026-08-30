import { SUIT_NAMES, SUIT_SYMBOLS } from '../engine/deck';
import type { HandCombo } from '../engine/types';
import { type Language, translations } from './translations';

/**
 * Formats a combo name according to active language (English / Traditional Chinese)
 */
export function formatComboDisplayName(combo: HandCombo | null, lang: Language): string {
  if (!combo) return '';
  const t = translations[lang];

  switch (combo.type) {
    case 'SINGLE': {
      const card = combo.highestCard;
      if (lang === 'zh-TW') {
        return `單張 ${card.rank}${SUIT_SYMBOLS[card.suit]}`;
      }
      return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
    }

    case 'PAIR': {
      const rank = combo.highestCard.rank;
      if (lang === 'zh-TW') {
        return `對 ${rank}`;
      }
      return `Pair of ${rank}s`;
    }

    case 'TRIPLE': {
      const rank = combo.highestCard.rank;
      if (lang === 'zh-TW') {
        return `三條 ${rank}`;
      }
      return `Triple ${rank}s`;
    }

    case 'STRAIGHT': {
      const rank = combo.highestCard.rank;
      if (lang === 'zh-TW') {
        return `順子 (${rank} 結尾)`;
      }
      return `Straight (${rank}-High)`;
    }

    case 'FLUSH': {
      const suit = combo.highestCard.suit;
      const rank = combo.highestCard.rank;
      if (lang === 'zh-TW') {
        return `同花 (${t.suits[suit]}, ${rank} 結尾)`;
      }
      return `Flush (${SUIT_NAMES[suit]}, ${rank}-High)`;
    }

    case 'FULL_HOUSE': {
      // Find triple rank and pair rank from cards
      const rankCounts: Record<string, number> = {};
      combo.cards.forEach((c) => {
        rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
      });
      const tripleRank = Object.keys(rankCounts).find((r) => rankCounts[r] === 3) || combo.highestCard.rank;
      const pairRank = Object.keys(rankCounts).find((r) => rankCounts[r] === 2) || '';

      if (lang === 'zh-TW') {
        return `葫蘆 (${tripleRank} 帶 ${pairRank})`;
      }
      return `Full House (${tripleRank}s full of ${pairRank}s)`;
    }

    case 'QUAD': {
      const rankCounts: Record<string, number> = {};
      combo.cards.forEach((c) => {
        rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
      });
      const quadRank = Object.keys(rankCounts).find((r) => rankCounts[r] === 4) || combo.highestCard.rank;
      const kickerRank = Object.keys(rankCounts).find((r) => rankCounts[r] === 1) || '';

      if (lang === 'zh-TW') {
        return `鐵支 (${quadRank} 帶 ${kickerRank})`;
      }
      return `Four of a Kind (${quadRank}s with ${kickerRank})`;
    }

    case 'STRAIGHT_FLUSH': {
      const suit = combo.highestCard.suit;
      const rank = combo.highestCard.rank;
      if (lang === 'zh-TW') {
        return `同花順 (${t.suits[suit]}, ${rank} 結尾)`;
      }
      return `Straight Flush (${SUIT_NAMES[suit]}, ${rank}-High)`;
    }

    default:
      return combo.displayRank || '';
  }
}
