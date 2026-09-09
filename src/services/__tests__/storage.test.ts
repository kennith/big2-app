import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_SETTINGS,
  detectBrowserLanguage,
  loadSettings,
  saveSettings,
} from '../storage';

describe('Storage & Language Detection', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
    });
  });

  it('detects English when browser language is en-US', () => {
    vi.stubGlobal('navigator', {
      languages: ['en-US', 'en'],
      language: 'en-US',
    });
    expect(detectBrowserLanguage()).toBe('en');
  });

  it('detects Traditional Chinese when browser language is zh-TW or zh-HK', () => {
    vi.stubGlobal('navigator', {
      languages: ['zh-TW', 'zh', 'en'],
      language: 'zh-TW',
    });
    expect(detectBrowserLanguage()).toBe('zh-TW');
  });

  it('defaults to English when browser language is a non-Chinese locale (e.g. ja)', () => {
    vi.stubGlobal('navigator', {
      languages: ['ja-JP', 'ja'],
      language: 'ja-JP',
    });
    expect(detectBrowserLanguage()).toBe('en');
  });

  it('uses browser language by default when localStorage is empty', () => {
    vi.stubGlobal('navigator', {
      languages: ['en-US'],
      language: 'en-US',
    });
    const settings = loadSettings();
    expect(settings.language).toBe('en');
  });

  it('remembers user switched language from localStorage', () => {
    vi.stubGlobal('navigator', {
      languages: ['en-US'],
      language: 'en-US',
    });
    // User switches to Traditional Chinese
    saveSettings({
      ...DEFAULT_SETTINGS,
      language: 'zh-TW',
    });

    const settings = loadSettings();
    expect(settings.language).toBe('zh-TW');
  });
});
