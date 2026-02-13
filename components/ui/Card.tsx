import { cn } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";

type CardProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
};

export function Card({ children, title, subtitle, className }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      {title && (
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
      )}
      {subtitle && (
        <Text className="text-sm text-muted-foreground mt-1">{subtitle}</Text>
      )}
      <View className="mt-3">{children}</View>
    </View>
  );
}
