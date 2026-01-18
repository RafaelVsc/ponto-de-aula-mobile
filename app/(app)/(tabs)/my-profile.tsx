import { useAuth } from "@/core/auth/AuthProvider";
import { Text, View } from "react-native";

export default function MyProfileScreen() {
  const { user } = useAuth();
  const name = user?.name ?? "Usuário";
  const email = user?.email ?? "—";

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-4 py-6">
      <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
        Nome: {name}
      </Text>
      {/* <Text>Username: {username}</Text> */}
      <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
        E-mail: {email}
      </Text>
      {/* Placeholder para mais campos/botões de editar */}
    </View>
  );
}
