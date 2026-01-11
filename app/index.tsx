import '@/core/validation/setup';
import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Input } from '@/components/ui/Input';
import { useAuth } from '@/core/auth/AuthProvider';
import { login } from '@/core/services/auth.service';
import { LoginSchema, type LoginFormValues } from '@/core/validation/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { setSession, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = await login(values);
      await setSession(data);
      router.replace('/(tabs)');
    } catch (err) {
      console.log('[login:error]', err);
      Toast.show({
        type: 'error',
        text1: 'Erro ao entrar',
        text2: 'Verifique suas credenciais e tente novamente.',
      });
    } finally {
      setSubmitting(false);
    }
  });

  const fillDevCredentials = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setValue('identifier', 'admin@pontodeaula.com');
      setValue('password', '12345678');
    } else {
      setValue('identifier', 'aluno@pontodeaula.com');
      setValue('password', '12345678');
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6 py-12">
      <View className="items-center mb-8">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-xl bg-slate-900">
          <Feather name="book-open" size={32} color="white" />
        </View>
        <Text className="text-2xl font-bold text-slate-900">Ponto de Aula</Text>
        <Text className="text-slate-500">Faça login para continuar</Text>
      </View>

      <View className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="E-mail ou usuário"
              placeholder="ex: voce@escola.com"
              icon="mail"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.identifier?.message}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Senha"
              placeholder="••••••••"
              isPassword
              icon="lock"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <Pressable
          className={`mt-2 items-center justify-center rounded-lg bg-slate-900 py-3.5 active:opacity-90 ${
            submitting ? 'opacity-70' : ''
          }`}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-white">Entrar</Text>
          )}
        </Pressable>
      </View>

      {__DEV__ && (
        <View className="mt-8 border-t border-slate-200 pt-6">
          <Text className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
            Acesso rápido (DEV)
          </Text>
          <View className="flex-row justify-center gap-3">
            <Pressable
              onPress={() => fillDevCredentials('admin')}
              className="rounded-full bg-blue-100 px-4 py-2"
            >
              <Text className="text-xs font-bold text-blue-700">Professor</Text>
            </Pressable>
            <Pressable
              onPress={() => fillDevCredentials('student')}
              className="rounded-full bg-green-100 px-4 py-2"
            >
              <Text className="text-xs font-bold text-green-700">Aluno</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
