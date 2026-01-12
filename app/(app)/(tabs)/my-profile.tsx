import { useAuth } from '@/core/auth/AuthProvider';
import { Text, View } from 'react-native';

export default function MyProfileScreen() {
  const { user } = useAuth();
  const name = user?.name ?? 'Usuário';
  const email = user?.email ?? '—';

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <Text className="mb-2 text-2xl font-bold text-foreground">Meus dados</Text>
      <Text className="text-sm text-muted-foreground">Nome: {name}</Text>
      <Text className="text-sm text-muted-foreground">E-mail: {email}</Text>
      {/* Placeholder para mais campos/botões de editar */}
    </View>
  );
}
