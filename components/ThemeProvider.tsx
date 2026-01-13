import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

const THEME_STORAGE_KEY = '@PontoDeAula:theme';

type ThemeContextValue = {
  colorScheme: NonNullable<ColorSchemeName>;
  setColorScheme: (scheme: NonNullable<ColorSchemeName>) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'light';
  const { setColorScheme: setNativeWindScheme } = useNativeWindColorScheme();
  
  // Inicia com undefined para saber que ainda não carregou do storage
  const [colorScheme, setColorSchemeState] = useState<NonNullable<ColorSchemeName> | undefined>(undefined);

  // 1. Carregar tema salvo ao iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setColorSchemeState(savedTheme);
          setNativeWindScheme(savedTheme);
        } else {
          // Se não tem salvo, usa o do sistema
          setColorSchemeState(systemScheme);
          setNativeWindScheme(systemScheme);
        }
      } catch (error) {
        console.log('Erro ao carregar tema:', error);
        setColorSchemeState(systemScheme);
      }
    };
    loadTheme();
  }, []); // Executa apenas uma vez no mount

  // 2. Função para alterar e salvar o tema
  const setTheme = async (newTheme: NonNullable<ColorSchemeName>) => {
    setColorSchemeState(newTheme);
    setNativeWindScheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };

  const toggleColorScheme = async () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  };

  const value = useMemo(
    () => ({
      colorScheme: colorScheme ?? systemScheme, // Fallback visual enquanto carrega
      setColorScheme: setTheme,
      toggleColorScheme,
    }),
    [colorScheme, systemScheme]
  );

  // Evita renderizar children com tema errado (opcional, mas evita flicker drástico)
  // Se quiser renderizar instantâneo assumindo system, remova este if.
  if (colorScheme === undefined) {
    return null; 
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
