import { Text, View } from "react-native";

type Props = {
  tags?: string[] | null;
};

export function PostMeta({ tags }: Props) {
  if (!tags?.length) return null;

  return (
    <View className="mt-3 flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <View key={tag} className="rounded-md bg-primary/10 px-2 py-1">
          <Text className="text-xs font-semibold text-primary uppercase">
            {tag}
          </Text>
        </View>
      ))}
    </View>
  );
}
