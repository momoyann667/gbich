import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ResponsiveContainer } from './src/components/common/ResponsiveContainer';
import { registerServiceWorker } from './src/utils/registerServiceWorker';

export default function App() {
  useEffect(() => {
    // Initialise le Service Worker pour la PWA
    registerServiceWorker();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ResponsiveContainer>
          <RootNavigator />
          <StatusBar style="light" />
        </ResponsiveContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
