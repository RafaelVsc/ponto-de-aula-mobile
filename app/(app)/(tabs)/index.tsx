import { FilterModal } from "@/components/posts/FilterModal";
import { PostCard } from "@/components/posts/PostCard";
import { PostSearch } from "@/components/posts/PostSearch";
import { Button } from "@/components/ui/Button";
import { Fab } from "@/components/ui/Fab";
import { useAuth } from "@/core/auth/AuthProvider";
import { can } from "@/core/auth/rbac";
import { fetchAuthors, fetchPosts } from "@/core/services/post.service";
import type { Post } from "@/core/types";
import { Feather } from "@expo/vector-icons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function FeedScreen() {
  const { user } = useAuth();
  const name = user?.name ?? "Usuário";
  const canCreate = can(user, "create", "Post");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 10;
  const [authorId, setAuthorId] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const term = search.trim();
      setDebouncedSearch(term.length >= 3 ? term : "");
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const authorsQuery = useQuery({
    queryKey: ["post-authors"],
    queryFn: fetchAuthors,
  });
  const authors = authorsQuery.data?.data ?? [];
  console.log("[authors]", authors.length);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      "posts",
      "feed",
      { search: debouncedSearch, authorId, sortOrder },
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchPosts({
        search: debouncedSearch || undefined,
        authorId,
        sortOrder,
        page: pageParam,
        limit,
      }),
    getNextPageParam: (last) =>
      last?.meta?.hasNextPage ? (last.meta?.page ?? 1) + 1 : undefined,
  });

  const posts: Post[] = data?.pages?.flatMap((p) => p.data) ?? [];
  const filtersActive = Boolean(authorId || sortOrder !== "desc");

  if (isLoading && !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark px-4 py-6 relative">
      <Text className="mb-4 text-2xl font-bold text-foreground dark:text-foreground-dark">
        Olá, {name}
      </Text>
      <View className="mb-4 gap-3">
        <PostSearch value={search} onChangeText={setSearch} />
        <Button
          variant={filtersActive ? "default" : "secondary"}
          label={filtersActive ? "Filtros (ativos)" : "Filtros"}
          onPress={() => {
            console.log("[Feed] abrindo filtros");
            setFiltersOpen(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={
            filtersActive ? "Filtrar posts, 1 filtro ativo" : "Filtrar posts"
          }
        />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => router.push(`/(app)/posts/${item.id}`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="mt-8 items-center">
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {isError
                ? "Não foi possível carregar os posts."
                : "Nenhum post encontrado."}
            </Text>
          </View>
        }
      />
      <FilterModal
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={{ authorId, sortOrder }}
        authors={authors}
        loadingAuthors={authorsQuery.isLoading}
        onApply={(next) => {
          setAuthorId(next.authorId);
          setSortOrder(next.sortOrder);
          setFiltersOpen(false);
        }}
        onClear={() => {
          setAuthorId(undefined);
          setSortOrder("desc");
        }}
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
