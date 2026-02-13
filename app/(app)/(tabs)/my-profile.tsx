import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/users/ChangePasswordForm";
import { UserForm } from "@/components/users/UserForm";
import { useAuth } from "@/core/auth/AuthProvider";
import { fetchMyData, updateMyData } from "@/core/services/user.service";
import type { User } from "@/core/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function MyProfileScreen() {
  const { user: authUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMyData,
    enabled: isAuthenticated,
  });

  const profile = data?.data ?? (authUser as User | undefined);
  const name = profile?.name ?? "Usuário";
  const email = profile?.email ?? "-";
  const username = profile?.username ?? "-";

  const updateProfileMutation = useMutation({
    mutationFn: updateMyData,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Dados atualizados",
        text2: "Suas informações foram salvas.",
      });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Não foi possível atualizar seus dados.";
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: message,
      });
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <ActivityIndicator />
      </View>
    );
  }

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1 bg-background px-4 py-6"
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        <Card title="Meus dados">
          {isEditing ? (
            <UserForm
              mode="self-edit"
              embedded
              defaultValues={profile}
              submitting={updateProfileMutation.isPending}
              onSubmit={(values) => updateProfileMutation.mutate(values)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView
              name={name}
              email={email}
              username={username}
              isRefetching={isRefetching}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </Card>

        <Card title="Alterar senha">
          <ChangePasswordForm />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type ProfileViewProps = {
  name: string;
  email: string;
  username: string;
  isRefetching: boolean;
  onEdit: () => void;
};

function ProfileView({
  name,
  email,
  username,
  isRefetching,
  onEdit,
}: ProfileViewProps) {
  return (
    <View className="gap-4">
      <View className="gap-1.5">
        <Text className="text-xs text-muted-foreground">Nome</Text>
        <Text className="text-base text-foreground">{name}</Text>
      </View>

      <View className="gap-1.5">
        <Text className="text-xs text-muted-foreground">E-mail</Text>
        <Text className="text-base text-foreground">{email}</Text>
      </View>

      <View className="gap-1.5">
        <Text className="text-xs text-muted-foreground">Username</Text>
        <Text className="text-base text-foreground">{username}</Text>
        <Text className="text-[11px] text-muted-foreground">
          Para alterar o username, entre em contato com um administrador.
        </Text>
      </View>

      <Button
        label="Editar dados"
        onPress={onEdit}
        variant="secondary"
        loading={isRefetching}
        disabled={isRefetching}
      />
    </View>
  );
}
