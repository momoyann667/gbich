/**
 * GBICH'APP — Geolocation & Zone Zustand Store.
 */

import { create } from 'zustand';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  country?: string;
  timestamp: number;
}

interface LocationState {
  coordinates: LocationCoordinates | null;
  status: 'idle' | 'prompted' | 'granted' | 'denied' | 'unavailable';
  errorMessage: string | null;
  setCoordinates: (coords: LocationCoordinates) => void;
  setStatus: (status: 'idle' | 'prompted' | 'granted' | 'denied' | 'unavailable') => void;
  setErrorMessage: (msg: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  coordinates: null,
  status: 'idle',
  errorMessage: null,

  setCoordinates: (coords) => set({ coordinates: coords, status: 'granted', errorMessage: null }),
  setStatus: (status) => set({ status }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
}));
