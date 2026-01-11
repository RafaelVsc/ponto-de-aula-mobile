import { useState } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import colors from 'tailwindcss/colors';

import { cn } from '@/lib/utils';

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
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const secureTextEntry = isPassword && !showPassword;

  return (
    <View className="w-full">
      {label && <Text className="mb-1.5 text-sm font-medium text-slate-700">{label}</Text>}

      <View
        className={cn(
          'flex-row items-center rounded-lg border bg-white px-3',
          isFocused ? 'border-slate-900 ring-2 ring-slate-200' : 'border-slate-200',
          error && 'border-red-500 ring-0',
          className
        )}
      >
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={error ? colors.red[500] : colors.slate[400]}
            style={{ marginRight: 8 }}
          />
        )}

        <TextInput
          className="flex-1 py-3 text-base leading-none text-slate-900"
          placeholderTextColor={colors.slate[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          {...props}
        />

        {isPassword && (
          <Pressable onPress={() => setShowPassword((prev) => !prev)} className="p-1">
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={colors.slate[400]}
            />
          </Pressable>
        )}
      </View>

      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
