import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
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
      const savedUser = await AsyncStorage.getItem("user");
      console.log('🔍 Hydrating from AsyncStorage:', savedUser);
      
      const initialUser = savedUser ? JSON.parse(savedUser) : null;
      
      set({
        user: initialUser,
        isAuthenticated: !!initialUser,
        hydrated: true,
      });
      
      console.log('✅ Hydration complete:', { user: initialUser, isAuthenticated: !!initialUser });
    } catch (error) {
      console.error('❌ Failed to load user from storage:', error);
      set({ hydrated: true });
    }
  },

  login: async (user) => {
    try {
      console.log('💾 Saving user to AsyncStorage:', user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      
      set({ user, isAuthenticated: true });
      console.log('✅ Login successful, user saved to storage');
    } catch (error) {
      console.error('❌ Failed to save user:', error);
      set({ user, isAuthenticated: true });
    }
  },

  logout: async () => {
    try {
      console.log('🗑️ Removing user from AsyncStorage');
      await AsyncStorage.removeItem("user");
      
      set({ user: null, isAuthenticated: false });
      console.log('✅ Logout successful, user removed from storage');
    } catch (error) {
      console.error('❌ Failed to remove user:', error);
      set({ user: null, isAuthenticated: false });
    }
  },
}));
