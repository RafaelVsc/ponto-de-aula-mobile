import { Button } from "@/components/ui/Button";
import { Post } from "@/core/types";
import { Image, Text, View } from "react-native";
import { PostVideo } from "./PostVideo";

type Props = {
  post: Post;
  plainContent: string;
  formattedDate?: string | null;
  canUpdate: boolean;
  canRemove: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function PostBody({
  post,
  plainContent,
  formattedDate,
  canUpdate,
  canRemove,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View>
      <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
        {post.title}
      </Text>
      <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark mt-1">
        {post.author ?? "Autor desconhecido"}
        {formattedDate ? ` • ${formattedDate}` : ""}
      </Text>

      {post.tags?.length ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {post.tags.map((tag) => (
            <View key={tag} className="rounded-md bg-primary/10 px-2 py-1">
              <Text className="text-xs font-semibold text-primary uppercase">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {post.imageUrl ? (
        <View className="mt-4 overflow-hidden rounded-xl bg-muted">
          <Image
            source={{ uri: post.imageUrl }}
            className="h-48 w-full"
            resizeMode="cover"
          />
        </View>
      ) : null}

      <Text className="mt-4 text-base leading-relaxed text-foreground dark:text-foreground-dark">
        {plainContent}
      </Text>

      <PostVideo videoUrl={post.videoUrl} />

      {(canUpdate || canRemove) && (
        <View className="mt-8 border-t border-border pt-4">
          <Text className="mb-3 text-sm font-semibold text-muted-foreground">
            Ações administrativas
          </Text>
          {canUpdate && (
            <Button label="Editar" className="mb-3" onPress={onEdit} />
          )}
          {canRemove && (
            <Button
              label="Excluir"
              variant="destructive"
              onPress={onDelete}
            />
          )}
        </View>
      )}
    </View>
  );
}
