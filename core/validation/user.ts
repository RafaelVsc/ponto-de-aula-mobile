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

export const UpdateUserSchema = BaseUserSchema.extend({
  password: z
    .string()
    .trim()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .optional(),
});

export type CreateUserFormValues = z.infer<typeof CreateUserSchema>;
export type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;

/**
 * Constrói um schema dinâmico que respeita as roles permitidas para o usuário atual.
 * No modo create exige seleção explícita; no edit apenas valida que a role existente é permitida.
 */
export function buildUserSchema(mode: "create" | "edit", allowedRoles: Role[]) {
  const roleRule = z
    .string()
    .nonempty(mode === "create" ? "Selecione uma função" : "Role obrigatória")
    .refine((val) => allowedRoles.includes(val as Role), {
      message: "Role não permitida",
    });

  const base = mode === "create" ? CreateUserSchema : UpdateUserSchema;
  return base.extend({ role: roleRule });
}
