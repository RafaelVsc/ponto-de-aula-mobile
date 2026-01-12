import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

import { PostCard } from '@/components/posts/PostCard';
import { useAuth } from '@/core/auth/AuthProvider';
import { fetchMyPosts } from '@/core/services/post.service';

export default function MyPostsScreen() {
  const { user } = useAuth();
  const authorId = user?.id;
  const name = user?.name ?? 'usuário';

  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ['posts', 'mine', authorId],
    queryFn: fetchMyPosts,
    enabled: !!authorId,
  });

  const posts = data?.data ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 py-6">
      <Text className="mb-4 text-2xl font-bold text-foreground">
        Meus posts
      </Text>
      <Text className="mb-6 text-sm text-muted-foreground">
        {`Olá, ${name}. Aqui estão os posts que você publicou.`}
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View>
            <Text>
              {isError
                ? 'Não foi possível carregar seus posts.'
                : 'Você ainda não publicou posts.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
