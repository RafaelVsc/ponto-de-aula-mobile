import { Platform } from 'react-native';

const defaultApiUrl = () => {
  if (Platform.OS === 'android') return 'http://192.168.15.130:3000'; // Android emulator -> host
  return 'http://127.0.0.1:3000'; // iOS simulator / web (localhost)
};

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_APIURL ??
  defaultApiUrl();
