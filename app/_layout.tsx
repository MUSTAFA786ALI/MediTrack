import "@/global.css";
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Loading Screen Component
function LoadingScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
        Loading...
      </Text>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { hydrated, hydrate, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 App initializing...');
      try {
        await hydrate();
        console.log('✅ App hydration complete');
        console.log('🔐 Authentication status:', isAuthenticated);
      } catch (error) {
        console.error('❌ App hydration failed:', error);
      } finally {
        setIsReady(true);
      }
    };
    
    initializeApp();
  }, [hydrate]);

  // Show loading while hydrating
  if (!hydrated || !isReady || !loaded) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            // User is authenticated - show main app
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </>
          ) : (
            // User is not authenticated - show login
            <>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </>
          )}
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
