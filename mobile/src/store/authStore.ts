/**
 * GBICH'APP — Authentication & Session Zustand Store.
 */

import { create } from 'zustand';
import { secureStorage } from '../utils/secureStore';

export interface UserProfile {
  id: string;
  username: string;
  role: 'reader' | 'contributor' | 'editor' | 'admin';
  avatarSlug: string;
  preferredLang: string;
}

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  setSession: (token: string, user: UserProfile) => void;
  setGuestMode: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,

  setSession: (token, user) => {
    set({
      accessToken: token,
      user,
      isAuthenticated: true,
      isGuest: false,
    });
  },

  setGuestMode: () => {
    set({
      accessToken: null,
      user: {
        id: 'guest',
        username: 'Lecteur Invité',
        role: 'reader',
        avatarSlug: 'avatar_default',
        preferredLang: 'fr',
      },
      isAuthenticated: false,
      isGuest: true,
    });
  },

  logout: async () => {
    await secureStorage.deleteItemAsync('refreshToken');
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isGuest: false,
    });
  },
}));
