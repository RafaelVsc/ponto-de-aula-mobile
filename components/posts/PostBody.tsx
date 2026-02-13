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
};

export function PostBody({
  post,
  htmlContent,
  plainContent,
  formattedDate,
}: Props) {
  const contentHtml = htmlContent ?? post.content ?? "";

  return (
    <View>
      {/* Imagem de capa no topo */}
      <PostMedia imageUrl={post.imageUrl} showVideo={false} />

      <PostHeader
        title={post.title}
        author={post.author}
        formattedDate={formattedDate}
      />
      <PostMeta tags={post.tags} />

      <PostContent html={contentHtml} plainText={plainContent} />

      {/* Vídeo ao final */}
      <PostMedia videoUrl={post.videoUrl} showImage={false} />
    </View>
  );
}
