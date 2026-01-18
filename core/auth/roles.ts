export type Role = "ADMIN" | "SECRETARY" | "TEACHER" | "STUDENT";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  SECRETARY: "Secretaria",
  TEACHER: "Professor",
  STUDENT: "Aluno",
};

export const getRoleLabel = (role: Role | "ALL") =>
  role === "ALL" ? "Todas as roles" : ROLE_LABELS[role];
