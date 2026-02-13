import type { Role } from "@/core/auth/roles";
import { z } from "zod";

const RolesEnum = z.enum(["ADMIN", "SECRETARY", "TEACHER", "STUDENT"]);

const BaseUserSchema = z.object({
  name: z.string().trim().min(3, "Nome é obrigatório"),
  email: z.string().trim().email("E-mail inválido"),
  username: z
    .string()
    .trim()
    .min(3, "Username deve ter pelo menos 3 caracteres"),
  password: z
    .string()
    .trim()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .optional(),
  role: RolesEnum,
});

export const CreateUserSchema = BaseUserSchema.extend({
  password: z
    .string()
    .trim()
    .min(8, "Senha é obrigatória e deve ter pelo menos 8 caracteres"),
});

export const UpdateUserSchema = BaseUserSchema.pick({ name: true, email: true });

export const SelfUpdateUserSchema = UpdateUserSchema;

export const ChangeMyPasswordSchema = z
  .object({
    currentPassword: z.string().trim().min(8, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .trim()
      .min(8, "Senha é obrigatória e deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

export type CreateUserFormValues = z.infer<typeof CreateUserSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordFormValues = z.infer<typeof ChangeMyPasswordSchema>;
export type SelfUpdateUserFormValues = z.infer<typeof SelfUpdateUserSchema>;

/**
 * Constrói um schema dinâmico que respeita as roles permitidas para o usuário atual.
 * No modo create exige seleção explícita; no edit apenas valida que a role existente é permitida.
 */
export function buildUserSchema(
  mode: "create" | "edit" | "self-edit",
  allowedRoles?: Role[],
) {
  if (mode === "create") {
    const roleRule = z
      .string()
      .nonempty("Selecione uma função")
      .refine(
        (val) => (allowedRoles ?? []).includes(val as Role),
        { message: "Role não permitida" },
      );

    return CreateUserSchema.extend({ role: roleRule });
  }

  return UpdateUserSchema;
}
