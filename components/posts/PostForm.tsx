import { Post } from "@/core/types";
import { PostFormValues, PostSchema } from "@/core/validation/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type PostFormMode = "create" | "edit";

type PostFormProps = {
  mode: PostFormMode;
  defaultValues?: Partial<Post>;
  submitting?: boolean;
  onSubmit: (values: PostFormValues & { tags: string[] }) => void;
  onCancel?: () => void;
};

export function PostForm({
  mode,
  defaultValues,
  submitting,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const insets = useSafeAreaInsets();
  const initialValues = useMemo<PostFormValues>(
    () => ({
      title: defaultValues?.title ?? "",
      content: defaultValues?.content ?? "",
      tagsInput: defaultValues?.tags?.join(", ") ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      videoUrl: defaultValues?.videoUrl ?? "",
    }),
    [defaultValues]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(PostSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const submitForm = handleSubmit((values) => {
    const tags =
      values.tagsInput
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [];
    onSubmit({ ...values, tags });
  });

  return (
    <ScrollView
      className="flex-1 bg-background px-4 py-6"
      contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <Text className="mb-4 text-2xl font-bold text-foreground">
        {mode === "create" ? "Novo post" : "Editar post"}
      </Text>

      <View className="gap-4">
        {/* Título */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Título"
              placeholder="Digite o título do post"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.title?.message}
            />
          )}
        />

        {/* Conteudo */}
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text className="mb-1.5 text-sm font-medium text-foreground">
                Conteúdo
              </Text>
              <TextInput
                multiline
                textAlignVertical="top"
                placeholder="Escreva o conteúdo aqui..."
                className="rounded-lg border border-border bg-card px-3 py-3 text-base leading-5 text-foreground"
                scrollEnabled={false}
                style={{ minHeight: 140, maxHeight: 240 }}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
              {errors.content?.message && (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.content.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Tags */}
        <Controller
          control={control}
          name="tagsInput"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Tags (separe por vírgula)"
              placeholder="ex: react, mobile, aula"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.tagsInput?.message}
            />
          )}
        />

        {/* {Imagem} */}
        <Controller
          control={control}
          name="imageUrl"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="URL da imagem"
              placeholder="https://..."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.imageUrl?.message}
            />
          )}
        />

        {/* {Vídeo} */}
        <Controller
          control={control}
          name="videoUrl"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="URL do vídeo (YouTube)"
              placeholder="https://youtube.com/watch?v=..."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.videoUrl?.message}
            />
          )}
        />
      </View>
      <View className="mt-6 flex-row gap-3">
        <Button
          label={mode === "create" ? "Publicar" : "Salvar alterações"}
          onPress={submitForm}
          loading={submitting}
          disabled={submitting}
          className="flex-1"
        />
        <Button
          label="Cancelar"
          variant="secondary"
          onPress={onCancel}
          disabled={submitting}
          className="flex-1"
        />
      </View>
    </ScrollView>
  );
}
