// app/(app)/posts/manage/[id].tsx
import { PostForm } from "@/components/posts/PostForm";
import {
    createPost,
    fetchPostById,
    updatePost,
} from "@/core/services/post.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Text,
    View
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ManagePostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isCreate = !id || id === "new";
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id!),
    enabled: !isCreate && !!id,
  });

  const normalizeUrl = (v?: string) => {
    const trimmed = v?.trim();
    // Backend não aceita null; envia "" para limpar e a string real para preencher
    return trimmed ? trimmed : "";
  };

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const payload = {
        title: values.title,
        content: values.content,
        tags: values.tags,
        imageUrl: normalizeUrl(values.imageUrl),
        videoUrl: normalizeUrl(values.videoUrl),
      };
      return isCreate ? createPost(payload) : updatePost(id!, payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "mine"] });
      if (!isCreate) queryClient.invalidateQueries({ queryKey: ["post", id] });
      router.replace(`/(app)/posts/${isCreate ? res.data.id : id}`);
    },
  });

  const defaultValues = isCreate ? undefined : data?.data;

  if (!isCreate && isLoading) return <ActivityIndicator />;
  if (!isCreate && isError)
    return <Text>Não foi possível carregar o post.</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={insets.top + 64}
    >
      <View className="flex-1 bg-background">
        <PostForm
          mode={isCreate ? "create" : "edit"}
          defaultValues={defaultValues}
          submitting={mutation.isPending}
          onSubmit={(values) => mutation.mutate(values)}
          onCancel={() => router.back()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
