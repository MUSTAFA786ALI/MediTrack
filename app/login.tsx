import { useColorScheme } from '@/hooks/useColorScheme';
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useAuthStore } from "../src/store/authStore";

const { height } = Dimensions.get('window');

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // This enables real-time validation
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // Form persistence functions
  const saveFormData = async (data: Partial<LoginForm>) => {
    try {
      // Only save email, never save password for security
      await AsyncStorage.setItem('loginForm', JSON.stringify({ 
        email: data.email || '' 
      }));
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  };

  const loadFormData = async () => {
    try {
      const saved = await AsyncStorage.getItem('loginForm');
      if (saved) {
        const data = JSON.parse(saved);
        // Only restore email, never password
        setValue('email', data.email || '');
      }
    } catch (error) {
      console.error('Failed to load form data:', error);
    }
  };

  // Load saved form data on component mount
  useEffect(() => {
    loadFormData();
  }, []);

  // Watch email field and save it when it changes
  const emailValue = watch('email');
  useEffect(() => {
    if (emailValue) {
      saveFormData({ email: emailValue });
    }
  }, [emailValue]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    Keyboard.dismiss();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (data.email && data.password) {
        // Make login async
        await login({ email: data.email, name: "John Doe" });
        
        // Clear saved form data on successful login
        await AsyncStorage.removeItem('loginForm');
        
        console.log('🎯 Login successful, navigating to main app');
        
        // The routing will be handled automatically by _layout.tsx
        // No need to manually navigate
        
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setFocusedField(null);
  };

  // Check if form is valid (both fields filled and no errors)
  const isFormValid = isValid && emailValue && watch('password');

  return (
    <SafeAreaView className="flex-1 bg-blue-50 dark:bg-gray-900">
      <StatusBar 
        backgroundColor={colorScheme === 'dark' ? '#1F2937' : 'transparent'} 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        translucent={colorScheme === 'light'}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable onPress={dismissKeyboard} className="flex-1">
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center px-6" style={{ minHeight: height * 0.9 }}>
              
              {/* Header Section */}
              <MotiView
                from={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 800, delay: 200 }}
                className="items-center mb-12"
              >
                {/* Logo Container */}
                <View className="bg-white dark:bg-gray-800 rounded-full p-6 shadow-lg mb-6">
                  <View className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full items-center justify-center">
                    <Text className="text-white text-2xl font-bold">M</Text>
                  </View>
                </View>
                
                <Text className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</Text>
                <Text className="text-gray-600 dark:text-gray-300 text-center text-lg leading-6">
                  Sign in to access your health dashboard
                </Text>
              </MotiView>

              {/* Form Section */}
              <MotiView
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 800, delay: 400 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl mx-2"
              >
                {/* Email Field */}
                <View className="mb-6">
                  <Text className="text-gray-700 dark:text-gray-200 font-semibold mb-3 text-base">Email Address</Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className="relative">
                        <TextInput
                          className={`
                            border-2 rounded-xl px-4 py-4 text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                            ${focusedField === 'email' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}
                            ${errors.email ? 'border-red-400 dark:border-red-500' : ''}
                          `}
                          placeholder="john.doe@example.com"
                          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="email"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => {
                            onBlur();
                            setFocusedField(null);
                          }}
                          onFocus={() => setFocusedField('email')}
                        />
                        {/* Focus indicator */}
                        {focusedField === 'email' && (
                          <View className="absolute right-4 top-4">
                            <View className="w-2 h-2 bg-blue-500 rounded-full" />
                          </View>
                        )}
                      </View>
                    )}
                  />
                  {errors.email && (
                    <MotiView
                      from={{ opacity: 0, translateX: -10 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      className="mt-2"
                    >
                      <Text className="text-red-500 dark:text-red-400 text-sm">{errors.email.message}</Text>
                    </MotiView>
                  )}
                </View>

                {/* Password Field */}
                <View className="mb-8">
                  <Text className="text-gray-700 dark:text-gray-200 font-semibold mb-3 text-base">Password</Text>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View className="relative">
                        <TextInput
                          className={`
                            border-2 rounded-xl px-4 py-4 pr-12 text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                            ${focusedField === 'password' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}
                            ${errors.password ? 'border-red-400 dark:border-red-500' : ''}
                          `}
                          placeholder="Enter your password"
                          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                          secureTextEntry={!showPassword}
                          autoComplete="password"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => {
                            onBlur();
                            setFocusedField(null);
                          }}
                          onFocus={() => setFocusedField('password')}
                        />
                        {/* Show/Hide Password Button */}
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4"
                        >
                          <Text className="text-blue-600 dark:text-blue-400 font-medium">
                            {showPassword ? 'Hide' : 'Show'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.password && (
                    <MotiView
                      from={{ opacity: 0, translateX: -10 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      className="mt-2"
                    >
                      <Text className="text-red-500 dark:text-red-400 text-sm">{errors.password.message}</Text>
                    </MotiView>
                  )}
                </View>

                {/* Forgot Password */}
                <TouchableOpacity className="mb-6">
                  <Text className="text-blue-600 dark:text-blue-400 text-right font-medium">Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  className={`
                    py-4 rounded-xl items-center justify-center
                    ${isFormValid && !isLoading ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <MotiView
                      from={{ rotate: '0deg' }}
                      animate={{ rotate: '360deg' }}
                      transition={{ type: 'timing', duration: 1000, loop: true }}
                    >
                      <View className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                    </MotiView>
                  ) : (
                    <Text className={`
                      text-lg font-semibold
                      ${isFormValid ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>
              </MotiView>

              {/* Footer */}
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "timing", duration: 800, delay: 600 }}
                className="mt-8 items-center"
              >
                <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  Don't have an account?{' '}
                  <Text className="text-blue-600 dark:text-blue-400 font-semibold">Sign Up</Text>
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-xs text-center mt-4">
                  © 2025 MediTrack. Secure • Private • Trusted
                </Text>
              </MotiView>
            </View>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
