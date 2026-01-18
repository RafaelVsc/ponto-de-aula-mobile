export type Role = 'ADMIN' | 'SECRETARY' | 'TEACHER' | 'STUDENT' | 'AUTHOR' | 'USER';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  SECRETARY: 'Secretaria',
  TEACHER: 'Professor',
  STUDENT: 'Aluno',
  AUTHOR: 'Autor',
  USER: 'Usuário',
};

export const getRoleLabel = (role: Role | 'ALL') =>
  role === 'ALL' ? 'Todas as roles' : ROLE_LABELS[role];
