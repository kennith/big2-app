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

/**
 * Detect user's browser language preference.
 * Returns 'zh-TW' for Chinese locale variants, and 'en' for English or other locales.
 */
export function detectBrowserLanguage(): 'en' | 'zh-TW' {
  try {
    if (typeof navigator !== 'undefined') {
      const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
      for (const lang of langs) {
        if (!lang) continue;
        const l = lang.toLowerCase();
        if (l.startsWith('zh')) {
          return 'zh-TW';
        }
        if (l.startsWith('en')) {
          return 'en';
        }
      }
      // If primary browser locale is non-Chinese (e.g. ja, fr, es, de), fallback to English
      const primary = (navigator.language || '').toLowerCase();
      if (primary && !primary.startsWith('zh')) {
        return 'en';
      }
    }
  } catch (e) {
    console.warn('Failed to detect browser language', e);
  }
  return 'zh-TW';
}

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
  const detectedLang = detectBrowserLanguage();
  const defaultSettingsWithLocale: GameSettings = {
    ...DEFAULT_SETTINGS,
    language: detectedLang,
  };

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSettingsWithLocale,
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
  return defaultSettingsWithLocale;
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
