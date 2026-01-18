import { Text, View } from "react-native";

type Props = {
  title: string;
  author?: string | null;
  formattedDate?: string | null;
};

export function PostHeader({ title, author, formattedDate }: Props) {
  return (
    <View>
      <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
        {title}
      </Text>
      <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark mt-1">
        {author ?? "Autor desconhecido"}
        {formattedDate ? ` • ${formattedDate}` : ""}
      </Text>
    </View>
  );
}
