import { Ionicons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
        ...errorInfo
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
          <View className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mb-6">
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
          </View>
          
          <Text className="text-red-600 dark:text-red-400 text-2xl font-bold mb-3 text-center">
            Something went wrong
          </Text>
          
          <Text className="text-gray-600 dark:text-gray-400 text-center text-lg leading-6 mb-8">
            We've been notified and are working on a fix.
          </Text>
          
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: undefined })}
            className="bg-blue-600 px-8 py-4 rounded-2xl shadow-lg"
          >
            <Text className="text-white font-bold text-lg">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}