import { Redirect, Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/core/auth/AuthProvider';

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return <Slot />;
}
