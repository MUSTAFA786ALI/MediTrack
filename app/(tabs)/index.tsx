import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPatientDashboard } from "../../src/services/api";

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchPatientDashboard,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleReorder = () => {
    Alert.alert(
      "Reorder Medication",
      "Would you like to reorder your current medication?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reorder", onPress: () => console.log("Reordering...") }
      ]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      "Contact Support",
      "How would you like to contact our support team?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Calling support...") },
        { text: "Chat", onPress: () => console.log("Starting chat...") }
      ]
    );
  };

  const handleReports = () => {
    Alert.alert(
      "Medical Reports",
      "View your medical history and reports",
      [
        { text: "Cancel", style: "cancel" },
        { text: "View Reports", onPress: () => console.log("Opening reports...") }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <StatusBar 
          backgroundColor={colorScheme === 'dark' ? '#1F2937' : 'transparent'} 
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          translucent={colorScheme === 'light'}
        />
          <View className="flex-1 justify-center items-center">
          <MotiView
            from={{ scale: 0.8, opacity: 0, rotate: '0deg' }}
            animate={{ scale: 1, opacity: 1, rotate: '360deg' }}
            transition={{ type: "timing", duration: 1000, loop: true }}
            className="items-center mb-6"
          >
            <View className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full items-center justify-center shadow-lg">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          </MotiView>
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800, delay: 200 }}
          >
            <Text className="text-gray-700 dark:text-gray-300 text-xl font-semibold">Loading your dashboard</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">Please wait a moment...</Text>
          </MotiView>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900/20">
        <View className="flex-1 justify-center items-center px-6">
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 150 }}
            className="items-center"
          >
            <MotiView
              from={{ rotate: '0deg' }}
              animate={{ rotate: '10deg' }}
              transition={{ type: "timing", duration: 100, loop: true, repeatReverse: true }}
            >
              <View className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mb-6 shadow-lg">
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
              </View>
            </MotiView>
            <Text className="text-red-600 dark:text-red-400 text-2xl font-bold mb-3">Oops! Something went wrong</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center text-lg leading-6 mb-8">
              We couldn't load your dashboard data. Please check your connection and try again.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-red-600 px-8 py-4 rounded-2xl shadow-lg active:scale-95"
              style={{ transform: [{ scale: 1 }] }}
            >
              <View className="flex-row items-center">
                <Ionicons name="refresh" size={20} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Try Again</Text>
              </View>
            </TouchableOpacity>
          </MotiView>
        </View>
      </SafeAreaView>
    );
  }

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
            progressBackgroundColor={colorScheme === 'dark' ? '#374151' : '#FFFFFF'}
          />
        }
      >
        {/* Enhanced Header with Gradient */}
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <LinearGradient
            colors={colorScheme === 'dark' ? ['#1F2937', '#374151'] : ['#3B82F6', '#1D4ED8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 pt-8 pb-6 rounded-b-3xl"
          >
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white text-3xl font-bold mb-1">
                  Hello, {data?.fullName?.split(' ')[0] || 'Patient'} 👋
                </Text>
              </View>
              <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                <Ionicons name="notifications" size={24} color="white" />
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">3</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Health Score */}
            <View className="bg-white/10 rounded-2xl p-4 mt-2 mb-10">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-lg font-semibold">Health Score</Text>
                  <Text className="text-blue-100">Everything looks great!</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white text-3xl font-bold">98</Text>
                  <Text className="text-blue-100 text-sm">/ 100</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Enhanced Quick Stats with Better Animation */}
        <View className="px-6 -mt-10 mb-6">
          <View className="flex-row justify-between">
            <MotiView
              from={{ opacity: 0, translateY: 50, scale: 0.8 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 150, delay: 300 }}
              className="flex-1 mr-3"
            >
              <TouchableOpacity 
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20 }}
              >
                <View className="items-center">
                  <View className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl items-center justify-center mb-4">
                    <Ionicons name="medical" size={32} color="#3B82F6" />
                  </View>
                  <Text className="text-gray-900 dark:text-white text-3xl font-bold">
                    {data?.remainingMedication?.split(' ')[0] || '30'}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pills Remaining</Text>
                  <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <View className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
            
            <MotiView
              from={{ opacity: 0, translateY: 50, scale: 0.8 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 150, delay: 400 }}
              className="flex-1 ml-3"
            >
              <TouchableOpacity 
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20 }}
              >
                <View className="items-center">
                  <View className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl items-center justify-center mb-4">
                    <Ionicons name="calendar-clear" size={32} color="#10B981" />
                  </View>
                  <Text className="text-gray-900 dark:text-white text-3xl font-bold">5</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium">Days Until Delivery</Text>
                  <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <View className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          </View>
        </View>

        {/* Patient Information Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 400 }}
          className="mx-6 mb-6"
        >
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  Patient Information
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  Personal details
                </Text>
              </View>
            </View>
            
            <View className="space-y-4">
              <InfoRow
                label="Full Name"
                value={data?.fullName || 'N/A'}
                icon="person-outline"
              />
              <InfoRow
                label="Patient ID"
                value={data?.patientId || 'N/A'}
                icon="card-outline"
              />
              <InfoRow
                label="Current Plan"
                value={data?.currentPlan || 'N/A'}
                icon="medical-outline"
              />
            </View>
          </View>
        </MotiView>

        {/* Medication Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 500 }}
          className="mx-6 mb-6"
        >
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full items-center justify-center mr-4">
                <Ionicons name="medkit" size={24} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  Medication Status
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  Current supply information
                </Text>
              </View>
            </View>
            
            <View className="space-y-4">
              <InfoRow
                label="Next Delivery"
                value={data?.nextDeliveryDate ? new Date(data.nextDeliveryDate).toLocaleDateString() : 'N/A'}
                icon="calendar-outline"
              />
              <InfoRow
                label="Remaining Supply"
                value={data?.remainingMedication || 'N/A'}
                icon="layers-outline"
              />
            </View>
          </View>
        </MotiView>

        {/* Status Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 600, delay: 600 }}
          className="mx-6 mb-6"
        >
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mr-4">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  Account Status
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  Everything looks good
                </Text>
              </View>
            </View>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="person-circle-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 dark:text-gray-300 ml-3 font-medium">Account</Text>
                </View>
                <View className="flex-row items-center">
                  <View className={`w-2 h-2 rounded-full mr-2 ${data?.status?.active ? 'bg-green-500' : 'bg-red-500'}`} />
                  <Text className={`font-semibold ${data?.status?.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {data?.status?.active ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="card-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 dark:text-gray-300 ml-3 font-medium">Billing</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <Text className="text-green-600 dark:text-green-400 font-semibold">{data?.status?.billing || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Enhanced Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 150, delay: 800 }}
          className="mx-6 mb-8"
        >
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</Text>
          <View className="space-y-4">
            <TouchableOpacity
              onPress={handleReorder}
              className="bg-blue-500 rounded-2xl p-6 shadow-lg active:scale-98"
              style={{ shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="refresh" size={24} color="white" />
                  </View>
                  <View>
                    <Text className="text-white text-lg font-bold">Reorder Medication</Text>
                    <Text className="text-blue-100">Get your next supply delivered</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </View>
            </TouchableOpacity>

            <View className="flex-row space-x-4 mt-5 gap-4">
              <TouchableOpacity
                onPress={handleSupport}
                className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <View className="items-center">
                  <View className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl items-center justify-center mb-2">
                    <Ionicons name="chatbubble-ellipses" size={24} color="#8B5CF6" />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-bold">Support</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm text-center">Get help</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleReports}
                className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <View className="items-center">
                  <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl items-center justify-center mb-2">
                    <Ionicons name="document-text" size={24} color="#6366F1" />
                  </View>
                  <Text className="text-gray-900 dark:text-white font-bold">Reports</Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm text-center">View history</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for info rows
function InfoRow({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center flex-1">
        <Ionicons name={icon} size={20} color="#6B7280" />
        <Text className="text-gray-700 dark:text-gray-300 ml-3 font-medium">{label}</Text>
      </View>
      <Text className="text-gray-900 dark:text-white font-semibold text-right flex-1" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
