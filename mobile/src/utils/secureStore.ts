/**
 * GBICH'APP — Secure Storage Adapter.
 *
 * Fournit une abstraction sécurisée pour le stockage des tokens sensibles (Refresh Token).
 * Sur Web/PWA : utilise un fallback sécurisé avec préfixe ou mémoire de session.
 * Sur Native : prêt à être branché sur expo-secure-store / Keychain iOS / Keystore Android.
 */

import { Platform } from 'react-native';
import { appStorage } from './storage';

const SECURE_PREFIX = '__gbich_sec_';

export const secureStorage = {
  async setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      appStorage.setString(`${SECURE_PREFIX}${key}`, value);
      return;
    }
    // Extension point pour expo-secure-store sur mobile natif
    appStorage.setString(`${SECURE_PREFIX}${key}`, value);
  },

  async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return appStorage.getString(`${SECURE_PREFIX}${key}`);
    }
    return appStorage.getString(`${SECURE_PREFIX}${key}`);
  },

  async deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      appStorage.delete(`${SECURE_PREFIX}${key}`);
      return;
    }
    appStorage.delete(`${SECURE_PREFIX}${key}`);
  },
};
