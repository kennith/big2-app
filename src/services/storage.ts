import type { GameSettings } from '../engine/types';

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentWinStreak: number;
  maxWinStreak: number;
  lowestPenaltyLoss: number;
  totalPointsLost: number;
}

const STATS_KEY = 'big2_player_stats_v1';
const SETTINGS_KEY = 'big2_game_settings_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  language: 'zh-TW',
  botDifficulty: 'medium',
  soundEnabled: true,
  soundVolume: 0.5,
  gameSpeedMs: 700,
  autoPass: false,
  sortMode: 'rank',
  botPersonalities: {
    'bot-1': 'aggressive',
    'bot-2': 'balanced',
    'bot-3': 'cautious',
  },
};

export const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentWinStreak: 0,
  maxWinStreak: 0,
  lowestPenaltyLoss: 999,
  totalPointsLost: 0,
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        botPersonalities: {
          ...DEFAULT_SETTINGS.botPersonalities,
          ...(parsed.botPersonalities || {}),
        },
      };
    }
  } catch (e) {
    console.warn('Failed to load settings from storage', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to storage', e);
  }
}

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load stats from storage', e);
  }
  return { ...DEFAULT_STATS };
}

export function recordGameResult(won: boolean, pointsLost: number): PlayerStats {
  const current = loadStats();
  current.gamesPlayed += 1;

  if (won) {
    current.gamesWon += 1;
    current.currentWinStreak += 1;
    if (current.currentWinStreak > current.maxWinStreak) {
      current.maxWinStreak = current.currentWinStreak;
    }
  } else {
    current.currentWinStreak = 0;
    current.totalPointsLost += pointsLost;
    if (pointsLost < current.lowestPenaltyLoss) {
      current.lowestPenaltyLoss = pointsLost;
    }
  }

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to save stats to storage', e);
  }

  return current;
}
