import { Button } from "@/components/ui/Button";
import { useAuth } from "@/core/auth/AuthProvider";
import { fetchMyData } from "@/core/services/user.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, View } from "react-native";

export default function MyProfileScreen() {
  const { user: authUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMyData,
    enabled: isAuthenticated,
  });

  const profile = data?.data;
  const name = profile?.name ?? authUser?.name ?? "Usuário";
  const email = profile?.email ?? "-";
  const username = profile?.username ?? "-";

  if (isError || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="mb-3 text-center text-muted-foreground">
          Não foi possível carregar seus dados.
        </Text>
        <Button label="Tentar novamente" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <Text className="text-sm text-muted-foreground">Nome: {name}</Text>
      <Text className="text-sm text-muted-foreground">E-mail: {email}</Text>
      <Text className="text-sm text-muted-foreground">
        Username: {username}
      </Text>
      {/* <Text className="text-sm text-muted-foreground">Perfil: {role}</Text> */}
      {/* Aqui você coloca o toggle de edição e o form controlado */}
    </View>
  );
}
