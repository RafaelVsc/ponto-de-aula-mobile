export type Role = "ADMIN" | "SECRETARY" | "TEACHER" | "STUDENT";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  SECRETARY: "Secretaria",
  TEACHER: "Professor",
  STUDENT: "Aluno",
};

export const getRoleLabel = (role?: Role | "ALL" | "") => {
  if (!role) return "—";
  if (role === "ALL") return "Todas as roles";
  return ROLE_LABELS[role] ?? String(role);
};
