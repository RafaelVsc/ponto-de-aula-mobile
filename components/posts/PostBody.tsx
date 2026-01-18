import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Post } from "@/core/types";
import { View } from "react-native";
import { PostContent } from "./PostContent";
import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";
import { PostMeta } from "./PostMeta";

type Props = {
  post: Post;
  htmlContent?: string;
  plainContent?: string;
  formattedDate?: string | null;
  canUpdate: boolean;
  canRemove: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function PostBody({
  post,
  htmlContent,
  plainContent,
  formattedDate,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const contentHtml = htmlContent ?? post.content ?? "";

  return (
    <View>
      <PostHeader
        title={post.title}
        author={post.author}
        formattedDate={formattedDate}
      />
      <PostMedia imageUrl={post.imageUrl} />
      <PostMeta tags={post.tags} />


      <PostContent html={contentHtml} plainText={plainContent} />
      <PostMedia videoUrl={post.videoUrl} />
    </View>
  );
}
