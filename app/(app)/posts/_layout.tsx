import { Stack } from 'expo-router';

export default function PostsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen name="[id]" options={{ title: 'Post' }} />
    </Stack>
  );
}
