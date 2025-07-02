import "@/global.css";
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { useAuthStore } from '../src/store/authStore';

Sentry.init({
  dsn: 'https://f0a8177f90f1d4921b2673be161f5fe7@o4509598742413312.ingest.us.sentry.io/4509598744641536',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const { hydrated, hydrate, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const segments = useSegments();
  const router = useRouter();

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

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isReady || !hydrated) return;

    const inAuthGroup = segments[0] === '(tabs)';
    
    console.log('🎯 Navigation check:', { 
      isAuthenticated, 
      inAuthGroup, 
      segments: segments.join('/') 
    });

    if (isAuthenticated && !inAuthGroup) {
      // User is authenticated but not in authenticated area
      console.log('➡️ Redirecting to dashboard');
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inAuthGroup) {
      // User is not authenticated but in authenticated area
      console.log('➡️ Redirecting to login');
      router.replace('/login');
    }
  }, [isAuthenticated, segments, isReady, hydrated]);

  // Show loading while hydrating
  if (!hydrated || !isReady || !loaded) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Conditionally render screens based on auth state */}
            {isAuthenticated ? (
              <Stack.Screen 
                name="(tabs)" 
                options={{ 
                  headerShown: false
                }} 
              />
            ) : (
              <Stack.Screen 
                name="login" 
                options={{ 
                  headerShown: false
                }} 
              />
            )}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
});