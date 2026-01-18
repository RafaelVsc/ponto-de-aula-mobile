import { useAppTheme } from "@/components/ThemeProvider";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useAuth } from "@/core/auth/AuthProvider";
import { useCan } from "@/core/auth/useCan";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { toggleColorScheme } = useAppTheme();
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { canViewUsers, can } = useCan();

  if (!isAuthenticated) {
    // Layout não deve renderizar tabs quando deslogado; o root layout troca para stack guest.
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  const renderHeaderRight = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        onPress={toggleColorScheme}
        hitSlop={8}
        style={{ marginRight: 12 }}
      >
        {({ pressed }) => (
          <FontAwesome
            name={colorScheme === "dark" ? "sun-o" : "moon-o"}
            size={22}
            color={Colors[colorScheme ?? "light"].text}
            style={{ opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
      <Pressable onPress={handleLogout} hitSlop={8}>
        {({ pressed }) => (
          <FontAwesome
            name="sign-out"
            size={22}
            color={Colors[colorScheme ?? "light"].text}
            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerRight: renderHeaderRight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-posts"
        options={{
          title: "Meus Posts",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-text" color={color} />
          ),
          // Esconde a aba para quem não tem permissão
          href: can("read", "Post") ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Usuários",
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          href: canViewUsers() ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="my-profile"
        options={{
          title: "Meus Dados",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
