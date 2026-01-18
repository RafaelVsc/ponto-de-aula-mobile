import type { AuthUser } from '../auth/AuthProvider';
import { api, setAuthToken } from '../api/client';
import type { LoginFormValues } from '../validation/auth';
import type { ApiResponse } from '../types';

export type LoginPayload = LoginFormValues;

export type LoginData = {
  token: string;
  user: AuthUser;
};

export async function login(payload: LoginPayload): Promise<LoginData> {
  const identifier = payload.identifier.trim();
  const isEmail = identifier.includes('@');
  const body = isEmail
    ? { email: identifier, password: payload.password }
    : { username: identifier, password: payload.password };
  const res = await api.post<ApiResponse<LoginData>>('/auth/login', body);
  const token = res?.data?.token;
  const user = res?.data?.user;

  if (!token) {
    if (__DEV__) {
      console.log('[login:missing-token]', res);
    }
    throw new Error('Token ausente na resposta de login');
  }

  // Se o backend não devolver o usuário junto, busca no /users/me após setar o token.
  let resolvedUser = user;
  if (!resolvedUser) {
    try {
      setAuthToken(token);
      const me = await fetchCurrentUser();
      resolvedUser = me;
    } catch (err) {
      if (__DEV__) {
        console.log('[login:fetch-me-error]', err);
      }
    }
  }

  if (!resolvedUser) {
    throw new Error('Usuário ausente na resposta de login');
  }

  return { token: `${token}`, user: resolvedUser };
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await api.get<ApiResponse<AuthUser>>('/users/me');
  return res.data;
}
