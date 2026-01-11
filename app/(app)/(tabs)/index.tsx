import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/core/auth/AuthProvider';

export default function TabOneScreen() {
  const { user } = useAuth();
  const name = user?.name ?? 'usuário';
  const role = user?.role ?? '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {name}</Text>
      {!!role && <Text style={styles.subtitle}>Role: {role}</Text>}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
