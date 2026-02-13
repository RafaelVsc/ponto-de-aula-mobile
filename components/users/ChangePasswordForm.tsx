import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { changeMyPassword } from "@/core/services/user.service";
import {
  ChangeMyPasswordSchema,
  type ChangePasswordFormValues,
} from "@/core/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import Toast from "react-native-toast-message";

type ChangePasswordFormProps = {
  onSuccess?: () => void;
};

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangeMyPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const isSubmitDisabled =
    !currentPassword?.trim() || !newPassword?.trim();

  const handlePress = () => {
    const currentLen = currentPassword?.trim().length ?? 0;
    const newLen = newPassword?.trim().length ?? 0;
    if (currentLen < 8 || newLen < 8) {
      Toast.show({
        type: "error",
        text1: "Dados inválidos",
        text2: "As senhas devem ter pelo menos 8 caracteres.",
      });
      return;
    }
    submitForm();
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: changeMyPassword,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Senha atualizada",
        text2: "Sua senha foi alterada com sucesso.",
      });
      reset({
        currentPassword: "",
        newPassword: "",
      });
      onSuccess?.();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Não foi possível alterar a senha.";
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: message,
      });
    },
  });

  const submitForm = handleSubmit(
    async (values) => {
      try {
        await mutateAsync(values);
      } catch {
        // onError já trata o toast; silencia para evitar erro não capturado
      }
    },
    (formErrors) => {
      const firstError =
        formErrors.currentPassword?.message ||
        formErrors.newPassword?.message ||
        "Preencha os campos obrigatórios.";
      Toast.show({
        type: "error",
        text1: "Dados inválidos",
        text2: firstError,
      });
    },
  );

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="currentPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Senha atual"
            placeholder="Digite sua senha atual"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            isPassword
            error={errors.currentPassword?.message}
            icon="lock"
          />
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nova senha"
            placeholder="Nova senha (mínimo 8 caracteres)"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            isPassword
            error={errors.newPassword?.message}
            icon="lock"
          />
        )}
      />

      <Button
        label="Atualizar senha"
        onPress={handlePress}
        loading={isPending}
        disabled={isPending || isSubmitDisabled}
      />
    </View>
  );
}
