import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RenderHTML, {
  CustomTextualRenderer,
  TNodeChildrenRenderer,
} from "react-native-render-html";
import { Text, View, useWindowDimensions, TextStyle } from "react-native";

type Props = {
  html?: string;
  plainText?: string;
};

const textElementRenderer: CustomTextualRenderer = ({ tnode }) => {
  const textStyles: TextStyle[] = [tnode.styles.nativeTextFlow as TextStyle];
  const styleAttr = (tnode.domNode as any)?.attribs?.style ?? "";

  styleAttr.split(";").forEach((part: string) => {
    const [rawKey, rawValue] = part.split(":");
    if (!rawKey || !rawValue) return;
    const key = rawKey.trim().toLowerCase();
    const value = rawValue.trim();
    if (key === "background-color") {
      textStyles.push({
        backgroundColor: value,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
      });
    }
    if (key === "color") {
      textStyles.push({ color: value });
    }
  });

  return (
    <Text style={textStyles}>
      <TNodeChildrenRenderer tnode={tnode} />
    </Text>
  );
};

export function PostContent({ html, plainText }: Props) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const textColor = palette.text ?? "#111827";
  const accentColor = palette.tint ?? palette.primary ?? "#1e3a8a";
  const mutedSurface = palette.muted ?? "#f3f4f6";
  const borderColor = palette.border ?? "#e5e7eb";

  const textRenderers = [
    "p",
    "div",
    "span",
    "h1",
    "h2",
    "h3",
    "strong",
    "em",
    "li",
  ].reduce(
    (acc, tag) => ({
      ...acc,
      [tag]: textElementRenderer,
    }),
    {}
  );

  if (!html && !plainText) return null;

  return html ? (
    <View className="mt-4">
      <RenderHTML
        contentWidth={width}
        source={{ html }}
        baseStyle={{
          color: textColor,
          fontSize: 16,
          lineHeight: 22,
          backgroundColor: palette.background,
        }}
        tagsStyles={{
          p: { marginBottom: 12 },
          strong: { fontWeight: "700" },
          em: { fontStyle: "italic" },
          a: {
            color: accentColor,
            textDecorationLine: "underline",
          },
          h1: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
          h2: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
          h3: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
          ul: { paddingLeft: 18, marginBottom: 12 },
          ol: { paddingLeft: 18, marginBottom: 12 },
          li: { marginBottom: 6 },
          code: {
            fontFamily: "monospace",
            backgroundColor: mutedSurface,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
          },
          pre: {
            fontFamily: "monospace",
            backgroundColor: mutedSurface,
            padding: 8,
            borderRadius: 6,
          },
          blockquote: {
            borderLeftWidth: 3,
            borderLeftColor: borderColor,
            paddingLeft: 10,
            marginVertical: 10,
          },
        }}
        defaultTextProps={{ selectable: true }}
        renderers={textRenderers}
      />
    </View>
  ) : (
    <Text className="mt-4 text-base leading-relaxed text-foreground dark:text-foreground-dark">
      {plainText}
    </Text>
  );
}
