import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchShipmentHistory } from "../../src/services/api";

interface ShipmentItem {
  id: string;
  date: string;
  status: string;
  quantity: string;
  trackingNumber: string;
  deliveryAddress: string;
  estimatedDelivery: string | null;
}

export default function ShipmentHistory() {
  const colorScheme = useColorScheme();
  const [refreshing, setRefreshing] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["shipments"],
    queryFn: fetchShipmentHistory,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      // Show success feedback
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleTrackShipment = (trackingNumber: string) => {
    Alert.alert(
      "Track Shipment",
      `Tracking Number: ${trackingNumber}\n\nWould you like to open the tracking page?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Track", onPress: () => console.log(`Tracking: ${trackingNumber}`) }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          dot: 'bg-green-500'
        };
      case 'shipped':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          dot: 'bg-blue-500'
        };
      case 'processing':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-700 dark:text-orange-400',
          dot: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-700 dark:text-gray-400',
          dot: 'bg-gray-500'
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'checkmark-circle';
      case 'shipped':
        return 'car';
      case 'processing':
        return 'time';
      default:
        return 'ellipse';
    }
  };

  const getDeliveredCount = () => {
    return data?.filter(item => item.status.toLowerCase() === 'delivered').length || 0;
  };

  const getInTransitCount = () => {
    return data?.filter(item => item.status.toLowerCase() === 'shipped').length || 0;
  };

  const getProcessingCount = () => {
    return data?.filter(item => item.status.toLowerCase() === 'processing').length || 0;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
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
            <Text className="text-gray-700 dark:text-gray-300 text-xl font-semibold">Loading shipment history</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">Please wait a moment...</Text>
          </MotiView>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <StatusBar 
          backgroundColor={colorScheme === 'dark' ? '#1F2937' : 'transparent'} 
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          translucent={colorScheme === 'light'}
        />
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
            <Text className="text-red-600 dark:text-red-400 text-2xl font-bold mb-3">Failed to load history</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center text-lg leading-6 mb-8">
              We couldn't load your shipment history. Please check your connection and try again.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-red-600 px-8 py-4 rounded-2xl shadow-lg active:scale-95"
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

  const renderShipmentItem = ({ item, index }: { item: ShipmentItem; index: number }) => {
    const statusColors = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 30, scale: 0.95 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 150, delay: index * 100 }}
        className="mx-6 mb-4"
      >
        <TouchableOpacity
          onPress={() => handleTrackShipment(item.trackingNumber)}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg active:scale-98"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 }}
        >
          {/* Header with Status */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View className={`w-12 h-12 ${statusColors.bg} rounded-xl items-center justify-center mr-3`}>
                <Ionicons name={statusIcon as any} size={24} color={statusColors.text.includes('green') ? '#10B981' : statusColors.text.includes('blue') ? '#3B82F6' : statusColors.text.includes('orange') ? '#F97316' : '#6B7280'} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  Shipment #{item.id.split('-')[2]}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className={`w-2 h-2 ${statusColors.dot} rounded-full mr-2`} />
                  <Text className={`font-semibold text-sm ${statusColors.text}`}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Chevron */}
            <View className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg items-center justify-center">
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </View>
          </View>

          {/* Details */}
          <View className="space-y-3">
            <View className="flex-row items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <Text className="text-gray-700 dark:text-gray-300 ml-3 font-medium">Shipment Date</Text>
              </View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="layers-outline" size={18} color="#6B7280" />
                <Text className="text-gray-700 dark:text-gray-300 ml-3 font-medium">Quantity</Text>
              </View>
              <Text className="text-gray-900 dark:text-white font-semibold">
                {item.quantity}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={18} color="#6B7280" />
                <Text className="text-gray-700 dark:text-gray-300 ml-3 font-medium">Tracking</Text>
              </View>
              <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                {item.trackingNumber.slice(-8)}
              </Text>
            </View>
          </View>

          {/* Progress Bar for Shipped Items */}
          {item.status.toLowerCase() === 'shipped' && (
            <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Delivery Progress</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Est. {item.estimatedDelivery ? new Date(item.estimatedDelivery).toLocaleDateString() : 'TBD'}
                </Text>
              </View>
              <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <View className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
              </View>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">In transit - Expected delivery in 2-3 days</Text>
            </View>
          )}

          {/* Delivered Confirmation */}
          {item.status.toLowerCase() === 'delivered' && (
            <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text className="text-sm text-green-600 dark:text-green-400 ml-2 font-medium">
                  Successfully delivered on {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </MotiView>
    );
  };

  const renderListHeader = () => (
    <MotiView
      from={{ opacity: 0, translateY: -30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      <LinearGradient
        colors={colorScheme === 'dark' ? ['#1F2937', '#374151'] : ['#3B82F6', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-8 pb-6 rounded-b-3xl mb-6"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold mb-1">
              Shipment History 📦
            </Text>
            <Text className="text-blue-100 text-lg">
              Track your medication deliveries
            </Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Enhanced Summary Stats */}
        <View className="space-y-3">
          <View className="bg-white/10 rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-lg font-semibold">Total Shipments</Text>
                <Text className="text-blue-100">This year</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{data?.length || 0}</Text>
                <Text className="text-blue-100 text-sm">deliveries</Text>
              </View>
            </View>
          </View>
          
          {/* Enhanced Stats with Icons and Processing Count */}
        <View className="flex-row space-x-2 mt-3 gap-2">
          {/* Delivered Count - Green */}
          <View className="flex-1 bg-white/10 rounded-2xl p-3 border border-green-400/20">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-green-400/20 rounded-full items-center justify-center mr-2">
                  <Ionicons name="checkmark-circle" size={12} color="#4ADE80" />
                </View>
                <Text className="text-green-200 text-xs font-medium">DELIVERED</Text>
              </View>
            </View>
            <Text className="text-white text-2xl font-bold">{getDeliveredCount()}</Text>
          </View>
          
          {/* In Transit Count - Blue */}
          <View className="flex-1 bg-white/10 rounded-2xl p-3 border border-blue-400/20">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-blue-400/20 rounded-full items-center justify-center mr-2">
                  <Ionicons name="car" size={12} color="#60A5FA" />
                </View>
                <Text className="text-blue-200 text-xs font-medium">IN TRANSIT</Text>
              </View>
            </View>
            <Text className="text-white text-2xl font-bold">{getInTransitCount()}</Text>
          </View>
          
          {/* Processing Count - Orange */}
          <View className="flex-1 bg-white/10 rounded-2xl p-3 border border-orange-400/20">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-orange-400/20 rounded-full items-center justify-center mr-2">
                  <Ionicons name="time" size={12} color="#FB923C" />
                </View>
                <Text className="text-orange-200 text-xs font-medium">PROCESSING</Text>
              </View>
            </View>
            <Text className="text-white text-2xl font-bold">{getProcessingCount()}</Text>
          </View>
        </View>
        </View>
      </LinearGradient>
    </MotiView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar 
        backgroundColor={colorScheme === 'dark' ? '#1F2937' : 'transparent'} 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        translucent={colorScheme === 'light'}
      />      
      {data && data.length > 0 ? (
        <FlashList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderShipmentItem}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
              colors={['#3B82F6']}
              progressBackgroundColor={colorScheme === 'dark' ? '#374151' : '#FFFFFF'}
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1">
          {renderListHeader()}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 150 }}
            className="flex-1 justify-center items-center px-6"
          >
            <View className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center mb-6">
              <Ionicons name="cube-outline" size={48} color="#6B7280" />
            </View>
            <Text className="text-gray-700 dark:text-gray-300 text-xl font-bold mb-2">No Shipments Found</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center text-lg leading-6">
              Your shipment history will appear here once you start receiving deliveries.
            </Text>
          </MotiView>
        </View>
      )}
    </SafeAreaView>
  );
}
