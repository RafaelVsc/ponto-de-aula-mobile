import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PostBody } from "@/components/posts/PostBody";
import { useAppTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useAuth } from "@/core/auth/AuthProvider";
import { canDelete } from "@/core/auth/rbac";
import { deletePost, fetchPostById } from "@/core/services/post.service";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { toggleColorScheme } = useAppTheme();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id!),
    enabled: !!id,
  });

  const post = data?.data;
  const plainContent = post?.content?.replace(/<[^>]*>/g, "") ?? "";
  const formattedDate = post?.createdAt
    ? new Intl.DateTimeFormat("pt-BR").format(new Date(post.createdAt))
    : null;
  const isOwner = Boolean(
    user?.id && post?.authorId && user.id === post.authorId
  );
  const canUpdate = isOwner;
  const canRemove = post ? canDelete(post, user) : false;

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  if (isError || !post) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-4 text-foreground text-center">
          Não foi possível carregar o post.
        </Text>
        <Button label="Tentar novamente" onPress={() => refetch()} />
      </View>
    );
  }

  const confirmDelete = () => {
    if (!post.id) return;
    Alert.alert("Excluir post", "Deseja realmente excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(post.id);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
            queryClient.invalidateQueries({ queryKey: ["posts", "mine"] });
            router.back();
          } catch (err) {
            Alert.alert("Erro", "Não foi possível excluir o post.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark px-4 py-6"
      contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <Stack.Screen
        options={{
          title: post.title ?? "Post",
          headerBackTitle: "Voltar",
          headerBackVisible: true,
          headerRight: () => (
            <Pressable
              onPress={toggleColorScheme}
              hitSlop={8}
              style={{ paddingHorizontal: 8, paddingVertical: 4 }}
            >
              <FontAwesome
                name={colorScheme === "dark" ? "sun-o" : "moon-o"}
                size={20}
                color={Colors[colorScheme ?? "light"].text}
              />
            </Pressable>
          ),
        }}
      />
      <PostBody
        post={post}
        plainContent={plainContent}
        formattedDate={formattedDate}
        canUpdate={canUpdate}
        canRemove={canRemove}
        onEdit={() => router.push(`/(app)/posts/manage/${post.id}`)}
        onDelete={confirmDelete}
      />
    </ScrollView>
  );
}
