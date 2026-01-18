import { useAuth } from '@/core/auth/AuthProvider';
import { Text, View } from 'react-native';

export default function UsersScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-4 py-6">
      <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
        Lista de usuários
      </Text>
      {/* Placeholder para mais campos/botões de editar */}
    </View>
  );
}
