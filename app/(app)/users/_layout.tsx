import { Stack } from "expo-router";

export default function UsersLayout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: true,
        headerBackTitle: "Voltar",
      }}
    >
      {/* <Stack.Screen name="index" options={{ title: "Usuários" }} />
      <Stack.Screen name="manage/[id]" options={{ title: "Gerenciar usuário" }} /> */}
    </Stack>
  );
}
