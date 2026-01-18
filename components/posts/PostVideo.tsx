import { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const getYoutubeId = (url?: string) => {
  if (!url) return null;
  const regex = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{6,})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

type Props = { videoUrl?: string };

export function PostVideo({ videoUrl }: Props) {
  const videoId = useMemo(() => getYoutubeId(videoUrl), [videoUrl]);
  const [playing, setPlaying] = useState(false);

  const onChangeState = useCallback((state: string) => {
    if (state === "ended") setPlaying(false);
  }, []);

  if (!videoId) {
    if (videoUrl) {
      return (
        <Text className="mt-3 text-sm text-muted-foreground">
          Link de vídeo não reconhecido.
        </Text>
      );
    }
    return null;
  }

  return (
    <View className="mt-4 overflow-hidden rounded-xl bg-black">
      <YoutubePlayer
        height={220}
        play={playing}
        videoId={videoId}
        onChangeState={onChangeState}
        webViewProps={{ allowsFullscreenVideo: true }}
      />
    </View>
  );
}
