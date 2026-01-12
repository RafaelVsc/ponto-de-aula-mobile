import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useSystemColorScheme, View } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

type ThemeContextValue = {
  colorScheme: NonNullable<ColorSchemeName>;
  setColorScheme: (scheme: NonNullable<ColorSchemeName>) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const [colorScheme, setColorScheme] = useState<NonNullable<ColorSchemeName>>(systemScheme);
  const nativewind = useNativeWindColorScheme();

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      toggleColorScheme: () => setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [colorScheme]
  );

  useEffect(() => {
    nativewind.setColorScheme(colorScheme as 'light' | 'dark');
  }, [colorScheme, nativewind]);

  return (
    <ThemeContext.Provider value={value}>
      <View className={colorScheme === 'dark' ? 'dark flex-1' : 'flex-1'}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
