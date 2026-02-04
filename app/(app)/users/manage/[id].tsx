import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { Card } from "@/components/ui/Card";
import { UserForm } from "@/components/users/UserForm";
import { Role } from "@/core/auth/roles";
import { useCan } from "@/core/auth/useCan";
import {
  createUser,
  getUserById,
  updateUserById,
} from "@/core/services/user.service";
import type {
  CreateUserFormValues,
  UpdateUserFormValues,
} from "@/core/validation/user";

export default function ManageUsersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isCreate = !id || id === "new";
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { canManageRole, canManageUser, canEditSelf } = useCan();
  const insets = useSafeAreaInsets();

  const allowedRoles = useMemo<Role[]>(
    () =>
      (["ADMIN", "SECRETARY", "TEACHER", "STUDENT"] as Role[]).filter((r) =>
        canManageRole(r),
      ),
    [canManageRole],
  );

  const {
    data,
    isLoading,
    isError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: !isCreate && !!id,
  });

  const existingUser = data?.data;

  useEffect(() => {
    navigation.setOptions({
      title: isCreate ? "Novo usuário" : "Editar usuário",
      headerBackTitle: "Voltar",
    });
  }, [navigation, isCreate]);

  useEffect(() => {
    if (!isCreate && existingUser && !canManageUser(existingUser)) {
      Toast.show({
        type: "error",
        text1: "Acesso negado",
        text2: "Você não pode gerenciar este usuário.",
      });
      router.back();
    }
  }, [isCreate, existingUser, canManageUser]);

  const handleSubmit = async (
    values: CreateUserFormValues | UpdateUserFormValues,
  ) => {
    // Em criação, impedir se a role alvo não for permitida
    if (!canManageRole(values.role)) {
      Toast.show({
        type: "error",
        text1: "Acesso negado",
        text2: "Role não permitida para seu perfil.",
      });
      return;
    }

    try {
      if (isCreate) {
        const payload = values as CreateUserFormValues;
        await createUser({
          name: payload.name,
          email: payload.email,
          username: payload.username,
          password: payload.password,
          role: payload.role,
        });
        Toast.show({ type: "success", text1: "Usuário criado" });
      } else if (id) {
        // password pode estar vazio; não envia campo não preenchido
        const { password, ...rest } = values as UpdateUserFormValues;
        await updateUserById(id, rest);
        Toast.show({ type: "success", text1: "Usuário atualizado" });
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.back();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível salvar o usuário.",
      });
    }
  };

  if (!allowedRoles.length) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark px-4">
        <Text className="text-center text-base font-semibold text-muted-foreground dark:text-muted-foreground-dark">
          Você não tem permissão para criar ou editar usuários.
        </Text>
      </View>
    );
  }

  if (!isCreate && isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark px-4">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isCreate && (isError || !existingUser)) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark px-4">
        <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
          Não foi possível carregar o usuário.
        </Text>
        <Text
          className="text-primary font-semibold"
          onPress={() => refetchUser()}
        >
          Tentar novamente
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 64}
    >
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark px-4 py-6"
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Card title={isCreate ? "Novo usuário" : "Editar usuário"}>
          <UserForm
            mode={isCreate ? "create" : "edit"}
            embedded
            defaultValues={existingUser ?? undefined}
            allowedRoles={allowedRoles}
            canEditPassword={
              isCreate || (!!existingUser && canEditSelf(existingUser.id))
            }
            onSubmit={handleSubmit}
            onCancel={() => router.replace("/(app)/(tabs)/users")}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
