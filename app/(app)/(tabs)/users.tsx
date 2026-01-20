import { Fab } from "@/components/ui/Fab";
import type { Role } from "@/core/auth/roles";
import { getRoleLabel } from "@/core/auth/roles";
import { useCan } from "@/core/auth/useCan";
import { deleteUserById, fetchUsers } from "@/core/services/user.service";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function UsersScreen() {
  const {
    user: authUser,
    canViewUsers,
    canManageAllUsers,
    canManageUser,
    canManageRole,
  } = useCan();
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const viewableRoles: Role[] =
    authUser?.role === "SECRETARY"
      ? ["TEACHER", "STUDENT"]
      : ["ADMIN", "SECRETARY", "TEACHER", "STUDENT"];
  const roleOptions: (Role | "ALL")[] = ["ALL", ...viewableRoles];

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: canViewUsers(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserById(id),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Usuário removido" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Erro ao excluir usuário" });
    },
  });

  const users = data?.data ?? [];
  const visibleUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          !(authUser?.role === "ADMIN" && authUser?.id && u.id === authUser.id) &&
          viewableRoles.includes(u.role as Role),
      ),
    [authUser?.id, authUser?.role, users, viewableRoles],
  );
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return visibleUsers.filter((u) => {
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const name = u.name?.toLowerCase() ?? "";
      const email = u.email?.toLowerCase() ?? "";
      const username = u.username?.toLowerCase() ?? "";
      const matchesText =
        !term ||
        name.includes(term) ||
        email.includes(term) ||
        username.includes(term);
      return matchesRole && matchesText;
    });
  }, [roleFilter, search, visibleUsers]);
  const canCreateUser =
    canManageAllUsers() ||
    viewableRoles.some((role) => canManageRole(role));

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

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Erro ao carregar usuários.</Text>
        <Text onPress={() => refetch()}>Tentar novamente</Text>
      </View>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR");
    } catch {
      return "";
    }
  };

  const handleCreateUser = () => {
    router.push("/(app)/users/manage/new");
  };

  const handleEdit = (id: string) => {
    router.push(`/(app)/users/manage/${id}`);
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert("Excluir usuário", `Deseja excluir ${name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background px-4 py-6 relative">
      <TextInput
        placeholder="Buscar por nome, e-mail ou username"
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={setSearch}
        className="mb-4 rounded-lg border border-border bg-card px-3 py-2 text-foreground"
      />
      <View className="mb-3 flex-row flex-wrap gap-2">
        {roleOptions.map((role) => {
          const selected = roleFilter === role;
          return (
            <Pressable
              key={role}
              onPress={() => setRoleFilter(role)}
              className={`rounded-full border px-3 py-1 ${selected ? "bg-primary border-primary" : "border-border"}`}
            >
              <Text
                className={`text-xs font-semibold ${selected ? "text-white" : "text-foreground"}`}
              >
                {role === "ALL" ? "Todos" : getRoleLabel(role as Role)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(u) => u.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <View className="mb-3 rounded-lg border border-border bg-card p-3">
            <Text className="text-base font-semibold text-foreground">
              Nome: {item.name}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Email: {item.email}
            </Text>
            <Text className="text-xs text-muted-foreground">
              Função: {getRoleLabel(item.role)}
            </Text>
            <Text className="text-xs text-muted-foreground">
              Registrado em: {formatDate(item.registeredAt ?? item.updatedAt)}
            </Text>
            {canManageUser(item as any) && authUser?.role !== "SECRETARY" && (
              <View className="mt-3 flex-row gap-3">
                <Pressable onPress={() => handleEdit(item.id)}>
                  <Text className="text-primary font-semibold">Editar</Text>
                </Pressable>
                <Pressable
                  onPress={() => confirmDelete(item.id, item.name)}
                  disabled={deleteMutation.isPending}
                >
                  <Text className="text-destructive font-semibold">
                    {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                  </Text>
                </Pressable>
              </View>
            )}
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
