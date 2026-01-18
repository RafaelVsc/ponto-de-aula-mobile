import { Fab } from "@/components/ui/Fab";
import { useCan } from "@/core/auth/useCan";
import { fetchUsers } from "@/core/services/user.service";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function UsersScreen() {
  const { canViewUsers, canManageAllUsers } = useCan();
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: canViewUsers(),
  });

  if (!canViewUsers()) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="text-base font-semibold text-muted-foreground">
          Você não tem permissão para acessar esta área.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !data?.data) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Erro ao carregar usuários.</Text>
        <Text onPress={() => refetch()}>Tentar novamente</Text>
      </View>
    );
  }

  const users = data.data;
  const canCreateUser = canManageAllUsers() || canViewUsers();

  const handleCreateUser = () => {
    router.push("/(app)/users/manage/new");
  };

  return (
    <View className="flex-1 bg-background px-4 py-6 relative">
      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <View className="mb-3 rounded-lg border border-border bg-card p-3">
            <Text className="text-base font-semibold text-foreground">
              {item.name}
            </Text>
            <Text className="text-sm text-muted-foreground">{item.email}</Text>
            <Text className="text-xs text-muted-foreground">{item.role}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="mt-4 text-center text-sm text-muted-foreground">
            Nenhum usuário encontrado.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 96 }}
      />

      {canCreateUser && (
        <Fab
          onPress={handleCreateUser}
          accessibilityLabel="Adicionar usuário"
          icon={<Feather name="user-plus" size={24} color="#fff" />}
        />
      )}
    </View>
  );
}
