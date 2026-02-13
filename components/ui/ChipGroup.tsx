import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type ChipSize = "sm" | "md";

export type ChipOption<T extends string> = {
  label: string;
  value: T;
};

type ChipGroupProps<T extends string> = {
  options: ChipOption<T>[];
  value?: T | null;
  onChange: (value: T) => void;
  size?: ChipSize;
  scroll?: boolean;
  wrap?: boolean;
  columns?: number;
};

const sizeStyles: Record<
  ChipSize,
  { chip: string; text: string; selectedText: string }
> = {
  sm: {
    chip: "px-3 py-1",
    text: "text-xs",
    selectedText: "text-xs",
  },
  md: {
    chip: "px-3 py-2",
    text: "text-sm",
    selectedText: "text-sm font-semibold",
  },
};

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  scroll = false,
  wrap = true,
  columns,
}: ChipGroupProps<T>) {
  const isGrid = Boolean(columns && columns > 1);
  const spacingClass = isGrid ? "" : wrap ? "mr-2 mb-2" : "mr-2";
  const { chip, text, selectedText } = sizeStyles[size];
  const columnWidth = columns ? (100 / columns) : 100;

  const content = options.map((option) => {
    const selected = value === option.value;
    const chipNode = (
      <Pressable
        onPress={() => onChange(option.value)}
        className={`${spacingClass} items-center rounded-full border ${chip} ${
          selected ? "border-primary bg-primary/10" : "border-border bg-card"
        }`}
      >
        <Text
          className={`text-center ${
            selected ? "text-primary" : "text-foreground"
          } ${selected ? selectedText : text}`}
        >
          {option.label}
        </Text>
      </Pressable>
    );

    if (isGrid) {
      return (
        <View
          key={option.value}
          style={{
            flexBasis: `${columnWidth}%`,
            paddingRight: 8,
            paddingBottom: 8,
          }}
        >
          {chipNode}
        </View>
      );
    }

    return (
      <React.Fragment key={option.value}>
        {chipNode}
      </React.Fragment>
    );
  });

  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {content}
      </ScrollView>
    );
  }

  if (isGrid) {
    return <View className="flex-row flex-wrap">{content}</View>;
  }

  return (
    <View className={wrap ? "flex-row flex-wrap" : "flex-row"}>{content}</View>
  );
}
