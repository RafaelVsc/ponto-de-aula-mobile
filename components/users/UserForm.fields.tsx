import { Input } from "@/components/ui/Input";
import { getRoleLabel } from "@/core/auth/roles";
import type { Role } from "@/core/auth/roles";
import type { UserFormFields, UserFormMode } from "@/components/users/hooks/useUserForm";
import { Picker } from "@react-native-picker/picker";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Text, View } from "react-native";

type FieldProps = {
  control: Control<UserFormFields>;
  errors: FieldErrors<UserFormFields>;
};

export function NameField({ control, errors }: FieldProps) {
  return (
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
  );
}

export function EmailField({ control, errors }: FieldProps) {
  return (
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
  );
}

type UsernameFieldProps = FieldProps & {
  isCreate: boolean;
  username?: string;
};

export function UsernameField({
  control,
  errors,
  isCreate,
  username,
}: UsernameFieldProps) {
  return (
    <Controller
      control={control}
      name="username"
      render={({ field: { onChange, onBlur, value } }) =>
        isCreate ? (
          <Input
            label="Username"
            placeholder="usuário"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value ?? ""}
            autoCapitalize="none"
            error={errors.username?.message}
            icon="at-sign"
          />
        ) : (
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">
              Username
            </Text>
            <Text className="text-base text-foreground">
              {username || "—"}
            </Text>
          </View>
        )
      }
    />
  );
}

type RoleFieldProps = FieldProps & {
  isCreate: boolean;
  isSelfEdit: boolean;
  allowedRoles?: Role[];
  role?: Role;
  errorColor: string;
};

export function RoleField({
  control,
  errors,
  isCreate,
  isSelfEdit,
  allowedRoles,
  role,
  errorColor,
}: RoleFieldProps) {
  if (isSelfEdit) return null;

  return (
    <Controller
      control={control}
      name="role"
      render={({ field: { value, onChange } }) =>
        isCreate ? (
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
                {(allowedRoles ?? []).map((role) => (
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
        ) : (
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">
              Função
            </Text>
            <Text className="text-base text-foreground">
              {getRoleLabel(role ?? "")}
            </Text>
          </View>
        )
      }
    />
  );
}

type PasswordFieldProps = FieldProps & {
  isCreate: boolean;
  canEditPassword: boolean;
  mode: UserFormMode;
};

export function PasswordField({
  control,
  errors,
  isCreate,
  canEditPassword,
  mode,
}: PasswordFieldProps) {
  if (!isCreate || !canEditPassword) return null;
  return (
    <Controller
      control={control}
      name="password"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          label="Senha"
          placeholder={
            mode === "create" ? "Crie uma senha" : "Deixe em branco para manter"
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
  );
}

type ActionsProps = {
  mode: UserFormMode;
  submitting?: boolean;
  onSubmit: () => void;
  onCancel?: () => void;
  getSubmitLabel: (mode: UserFormMode) => string;
};

export function FormActions({
  mode,
  submitting,
  onSubmit,
  onCancel,
  getSubmitLabel,
}: ActionsProps) {
  return (
    <View className="mt-6 flex-row gap-3">
      <Button
        label={getSubmitLabel(mode)}
        onPress={onSubmit}
        loading={submitting}
        disabled={submitting}
        className="flex-1"
      />
      {onCancel && (
        <Button
          label="Cancelar"
          variant="secondary"
          onPress={onCancel}
          disabled={submitting}
          className="flex-1"
        />
      )}
    </View>
  );
}
