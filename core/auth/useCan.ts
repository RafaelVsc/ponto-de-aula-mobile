import { useAuth } from "./AuthProvider";
import type { Action, Subject } from "./rbac";
import { can } from "./rbac";
import {
  canManageAllUsers,
  canManageLimitedUsers,
  canManageUserRole,
  canViewUsers,
} from "./permissions";
import type { AuthUser } from "./AuthProvider";
import type { Role } from "./roles";

export function useCan() {
  const { user } = useAuth();

  const canFn = (action: Action, subject: Subject, resource?: any) =>
    can(user, action, subject, resource);

  const canManageRole = (targetRole: Role) =>
    canManageUserRole(user?.role, targetRole);

  const canManageUser = (targetUser?: AuthUser | null) => {
    if (!targetUser) return false;
    return canManageUserRole(user?.role, targetUser.role);
  };

  const canViewUsersList = () => canViewUsers(user?.role);

  const canEditSelf = (targetUserId?: string) =>
    !!user?.id && targetUserId === user.id;

  return {
    user,
    can: canFn,
    canEdit: (resource: any) => canFn("update", "Post", resource),
    canDelete: (resource: any) => canFn("delete", "Post", resource),
    canCreateUser: canManageRole,
    canManageRole,
    canManageUser,
    canManageUserRole: (targetRole: Role) =>
      canManageUserRole(user?.role, targetRole),
    canViewUsers: canViewUsersList,
    canEditSelf,
    canManageAllUsers: () => canManageAllUsers(user?.role),
  };
}
