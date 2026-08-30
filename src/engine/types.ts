export type Suit = 'D' | 'C' | 'H' | 'S'; // Diamonds, Clubs, Hearts, Spades
export type Rank = '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | '2';

export interface Card {
  id: string; // e.g. "3-D", "10-S"
  rank: Rank;
  suit: Suit;
}

export type HandComboType =
  | 'SINGLE'
  | 'PAIR'
  | 'TRIPLE'
  | 'STRAIGHT'
  | 'FLUSH'
  | 'FULL_HOUSE'
  | 'QUAD'
  | 'STRAIGHT_FLUSH';

export interface HandCombo {
  type: HandComboType;
  cards: Card[];
  highestCard: Card; // Decisive card for comparing same-type hands
  rankValue: number; // Primary rank comparison value
  displayRank: string; // User-friendly description, e.g. "Pair of Aces", "Full House (Kings full of 4s)"
}

export type PlayerPosition = 'bottom' | 'left' | 'top' | 'right';
export type BotDifficulty = 'easy' | 'medium' | 'hard';
export type BotPersonality = 'aggressive' | 'balanced' | 'cautious';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHuman: boolean;
  hand: Card[];
  position: PlayerPosition;
  personality?: BotPersonality;
}

export interface Trick {
  cards: Card[];
  combo: HandCombo;
  playedBy: number; // player index 0..3
  playerName: string;
  timestamp: number;
}

export interface GameSettings {
  language: 'en' | 'zh-TW';
  botDifficulty: BotDifficulty;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  gameSpeedMs: number; // Bot delay in ms (e.g. 800ms)
  autoPass: boolean; // Auto pass when human has no valid moves
  sortMode: 'rank' | 'suit' | 'combo';
}

export interface GameHistoryEntry {
  id: string;
  round: number;
  playerIndex: number;
  playerName: string;
  action: 'play' | 'pass';
  cards?: Card[];
  comboName?: string;
  timestamp: number;
}

export interface RoundResult {
  round: number;
  winnerIndex: number;
  winnerName: string;
  penalties: {
    playerIndex: number;
    playerName: string;
    cardsLeft: number;
    multiplier: number; // 1, 2, or 3
    pointsLost: number;
    deucesLeft: number;
  }[];
}

export type GameStatus = 'ready' | 'dealing' | 'playing' | 'round_end';
