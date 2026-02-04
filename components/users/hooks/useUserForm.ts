import { useMemo } from "react";
import { useForm } from "react-hook-form";

import type { Role } from "@/core/auth/roles";
import type { User } from "@/core/types";
import {
  buildUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "@/core/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

export type UserFormMode = "create" | "edit" | "self-edit";
export type UserFormValues = CreateUserFormValues | UpdateUserFormValues;
export type UserFormFields = {
  name: string;
  email: string;
  username?: string;
  password?: string;
  role?: Role;
};

function buildInitialValues(
  mode: UserFormMode,
  defaultValues?: Partial<User>,
): Partial<UserFormFields> {
  const isCreate = mode === "create";
  return {
    name: defaultValues?.name ?? "",
    email: defaultValues?.email ?? "",
    username: isCreate ? defaultValues?.username ?? "" : undefined,
    password: isCreate ? "" : undefined,
    role: isCreate ? defaultValues?.role : undefined,
  };
}

function shapePayload(mode: UserFormMode, values: UserFormFields) {
  const payload = { ...values } as any;
  const isCreate = mode === "create";

  if (!isCreate) {
    delete payload.username;
    delete payload.role;
    if (!payload.password) {
      delete payload.password;
    }
  }

  return payload;
}

export function getSubmitLabel(mode: UserFormMode) {
  if (mode === "create") return "Criar usuário";
  if (mode === "self-edit") return "Salvar";
  return "Salvar alterações";
}

type UseUserFormParams = {
  mode: UserFormMode;
  defaultValues?: Partial<User>;
  allowedRoles?: Role[];
  onSubmit: (values: CreateUserFormValues | UpdateUserFormValues) => void;
};

export function useUserForm({
  mode,
  defaultValues,
  allowedRoles,
  onSubmit,
}: UseUserFormParams) {
  const isCreate = mode === "create";
  const isSelfEdit = mode === "self-edit";

  const initialValues = useMemo(
    () => buildInitialValues(mode, defaultValues),
    [defaultValues, mode],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormFields>({
    resolver: zodResolver(buildUserSchema(mode, allowedRoles)),
    defaultValues: initialValues,
  });

  const submitForm = handleSubmit(
    (values) => {
      onSubmit(shapePayload(mode, values));
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

  return {
    control,
    errors,
    handleSafeSubmit,
    initialValues,
    isCreate,
    isSelfEdit,
  };
}
