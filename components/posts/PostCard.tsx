import { Post } from '@/core/types';
import { cn } from '@/lib/utils';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  className?: string;
  mode?: 'feed' | 'management';
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostCard({
  post,
  onPress,
  className,
  mode = 'feed',
  onEdit,
  onDelete,
}: PostCardProps) {
  // Formatação simples de data (caso não tenha date-fns)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mb-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm active:opacity-90',
        className
      )}
    >
      {/* 1. Imagem de Capa (Placeholder se não houver) */}
      <View className="h-40 w-full bg-slate-100 items-center justify-center">
        {post.imageUrl ? (
          <Image
            source={{ uri: post.imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center justify-center">
            <Feather name="image" size={32} color="#9ca3af" />
            <Text className="text-xs text-slate-400 mt-2">Sem imagem de capa</Text>
          </View>
        )}
        {/* SE tiver vídeo, mostra o selo no topo direito */}
        {post.videoUrl && (
            <View className="absolute top-2 right-2 flex-row items-center gap-1 
      rounded-full bg-red-600 px-2 py-1 shadow-sm">
        <Feather name="youtube" size={12} color="white" />
        <Text className="text-[10px] font-bold text-white tracking-wide">VÍDEO</Text>
      </View>
        )}
        
        {/* Badge de Tags no topo da imagem */}
        {post.tags && post.tags.length > 0 && (
          <View className="absolute bottom-2 left-2 flex-row gap-1">
            {post.tags.slice(0, 2).map((tag) => (
              <View key={tag} className="rounded-md bg-slate-900/60 px-2 py-1">
                <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {tag}
                </Text>
              </View>
            ))}
            {post.tags.length > 2 && (
              <View className="rounded-md bg-slate-900/60 px-2 py-1">
                <Text className="text-[10px] font-bold text-white">
                  +{post.tags.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View className="p-4">
        {/* 2. Cabeçalho (Autor e Data) */}
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <Feather name="user" size={12} color="#1e3a8a" />
            </View>
            <Text className="ml-2 text-xs font-medium text-slate-700">
              {post.author || 'Autor desconhecido'}
            </Text>
          </View>
          <Text className="text-[10px] text-muted-foreground">
            {formatDate(post.createdAt)}
          </Text>
        </View>

        {/* 3. Título */}
        <Text className="mb-2 text-lg font-bold leading-tight text-foreground" numberOfLines={2}>
          {post.title}
        </Text>

        {/* 4. Resumo do Conteúdo */}
        <Text
          className="text-sm leading-relaxed text-muted-foreground"
          numberOfLines={3}
        >
          {post.content.replace(/<[^>]*>?/gm, '')} {/* Remove tags HTML simples */}
        </Text>

        {/* 5. Rodapé / Link */}
        <View className="mt-4 flex-row items-center justify-end border-t border-border pt-3">
          {mode === 'management' ? (
            <View className="flex-row items-center gap-4">
              {onEdit && (
                <Pressable
                  onPress={onEdit}
                  hitSlop={8}
                  className="flex-row items-center"
                >
                  <Feather name="edit-2" size={16} color="#1e3a8a" />
                  <Text className="ml-1 text-xs font-semibold text-primary">Editar</Text>
                </Pressable>
              )}
              {onDelete && (
                <Pressable
                  onPress={onDelete}
                  hitSlop={8}
                  className="flex-row items-center"
                >
                  <Feather name="trash-2" size={16} color="#dc2626" />
                  <Text className="ml-1 text-xs font-semibold text-destructive">Excluir</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View className="flex-row items-center">
              <Text className="mr-1 text-xs font-bold text-primary">Ler conteúdo completo</Text>
              <Feather name="chevron-right" size={14} color="#1e3a8a" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
