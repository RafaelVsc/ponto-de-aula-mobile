import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  type AlertButton,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
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
import Feather from "@expo/vector-icons/Feather";

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
  const showActions = canUpdate || canRemove;

  const openActions = () => {
    const options: {
      label: string;
      onPress: () => void;
      destructive?: boolean;
    }[] = [];
    if (canUpdate)
      options.push({
        label: "Editar",
        onPress: () => router.push(`/(app)/posts/manage/${post.id}`),
      });
    if (canRemove)
      options.push({
        label: "Excluir",
        onPress: confirmDelete,
        destructive: true,
      });
    if (!options.length) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...options.map((o) => o.label), "Cancelar"],
          cancelButtonIndex: options.length,
          destructiveButtonIndex: options.findIndex((o) => o.destructive),
        },
        (idx) => {
          if (idx === options.length || idx < 0) return;
          options[idx]?.onPress();
        }
      );
    } else {
      const buttons: AlertButton[] = [
        ...options.map((o): AlertButton => ({
          text: o.label,
          onPress: o.onPress,
          style: o.destructive ? "destructive" : "default",
        })),
        { text: "Cancelar", style: "cancel" },
      ];
      Alert.alert("Ações", undefined, buttons);
    }
  };

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
          headerRight: () =>
            showActions ? (
              <Pressable
                onPress={openActions}
                hitSlop={8}
                style={{ paddingHorizontal: 8, paddingVertical: 4 }}
              >
                <Feather
                  name="more-vertical"
                  size={22}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </Pressable>
            ) : null,
        }}
      />

      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          gap: 6,
        }}
      >
        <FontAwesome
          name="chevron-left"
          size={16}
          color={Colors[colorScheme ?? "light"].text}
        />
        <Text className="text-base font-medium text-foreground">Voltar</Text>
      </Pressable>
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
