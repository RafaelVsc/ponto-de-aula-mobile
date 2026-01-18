import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import type { Role } from "@/core/auth/roles";
import type { User } from "@/core/types";
import {
  CreateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
  UpdateUserSchema,
} from "@/core/validation/user";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type UserFormMode = "create" | "edit";

type UserFormProps = {
  mode: UserFormMode;
  defaultValues?: Partial<User>;
  allowedRoles: Role[];
  submitting?: boolean;
  onSubmit: (values: CreateUserFormValues | UpdateUserFormValues) => void;
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function UserForm({
  mode,
  defaultValues,
  allowedRoles,
  submitting,
  onSubmit,
  onCancel,
  style,
}: UserFormProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const errorColor = palette?.destructive ?? "#dc2626";

  const schema = mode === "create" ? CreateUserSchema : UpdateUserSchema;

  const initialValues = useMemo<CreateUserFormValues | UpdateUserFormValues>(
    () => ({
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      username: defaultValues?.username ?? "",
      password: "",
      role: defaultValues?.role ?? allowedRoles[0] ?? "STUDENT",
    }),
    [allowedRoles, defaultValues],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const submitForm = handleSubmit(
    (values) => {
      const payload = { ...values };
      if (mode === "edit" && !payload.password) {
        delete (payload as any).password;
      }
      onSubmit(payload);
    },
    (formErrors) => {
      const firstError =
        formErrors.name?.message ||
        formErrors.email?.message ||
        formErrors.username?.message ||
        formErrors.password?.message ||
        formErrors.role?.message;
      if (firstError) {
        Toast.show({
          type: "error",
          text1: "Dados inválidos",
          text2: firstError,
        });
      }
    },
  );

  const handleSafeSubmit = async () => {
    try {
      await submitForm();
    } catch (err: any) {
      const firstError =
        err?.issues?.[0]?.message ??
        err?.errors?.[0]?.message ??
        "Preencha os campos obrigatórios.";
      Toast.show({
        type: "error",
        text1: "Dados inválidos",
        text2: firstError,
      });
    }
  };

  return (
    <ScrollView
      className="bg-background px-4 py-6"
      contentContainerStyle={[{ paddingBottom: 24 }, style]}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nome"
              placeholder="Nome completo"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
              icon="user"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="E-mail"
              placeholder="email@exemplo.com"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              icon="mail"
            />
          )}
        />

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Username"
              placeholder="usuário"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              autoCapitalize="none"
              error={errors.username?.message}
              icon="at-sign"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Senha"
              placeholder={mode === "create" ? "Crie uma senha" : "Deixe em branco para manter"}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              isPassword
              error={errors.password?.message}
              icon="lock"
            />
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">
                Role
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {allowedRoles.map((role) => {
                  const selected = value === role;
                  return (
                    <Pressable
                      key={role}
                      onPress={() => onChange(role)}
                      className={`rounded-full border px-3 py-1 ${
                        selected ? "bg-primary border-primary" : "border-border"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          selected ? "text-white" : "text-foreground"
                        }`}
                      >
                        {role}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {errors.role?.message && (
                <Text className="mt-1 text-xs" style={{ color: errorColor }}>
                  {errors.role.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      <View className="mt-6 flex-row gap-3">
        <Button
          label={mode === "create" ? "Criar usuário" : "Salvar alterações"}
          onPress={handleSafeSubmit}
          loading={submitting}
          disabled={submitting}
          className="flex-1"
        />
        <Button
          label="Cancelar"
          variant="secondary"
          onPress={onCancel}
          disabled={submitting}
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
}
