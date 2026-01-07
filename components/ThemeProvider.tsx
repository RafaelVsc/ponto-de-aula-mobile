import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeContextValue = {
  colorScheme: NonNullable<ColorSchemeName>;
  setColorScheme: (scheme: NonNullable<ColorSchemeName>) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const [colorScheme, setColorScheme] = useState<NonNullable<ColorSchemeName>>(systemScheme);

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      toggleColorScheme: () => setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [colorScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
