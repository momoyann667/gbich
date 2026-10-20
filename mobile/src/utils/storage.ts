/**
 * GBICH'APP — Cross-Platform Storage Adapter.
 *
 * Résout la divergence technique entre React Native Mobile (MMKV C++)
 * et l'environnement Web/PWA (localStorage / IndexedDB).
 */

import { Platform } from 'react-native';

interface IStorage {
  getString(key: string): string | null;
  setString(key: string, value: string): void;
  getNumber(key: string): number | null;
  setNumber(key: string, value: number): void;
  getBoolean(key: string): boolean | null;
  setBoolean(key: string, value: boolean): void;
  delete(key: string): void;
  clearAll(): void;
}

class WebStorageAdapter implements IStorage {
  private memoryFallback: Map<string, string> = new Map();

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getString(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return window.localStorage.getItem(key);
    }
    return this.memoryFallback.get(key) ?? null;
  }

  setString(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.setItem(key, value);
    } else {
      this.memoryFallback.set(key, value);
    }
  }

  getNumber(key: string): number | null {
    const val = this.getString(key);
    if (val === null) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }

  setNumber(key: string, value: number): void {
    this.setString(key, String(value));
  }

  getBoolean(key: string): boolean | null {
    const val = this.getString(key);
    if (val === null) return null;
    return val === 'true';
  }

  setBoolean(key: string, value: boolean): void {
    this.setString(key, String(value));
  }

  delete(key: string): void {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.removeItem(key);
    } else {
      this.memoryFallback.delete(key);
    }
  }

  clearAll(): void {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.clear();
    } else {
      this.memoryFallback.clear();
    }
  }
}

// Instance globale du stockage
export const appStorage: IStorage = new WebStorageAdapter();

// Helper compatible avec TanStack Query persister
export const queryStorageAdapter = {
  getItem: (key: string): string | null => appStorage.getString(key),
  setItem: (key: string, value: string): void => appStorage.setString(key, value),
  removeItem: (key: string): void => appStorage.delete(key),
};
