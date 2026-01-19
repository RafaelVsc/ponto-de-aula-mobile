import { api } from "../api/client";

import type {
  ApiResponse,
  ChangePasswordPayload,
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "../types/index";

// qualquer usuário autenticado
export function fetchMyData(): Promise<ApiResponse<User>> {
  return api.get<ApiResponse<User>>("/users/me");
}

export function updateMyData(
  payload: UpdateUserPayload,
): Promise<ApiResponse<User>> {
  return api.patch<ApiResponse<User>>("/users/me", payload);
}

export function changeMyPassword(
  payload: ChangePasswordPayload,
): Promise<ApiResponse<{ status?: string; message?: string }>> {
  return api.put<ApiResponse<{ status?: string; message?: string }>>(
    "/users/me/password",
    payload,
  );
}

// ADMIN
// get ususarios
export function fetchUsers(): Promise<ApiResponse<User[]>> {
  return api.get<ApiResponse<User[]>>("/users");
}

export function createUser(
  payload: CreateUserPayload,
): Promise<ApiResponse<User>> {
  return api.post<ApiResponse<User>>("users", payload);
}

export function getUserById(id: string): Promise<ApiResponse<User>> {
  return api.get<ApiResponse<User>>(`/users/${id}`);
}

export function updateUserById(
  id: string,
  payload: UpdateUserPayload,
): Promise<ApiResponse<User>> {
  return api.patch<ApiResponse<User>>(`/users/${id}`, payload);
}

export function deleteUserById(id: string): Promise<ApiResponse<void>> {
  return api.delete<ApiResponse<void>>(`/users/${id}`);
}
