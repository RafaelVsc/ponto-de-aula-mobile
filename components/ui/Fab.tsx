import { Pressable } from "react-native";

type FabProps = {
  onPress: () => void;
  accessibilityLabel: string;
  icon: React.ReactNode;
  className?: string;
};

export function Fab({ onPress, accessibilityLabel, icon, className }: FabProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      className={`absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg ${className ?? ""}`}
    >
      {icon}
    </Pressable>
  );
}
