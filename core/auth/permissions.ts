import type { AuthUser } from "./AuthProvider";
import type { Role } from "./roles";

export const canManageAllUsers = (role?: Role | null) => role === "ADMIN";
export const canManageLimitedUsers = (role?: Role | null) =>
  role === "SECRETARY";
export const canViewUsers = (role?: Role | null) =>
  canManageAllUsers(role) || canManageLimitedUsers(role);

export const canManageUserRole = (
  currentRole: Role | null | undefined,
  targetRole: Role,
) => {
  if (canManageAllUsers(currentRole)) return true;
  if (canManageLimitedUsers(currentRole))
    return targetRole === "TEACHER" || targetRole === "STUDENT";
  return false;
};

export const shouldHideSelf = (
  currentUser: AuthUser | null,
  targetUser: AuthUser,
) => !!currentUser && currentUser.id === targetUser.id;
