import { z } from 'zod';

const identifierSchema = z
  .string()
  .trim()
  .min(1, 'E-mail ou usuário é obrigatório')
  .superRefine((value, ctx) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const isEmail = trimmed.includes('@');

    if (isEmail) {
      const emailCheck = z.email().safeParse(trimmed);
      if (!emailCheck.success) {
        ctx.addIssue({
          code: 'custom',
          message: 'E-mail inválido',
        });
      }
      return;
    }

    if (trimmed.length < 3) {
      ctx.addIssue({
        code: 'custom',
        type: 'string',
        minimum: 3,
        inclusive: true,
        message: 'Usuário deve ter pelo menos 3 caracteres',
      });
    }
  });

export const LoginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
