import { Image, View } from "react-native";
import { PostVideo } from "./PostVideo";

type Props = {
  imageUrl?: string | null;
  videoUrl?: string | null;
};

export function PostMedia({ imageUrl, videoUrl }: Props) {
  return (
    <View>
      {imageUrl ? (
        <View className="mt-4 overflow-hidden rounded-xl bg-muted">
          <Image
            source={{ uri: imageUrl }}
            className="h-48 w-full"
            resizeMode="cover"
          />
        </View>
      ) : null}

      <PostVideo videoUrl={videoUrl ?? undefined} />
    </View>
  );
}
