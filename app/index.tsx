import '@/core/validation/setup';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuth } from '@/core/auth/AuthProvider';
import { login } from '@/core/services/auth.service';
import { LoginSchema, type LoginFormValues } from '../core/validation/auth';

export default function LoginScreen() {
  const { setSession, loading: authLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const [submitting, setSubmitting] = useState(false);

  const onInvalid = (formErrors: FieldErrors<LoginFormValues>) => {
    const firstError = formErrors.identifier?.message ?? formErrors.password?.message;
    if (firstError) {
      Toast.show({
        type: 'error',
        text1: 'Dados inválidos',
        text2: firstError,
      });
    }
  };

  const submit = handleSubmit(async (values) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = await login(values);
      await setSession(data);
      // Redirecionamento é automático pelo _layout.tsx ao detectar isAuthenticated=true
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

  if (authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <View style={styles.field}>
        <Text style={styles.label}>E-mail ou usuário</Text>
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.identifier && styles.inputError]}
              placeholder="admin@pontodeaula.com"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.identifier && <Text style={styles.errorText}>{errors.identifier.message}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Senha</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="••••••••"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      </View>

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={() =>
          submit().catch((err) => {
            // Evita promessa não tratada em caso de erro de validação ou resolver.
            console.log('[login:submit-error]', err);
            Toast.show({
              type: 'error',
              text1: 'Dados inválidos',
              text2: 'Revise os campos e tente novamente.',
            });
          })
        }
        disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111827',
    textAlign: 'center',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '600',
  },
});
