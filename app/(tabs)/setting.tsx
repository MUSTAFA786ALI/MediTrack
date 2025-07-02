import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/authStore";

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: "toggle" | "navigation" | "action";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  color?: string;
  bgColor?: string;
  dangerous?: boolean;
}

export default function Settings() {
  const colorScheme = useColorScheme();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Enhanced logout with Sentry error tracking
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              console.log('🚪 Starting logout process...');
              await logout(); // Now properly awaited
              console.log('🚪 Logout complete, routing will handle redirect');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Add debug function to check AsyncStorage with Sentry tracking
  const handleDebugStorage = async () => {
    try {
      Sentry.addBreadcrumb({
        message: 'Debug storage accessed',
        category: 'debug',
        level: 'info'
      });

      // Get all keys
      const keys = await AsyncStorage.getAllKeys();
      console.log('AsyncStorage Keys:', keys);

      // Get specific data
      const userData = await AsyncStorage.getItem('user');
      const loginFormData = await AsyncStorage.getItem('loginForm');
      
      Alert.alert(
        "AsyncStorage Debug",
        `🔑 Keys: ${keys.join(', ')}\n\n👤 User Data: ${userData}\n\n📝 Login Form: ${loginFormData}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
      
      // Log storage debug error to Sentry
      Sentry.captureException(error, {
        tags: { feature: 'debug_storage' }
      });
      
      Alert.alert("Error", "Failed to read storage data");
    }
  };

  // Test Sentry error tracking
  const handleTestSentry = () => {
    Alert.alert(
      "Test Sentry",
      "Choose a test type:",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Test Error", 
          onPress: () => {
            Sentry.captureException(new Error('Settings test error from Patient Dashboard'));
          }
        },
        { 
          text: "Test Message", 
          onPress: () => {
            Sentry.captureMessage('Settings test message from Patient Dashboard', 'info');
          }
        },
        { 
          text: "Test Crash", 
          onPress: () => {
            throw new Error('Intentional crash for testing');
          }
        }
      ]
    );
  };

  const handlePersonalInfo = () => {
    Alert.alert("Personal Information", "This feature will be available soon.");
  };

  const handlePrivacy = () => {
    Alert.alert("Privacy Settings", "This feature will be available soon.");
  };

  const handleSupport = () => {
    Alert.alert(
      "Contact Support",
      "How would you like to contact our support team?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Calling support...") },
        { text: "Email", onPress: () => console.log("Opening email...") },
        { text: "Chat", onPress: () => console.log("Starting chat...") },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About MediTrack",
      "Version 1.0.0\n\nA comprehensive healthcare management app designed to help you track your medication, shipments, and health information.\n\n© 2025 Healthcare Solutions Inc.",
      [{ text: "OK" }]
    );
  };

  const settingsData: SettingItem[] = [
    // Account Section
    {
      id: "personal-info",
      title: "Personal Information",
      subtitle: "Update your profile and contact details",
      icon: "person-outline",
      type: "navigation",
      onPress: handlePersonalInfo,
      color: "#3B82F6",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Manage your privacy settings",
      icon: "shield-checkmark-outline",
      type: "navigation",
      onPress: handlePrivacy,
      color: "#10B981",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },

    // Preferences Section
    {
      id: "notifications",
      title: "Push Notifications",
      subtitle: "Receive alerts about medications and deliveries",
      icon: "notifications-outline",
      type: "toggle",
      value: notifications,
      onToggle: setNotifications,
      color: "#F97316",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      id: "biometric",
      title: "Biometric Login",
      subtitle: "Use fingerprint or face recognition",
      icon: "finger-print-outline",
      type: "toggle",
      value: biometric,
      onToggle: setBiometric,
      color: "#8B5CF6",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      id: "auto-refresh",
      title: "Auto Refresh",
      subtitle: "Automatically update data in background",
      icon: "refresh-outline",
      type: "toggle",
      value: autoRefresh,
      onToggle: setAutoRefresh,
      color: "#06B6D4",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },

    // Debug Section (only in development)
    ...(__DEV__ ? [
      {
        id: "debug-storage",
        title: "Debug Storage",
        subtitle: "View AsyncStorage data (Dev only)",
        icon: "bug-outline" as keyof typeof Ionicons.glyphMap,
        type: "navigation" as const,
        onPress: handleDebugStorage,
        color: "#8B5CF6",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
      },
      {
        id: "test-sentry",
        title: "Test Sentry",
        subtitle: "Test error tracking (Dev only)",
        icon: "warning-outline" as keyof typeof Ionicons.glyphMap,
        type: "navigation" as const,
        onPress: handleTestSentry,
        color: "#F59E0B",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      },
      {
        id: "test-sentry-error",
        title: "Test Sentry Error",
        subtitle: "Trigger test error for Sentry",
        icon: "bug-outline" as keyof typeof Ionicons.glyphMap,
        type: "navigation" as const,
        onPress: () => {
          Sentry.captureException(new Error('Test error from Settings'));
        },
        color: "#EF4444",
        bgColor: "bg-red-100 dark:bg-red-900/30",
      },
      {
        id: "test-sentry-crash",
        title: "Test App Crash",
        subtitle: "Trigger crash for error boundary",
        icon: "warning-outline" as keyof typeof Ionicons.glyphMap,
        type: "navigation" as const,
        onPress: () => {
          throw new Error('Intentional crash for testing');
        },
        color: "#F59E0B",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      },
    ] : []),

    // Support Section
    {
      id: "support",
      title: "Help & Support",
      subtitle: "Get help or contact customer service",
      icon: "help-circle-outline",
      type: "navigation",
      onPress: handleSupport,
      color: "#6366F1",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      id: "about",
      title: "About",
      subtitle: "App version and information",
      icon: "information-circle-outline",
      type: "navigation",
      onPress: handleAbout,
      color: "#64748B",
      bgColor: "bg-slate-100 dark:bg-slate-700",
    },

    // Dangerous Actions
    {
      id: "logout",
      title: "Logout",
      subtitle: "Sign out of your account",
      icon: "log-out-outline",
      type: "action",
      onPress: handleLogout,
      color: "#EF4444",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      dangerous: true,
    },
  ];

  const renderSettingItem = ({
    item,
    index,
  }: {
    item: SettingItem;
    index: number;
  }) => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20, scale: 0.95 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 150,
          delay: index * 100,
        }}
        className="mx-6 mb-4"
      >
        <TouchableOpacity
          onPress={
            item.type === "navigation" || item.type === "action"
              ? item.onPress
              : undefined
          }
          disabled={item.type === "toggle"}
          className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg ${
            item.type !== "toggle" ? "active:scale-98" : ""
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View
                className={`w-12 h-12 ${item.bgColor} rounded-xl items-center justify-center mr-4`}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-lg font-bold ${
                    item.dangerous
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {item.subtitle}
                  </Text>
                )}
              </View>
            </View>

            {item.type === "toggle" ? (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: "#E5E7EB", true: item.color }}
                thumbColor={item.value ? "#FFFFFF" : "#9CA3AF"}
                ios_backgroundColor="#E5E7EB"
              />
            ) : (
              <View className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg items-center justify-center">
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </MotiView>
    );
  };

  const renderSectionHeader = (title: string, delay: number) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 150, delay }}
      className="mx-6 mb-3 mt-6"
    >
      <Text className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </Text>
    </MotiView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar 
          backgroundColor={colorScheme === 'dark' ? '#1F2937' : 'transparent'} 
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          translucent={colorScheme === 'light'}
        />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Enhanced Header */}
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <LinearGradient
            colors={
              colorScheme === "dark"
                ? ["#1F2937", "#374151"]
                : ["#3B82F6", "#1D4ED8"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 pt-8 pb-6 rounded-b-3xl mb-6"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white text-3xl font-bold mb-1">
                  Settings ⚙️
                </Text>
                <Text className="text-blue-100 text-lg">
                  Customize your experience
                </Text>
              </View>
              <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Profile Card */}
            <View className="bg-white/10 rounded-2xl p-4 mt-2">
              <View className="flex-row items-center">
                <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mr-4">
                  <Ionicons name="person" size={32} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-xl font-bold">
                    {user?.name || "John Doe"}
                  </Text>
                  <Text className="text-blue-100">
                    {user?.email || "john.doe@email.com"}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    <Text className="text-green-200 text-sm">Active Account</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Settings Sections */}
        <View className="-mt-4">
          {/* Account Section */}
          {renderSectionHeader("Account", 200)}
          {settingsData.slice(0, 2).map((item, index) => (
            <View key={item.id}>
              {renderSettingItem({ item, index: index + 2 })}
            </View>
          ))}

          {/* Preferences Section */}
          {renderSectionHeader("Preferences", 400)}
          {settingsData.slice(2, 5).map((item, index) => (
            <View key={item.id}>
              {renderSettingItem({ item, index: index + 4 })}
            </View>
          ))}

          {/* Support Section */}  
          {renderSectionHeader("Support", 600)}
          {settingsData.slice(5, 7).map((item, index) => (
            <View key={item.id}>
              {renderSettingItem({ item, index: index + 7 })}
            </View>
          ))}

          {/* Account Actions */}
          {renderSectionHeader("Account Actions", 800)}
          {settingsData.slice(7).map((item, index) => (
            <View key={item.id}>
              {renderSettingItem({ item, index: index + 9 })}
            </View>
          ))}

          {/* App Info */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 800, delay: 1000 }}
            className="mx-6 mt-8 mb-4"
          >
            <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
              <Text className="text-center text-gray-600 dark:text-gray-400 text-sm">
                MediTrack v1.0.0
              </Text>
              <Text className="text-center text-gray-500 dark:text-gray-500 text-xs mt-1">
                Made with ❤️ for better healthcare
              </Text>
            </View>
          </MotiView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
