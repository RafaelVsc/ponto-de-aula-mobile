import '@/core/validation/setup';
import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { ZodError } from 'zod';

import { Button } from '@/components/ui/Button';
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

  const onInvalid = (formErrors: any) => {
    // Pega a primeira mensagem de erro disponível para exibir no Toast
    const firstError = formErrors.identifier?.message ?? formErrors.password?.message;
    if (firstError) {
      Toast.show({
        type: 'error',
        text1: 'Dados inválidos',
        text2: firstError,
      });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = await login(values);
      await setSession(data);
      // O redirecionamento é handled pelo RootLayout ou AuthProvider
      router.replace('/(app)/(tabs)');
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
  }, onInvalid);

  // Garante captura de qualquer exceção inesperada do resolver/Zod
  const triggerSubmit = async () => {
    try {
      await onSubmit();
    } catch (err: any) {
      // Evita logar no console para erros esperados de validação
      const isZod = err instanceof ZodError || err?.name === 'ZodError';
      const firstError =
        err?.errors?.[0]?.message ??
        err?.issues?.[0]?.message ??
        'Preencha os campos obrigatórios.';

      Toast.show({
        type: 'error',
        text1: 'Dados inválidos',
        text2: firstError,
      });

      if (!isZod) {
        console.error('[login:submit-error]', err);
      }
    }
  };

  const fillDevCredentials = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setValue('identifier', 'admin@pontodeaula.com');
      setValue('password', '12345678');
    } else {
      setValue('identifier', 'student2025');
      setValue('password', '12345678');
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-background px-6 py-12">
      <View className="items-center mb-8">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-lg bg-primary shadow-sm">
          <Feather name="book-open" size={32} color="#f9fafb" />
        </View>
        <Text className="text-2xl font-bold text-foreground">Ponto de Aula</Text>
        <Text className="text-muted-foreground mt-2">Faça login para continuar</Text>
      </View>

      <View className="rounded-lg border border-border bg-card p-6 shadow-sm">
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

        <View className="h-4" />

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

        <View className="h-6" />

        <Button
          label="Entrar"
          onPress={triggerSubmit}
          loading={submitting}
          disabled={submitting}
        />
      </View>

      {__DEV__ && (
        <View className="mt-8 border-t border-border pt-6">
          <Text className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Acesso rápido (DEV)
          </Text>
          <View className="flex-row justify-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              label="Admin"
              onPress={() => fillDevCredentials('admin')}
            />
            <Button
              size="sm"
              variant="secondary"
              label="Aluno"
              onPress={() => fillDevCredentials('student')}
            />
          </View>
        </View>
      )}
    </View>
  );
}
