import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { create } from "zustand";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => Promise<void>; // Make this async
  logout: () => Promise<void>; // Make this async
  hydrated: boolean;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,

  // Load user from AsyncStorage
  hydrate: async () => {
    try {
      Sentry.addBreadcrumb({
        message: 'Starting auth hydration',
        category: 'auth',
        level: 'info'
      });

      const savedUser = await AsyncStorage.getItem("user");
      console.log('🔍 Hydrating from AsyncStorage:', savedUser);
      
      const initialUser = savedUser ? JSON.parse(savedUser) : null;
      
      set({
        user: initialUser,
        isAuthenticated: !!initialUser,
        hydrated: true,
      });
      
      // Set user context in Sentry if user exists
      if (initialUser) {
        Sentry.setUser({
          id: initialUser.email,
          email: initialUser.email,
          username: initialUser.name,
        });
      }
      
      console.log('✅ Hydration complete:', { user: initialUser, isAuthenticated: !!initialUser });
      
      Sentry.addBreadcrumb({
        message: 'Auth hydration complete',
        category: 'auth',
        data: { hasUser: !!initialUser },
        level: 'info'
      });
      
    } catch (error) {
      console.error('❌ Failed to load user from storage:', error);
      
      Sentry.captureException(error, {
        tags: { feature: 'auth_hydration' }
      });
      
      set({ hydrated: true });
    }
  },

  login: async (user) => {
    try {
      Sentry.addBreadcrumb({
        message: 'User login attempt',
        category: 'auth',
        data: { email: user.email },
        level: 'info'
      });

      console.log('💾 Saving user to AsyncStorage:', user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      
      set({ user, isAuthenticated: true });
      
      // Set user context in Sentry
      Sentry.setUser({
        id: user.email,
        email: user.email,
        username: user.name,
      });
      
      console.log('✅ Login successful, user saved to storage');
      
      Sentry.addBreadcrumb({
        message: 'User login successful',
        category: 'auth',
        data: { email: user.email },
        level: 'info'
      });
      
    } catch (error) {
      console.error('❌ Failed to save user:', error);
      
      Sentry.withScope((scope) => {
        scope.setTag('feature', 'user_login');
        scope.setContext('login_attempt', {
          userEmail: user.email,
          timestamp: new Date().toISOString(),
        });
        Sentry.captureException(error);
      });
      
      // Still update state even if storage fails
      set({ user, isAuthenticated: true });
    }
  },

  logout: async () => {
    try {
      const currentUser = get().user;
      
      Sentry.addBreadcrumb({
        message: 'User logout attempt',
        category: 'auth',
        data: { email: currentUser?.email },
        level: 'info'
      });

      console.log('🗑️ Removing user from AsyncStorage');
      await AsyncStorage.removeItem("user");
      
      set({ user: null, isAuthenticated: false });
      
      // Clear user context in Sentry
      Sentry.setUser(null);
      
      console.log('✅ Logout successful, user removed from storage');
      
      Sentry.addBreadcrumb({
        message: 'User logout successful',
        category: 'auth',
        level: 'info'
      });
      
    } catch (error) {
      console.error('❌ Failed to remove user:', error);
      
      Sentry.captureException(error, {
        tags: { feature: 'user_logout' }
      });
      
      // Still clear state even if storage fails
      set({ user: null, isAuthenticated: false });
    }
  },
}));
