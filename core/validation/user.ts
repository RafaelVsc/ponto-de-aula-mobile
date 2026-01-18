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
