// import { useQuery } from '@tanstack/react-query';
import { PostCard } from "@/components/posts/PostCard";
import { Fab } from "@/components/ui/Fab";
import { useAuth } from "@/core/auth/AuthProvider";
import { can } from "@/core/auth/rbac";
import { deletePost, fetchMyPosts } from "@/core/services/post.service";
import { Feather } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function MyPostsScreen() {
  const { user } = useAuth();
  const authorId = user?.id;
  const name = user?.name ?? "usuário";
  const queryClient = useQueryClient();

  const canCreate = can(user, "create", "Post");

  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ["posts", "mine", authorId],
    queryFn: fetchMyPosts,
    enabled: !!authorId,
  });

  const posts = data?.data ?? [];

  const handleEdit = (id: string) => {
    router.push(`/(app)/posts/manage/${id}`);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Excluir post", "Deseja realmente excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(id);
            queryClient.invalidateQueries({ queryKey: ["posts", "mine"] });
            queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
            refetch();
          } catch (err) {
            Alert.alert("Erro", "Não foi possível excluir o post.");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark px-4">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-4 py-6 relative">
      <Text className="mb-6 text-sm text-muted-foreground dark:text-muted-foreground-dark">
        {`Olá, ${name}. Aqui estão os posts que você publicou.`}
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            mode="management"
            onPress={() => router.push(`/(app)/posts/${item.id}`)}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="mt-4">
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark text-center">
              {isError
                ? "Não foi possível carregar seus posts."
                : "Você ainda não publicou posts."}
            </Text>
          </View>
        }
      />

      {canCreate && (
        <Fab
          onPress={() => router.push("/(app)/posts/manage/new")}
          accessibilityLabel="Criar novo post"
          icon={<Feather name="plus" size={24} color="#fff" />}
        />
      )}
    </View>
  );
}
