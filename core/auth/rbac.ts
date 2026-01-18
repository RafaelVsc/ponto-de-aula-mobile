import type { AuthUser } from "./AuthProvider";
import type { Role } from "./roles";

export type Action = "create" | "read" | "update" | "delete" | "manage";
export type Subject = "Post" | "User" | "all";

type Ownable = { authorId?: string };

type DynamicRule<T = Ownable> = (
  user: AuthUser,
  subject: Partial<T>,
) => boolean;

type Policy = {
  static: Partial<Record<Subject, Action[]>>;
  dynamic?: Partial<Record<Subject, Partial<Record<Action, DynamicRule>>>>;
};

const isOwner: DynamicRule = (user, subject) => {
  if (!subject?.authorId) return false;
  return user.id === subject.authorId;
};

export const policies: Record<Role, Policy> = {
  ADMIN: {
    // Admin pode criar, ler e deletar qualquer Post; editar apenas se for dono.
    static: { Post: ["create", "read", "delete"] },
    dynamic: { Post: { update: isOwner } },
  },
  SECRETARY: {
    static: {
      Post: ["create", "read"],
    },
    dynamic: {
      Post: {
        update: isOwner,
        delete: isOwner,
      },
    },
  },
  TEACHER: {
    static: {
      Post: ["create", "read"],
    },
    dynamic: {
      Post: {
        update: isOwner,
        delete: isOwner,
      },
    },
  },
  STUDENT: {
    static: {
      Post: ["read"],
    },
  },
};

export function can(
  user: AuthUser | null,
  action: Action,
  subject: Subject,
  resource?: any,
) {
  if (!user) return false;
  const policy = policies[user.role] ?? { static: {} };

  const hasGlobalManage =
    policy.static?.all?.includes("manage") ||
    policy.static?.[subject]?.includes("manage");
  if (hasGlobalManage) return true;

  const hasStatic = policy.static?.[subject]?.includes(action);
  if (hasStatic) return true;

  const dynamicRule = policy.dynamic?.[subject]?.[action];
  if (dynamicRule && resource) {
    return dynamicRule(user, resource);
  }

  return false;
}

export function canEdit(resource: Ownable, user: AuthUser | null) {
  return can(user, "update", "Post", resource);
}

export function canDelete(resource: Ownable, user: AuthUser | null) {
  return can(user, "delete", "Post", resource);
}
