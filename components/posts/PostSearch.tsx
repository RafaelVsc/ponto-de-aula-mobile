import { Input } from "../ui/Input";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function PostSearch({ value, onChangeText }: Props) {
  return (
    <Input
      className="w-full"
      placeholder="Buscar posts..."
      value={value}
      onChangeText={onChangeText}
      accessibilityLabel="Buscar posts por título ou conteúdo"
      accessibilityRole="search"
      icon="search"
    />
  );
}
