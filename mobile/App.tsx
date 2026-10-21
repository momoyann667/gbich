import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ResponsiveContainer } from './src/components/common/ResponsiveContainer';
import { registerServiceWorker } from './src/utils/registerServiceWorker';
import { PwaInstallPrompt } from './src/components/common/PwaInstallPrompt';
import { GeolocationBanner } from './src/components/common/GeolocationBanner';
import { useGeolocationTracker } from './src/hooks/useGeolocationTracker';

function MainAppContent() {
  // Déclenche la demande de position dès l'ouverture de l'application (pour la carte du dashboard)
  useGeolocationTracker();

  return (
    <ResponsiveContainer>
      <RootNavigator />
      <GeolocationBanner />
      <PwaInstallPrompt />
      <StatusBar style="light" />
    </ResponsiveContainer>
  );
}

export default function App() {
  useEffect(() => {
    // Initialise le Service Worker pour la PWA
    registerServiceWorker();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <MainAppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
