import { PostCard } from '@/components/posts/PostCard';
import { useAuth } from '@/core/auth/AuthProvider';
import { fetchPosts } from '@/core/services/post.service';
import type { Post } from '@/core/types';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

export default function FeedScreen() {
  const { user } = useAuth();
  const name = user?.name ?? 'Usuário';

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['posts', 'feed'],
    queryFn: () => fetchPosts(),
  });

  const posts: Post[] = data?.data ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-4 py-6">
      <Text className="mb-4 text-2xl font-bold text-foreground dark:text-foreground-dark">
        Olá, {name}
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} onPress={() => router.push(`/(app)/posts/${item.id}`)}/>}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="mt-8 items-center">
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {isError ? 'Não foi possível carregar os posts.' : 'Nenhum post encontrado.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
