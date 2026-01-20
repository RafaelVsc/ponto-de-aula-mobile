import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import type { Role } from "@/core/auth/roles";
import { getRoleLabel } from "@/core/auth/roles";
import type { User } from "@/core/types";
import {
  buildUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "@/core/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle
} from "react-native";
import Toast from "react-native-toast-message";

type UserFormMode = "create" | "edit";
type UserFormValues = CreateUserFormValues | UpdateUserFormValues;

type UserFormProps = {
  mode: UserFormMode;
  defaultValues?: Partial<User>;
  allowedRoles: Role[];
  submitting?: boolean;
  onSubmit: (values: CreateUserFormValues | UpdateUserFormValues) => void;
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
  canEditPassword?: boolean;
};

export function UserForm({
  mode,
  defaultValues,
  allowedRoles,
  submitting,
  onSubmit,
  onCancel,
  style,
  canEditPassword = true,
}: UserFormProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const errorColor = palette?.destructive ?? "#dc2626";

  const initialValues = useMemo<Partial<UserFormValues>>(
    () => ({
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      username: defaultValues?.username ?? "",
      // No edit, evita validar senha vazia; no create, começa vazio.
      password: mode === "create" ? "" : undefined,
      role: mode === "edit" ? defaultValues?.role : undefined,
    }),
    [defaultValues, mode],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(buildUserSchema(mode, allowedRoles)),
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
          render={({ field: { onChange, onBlur, value } }) =>
            mode === "edit" ? (
              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">
                  Username
                </Text>
                <Text className="text-base text-foreground">
                  {value || "—"}
                </Text>
              </View>
            ) : (
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
            )
          }
        />
        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) =>
            mode === "edit" ? (
              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">
                  Função
                </Text>
                <Text className="text-base text-foreground">
                  {getRoleLabel((value as Role) ?? "")}
                </Text>
                {errors.role?.message && (
                  <Text className="mt-1 text-xs" style={{ color: errorColor }}>
                    {errors.role.message}
                  </Text>
                )}
              </View>
            ) : (
              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">
                  Função
                </Text>
                <View className="rounded-lg border border-border bg-card">
                  <Picker
                    selectedValue={value ?? ""}
                    onValueChange={onChange}
                    prompt="Selecione"
                  >
                    <Picker.Item
                      label="Selecione uma função..."
                      value=""
                      enabled={false}
                    />
                    {allowedRoles.map((role) => (
                      <Picker.Item
                        key={role}
                        label={getRoleLabel(role)}
                        value={role}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.role?.message && (
                  <Text className="mt-1 text-xs" style={{ color: errorColor }}>
                    {errors.role.message}
                  </Text>
                )}
              </View>
            )
          }
        />

        {(mode === "create" || canEditPassword) && (
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha"
                placeholder={
                  mode === "create"
                    ? "Crie uma senha"
                    : "Deixe em branco para manter"
                }
                onChangeText={onChange}
                onBlur={onBlur}
                value={value ?? ""}
                isPassword
                error={errors.password?.message}
                icon="lock"
              />
            )}
          />
        )}
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
