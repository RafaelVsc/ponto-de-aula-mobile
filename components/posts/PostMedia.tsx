import { Image, View } from "react-native";
import { PostVideo } from "./PostVideo";

type Props = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  showImage?: boolean;
  showVideo?: boolean;
};

const placeholder = require("@/assets/images/bg-ponto-de-aula.webp");

export function PostMedia({
  imageUrl,
  videoUrl,
  showImage = true,
  showVideo = true,
}: Props) {
  const source = imageUrl ? { uri: imageUrl } : placeholder;
  return (
    <View>
      {showImage && (
        <View className="mt-4 overflow-hidden rounded-xl bg-muted">
          <Image source={source} className="h-48 w-full" resizeMode="cover" />
        </View>
      )}

      {showVideo && <PostVideo videoUrl={videoUrl ?? undefined} />}
    </View>
  );
}
