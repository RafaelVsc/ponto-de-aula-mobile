import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'pda_token';
const USER_KEY = 'pda_user';

import type { Role } from './roles';

type StoredUser = {
  id: string;
  name: string;
  role: Role;
};

export type StoredSession = {
  token: string;
  user: StoredUser;
};

export async function saveSession(session: StoredSession) {
  const token = `${session.token}`;
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const [token, userJson] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(USER_KEY),
    ]);

    if (!token || !userJson) return null;

    const user = JSON.parse(userJson) as StoredUser;
    return { token, user };
  } catch {
    return null;
  }
}

export async function clearSession() {
  await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(USER_KEY)]);
}
