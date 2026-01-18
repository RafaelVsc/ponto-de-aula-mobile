import { useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { cn } from '@/lib/utils';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  icon,
  isPassword,
  className,
  accessibilityLabel,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const errorColor = palette?.destructive ?? '#dc2626';
  const borderColor = error ? errorColor : isFocused ? palette.ring : palette.border;

  const secureTextEntry = isPassword && !showPassword;

  return (
    <View className="w-full">
      {label && <Text className="mb-1.5 text-sm font-medium text-foreground">{label}</Text>}

      <View
        className={cn(
          'flex-row items-center rounded-lg border bg-card px-3',
          className
        )}
        style={{
          borderColor,
          borderWidth: 1,
        }}
      >
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={error ? errorColor : palette.muted}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          className="flex-1 py-3 text-base leading-none text-foreground"
          placeholderTextColor={palette.mutedForeground}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          accessibilityLabel={accessibilityLabel ?? label ?? props.placeholder}
          {...props}
        />

        {isPassword && (
          <Pressable onPress={() => setShowPassword((prev) => !prev)} className="p-1">
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={palette.muted}
            />
          </Pressable>
        )}
      </View>

      {error && <Text className="mt-1 text-xs" style={{ color: errorColor }}>{error}</Text>}
    </View>
  );
}
