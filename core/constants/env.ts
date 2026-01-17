import { Platform } from 'react-native';

const defaultApiUrl = () => {
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000'; // Android emulator -> host loopback
  return 'http://127.0.0.1:3000'; // iOS simulator / web (localhost)
};

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_APIURL ??
  defaultApiUrl();
