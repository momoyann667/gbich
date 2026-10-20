/**
 * GBICH'APP — App Settings & Preferences Zustand Store.
 */

import { create } from 'zustand';
import { appStorage } from '../utils/storage';

interface SettingsState {
  theme: 'dark' | 'light';
  language: 'fr' | 'en';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  lowDataMode: boolean;
  setLanguage: (lang: 'fr' | 'en') => void;
  toggleSound: () => void;
  toggleLowDataMode: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'dark',
  language: (appStorage.getString('gbich_lang') as 'fr' | 'en') || 'fr',
  soundEnabled: appStorage.getBoolean('gbich_sound') ?? true,
  hapticEnabled: appStorage.getBoolean('gbich_haptic') ?? true,
  lowDataMode: appStorage.getBoolean('gbich_low_data') ?? false,

  setLanguage: (lang) => {
    appStorage.setString('gbich_lang', lang);
    set({ language: lang });
  },

  toggleSound: () => {
    const nextVal = !get().soundEnabled;
    appStorage.setBoolean('gbich_sound', nextVal);
    set({ soundEnabled: nextVal });
  },

  toggleLowDataMode: () => {
    const nextVal = !get().lowDataMode;
    appStorage.setBoolean('gbich_low_data', nextVal);
    set({ lowDataMode: nextVal });
  },
}));
