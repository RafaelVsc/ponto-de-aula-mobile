import { useColorScheme } from "@/components/useColorScheme";
import {
  EmailField,
  FormActions,
  NameField,
  PasswordField,
  RoleField,
  UsernameField,
} from "@/components/users/UserForm.fields";
import {
  getSubmitLabel,
  type UserFormMode,
  type UserFormValues,
  useUserForm,
} from "@/components/users/hooks/useUserForm";
import Colors from "@/constants/Colors";
import type { Role } from "@/core/auth/roles";
import type { User } from "@/core/types";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";

type UserFormProps = {
  mode: UserFormMode;
  defaultValues?: Partial<User>;
  allowedRoles?: Role[];
  submitting?: boolean;
  onSubmit: (values: UserFormValues) => void;
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
  canEditPassword?: boolean;
  embedded?: boolean;
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
  embedded = false,
}: UserFormProps) {
  const { control, errors, handleSafeSubmit, isCreate, isSelfEdit } =
    useUserForm({
      mode,
      defaultValues,
      allowedRoles,
      onSubmit,
    });

  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const errorColor = palette?.destructive ?? "#dc2626";

  const content = (
    <>
      <View className="gap-4">
        <NameField control={control} errors={errors} />
        <EmailField control={control} errors={errors} />
        <UsernameField
          control={control}
          errors={errors}
          isCreate={isCreate}
          username={defaultValues?.username}
        />
        <RoleField
          control={control}
          errors={errors}
          isCreate={isCreate}
          isSelfEdit={isSelfEdit}
          allowedRoles={allowedRoles}
          role={defaultValues?.role}
          errorColor={errorColor}
        />
        <PasswordField
          control={control}
          errors={errors}
          isCreate={isCreate}
          canEditPassword={canEditPassword}
          mode={mode}
        />
      </View>

      <FormActions
        mode={mode}
        submitting={submitting}
        onSubmit={handleSafeSubmit}
        onCancel={onCancel}
        getSubmitLabel={getSubmitLabel}
      />
    </>
  );

  if (embedded) {
    return <View style={style}>{content}</View>;
  }

  return (
    <ScrollView
      className="bg-background px-4 py-6"
      contentContainerStyle={[{ paddingBottom: 24 }, style]}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  );
}
