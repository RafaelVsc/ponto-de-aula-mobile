import { useAppTheme } from './ThemeProvider';

export function useColorScheme() {
  const { colorScheme } = useAppTheme();
  return colorScheme;
}
