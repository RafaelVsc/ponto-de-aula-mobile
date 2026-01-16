import { AuthorSummary } from "@/core/types";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

type Filters = { authorId?: string; sortOrder: "desc" | "asc" };

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApply: (next: Filters) => void;
  onClear: () => void;
  authors?: AuthorSummary[];
  loadingAuthors?: boolean;
};

export function FilterModal({
  visible,
  onClose,
  filters,
  onApply,
  onClear,
  authors = [],
  loadingAuthors,
}: Props) {
  const [localAuthorId, setLocalAuthorId] = useState<string | undefined>(filters.authorId);
  const [localSort, setLocalSort] = useState<"asc" | "desc">(filters.sortOrder ?? "desc");

  useEffect(() => {
    setLocalAuthorId(filters.authorId);
    setLocalSort(filters.sortOrder ?? "desc");
  }, [filters]);

  const apply = () => {
    onApply({ authorId: localAuthorId, sortOrder: localSort });
    onClose();
  };

  const clear = () => {
    setLocalAuthorId(undefined);
    setLocalSort("desc");
    onClear();
  };

  const isEmptyAuthors = !loadingAuthors && (!authors || authors.length === 0);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}>
        <View
          style={{
            maxHeight: "80%",
            minHeight: 360,
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 20,
            gap: 12,
            width: "100%",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>Filtros</Text>
            <Pressable onPress={onClose} accessibilityLabel="Fechar filtros">
              <Text style={{ color: "#1e3a8a", fontWeight: "600" }}>Fechar</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 16, gap: 12 }}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: "600", color: "#111827" }}>
                Autores
              </Text>
              {loadingAuthors ? (
                <ActivityIndicator />
              ) : isEmptyAuthors ? (
                <Text style={{ color: "#6b7280" }}>Nenhum autor encontrado.</Text>
              ) : (
                <View style={{ gap: 8 }}>
                  <Pressable
                    onPress={() => setLocalAuthorId(undefined)}
                    style={{
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: !localAuthorId ? "#1e3a8a" : "#e5e7eb",
                      backgroundColor: !localAuthorId ? "rgba(30,58,138,0.1)" : "#fff",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ color: "#111827", fontWeight: "600" }}>Todos</Text>
                  </Pressable>
                  {authors.map((a) => (
                    <Pressable
                      key={a.id}
                      onPress={() => setLocalAuthorId(a.id)}
                      style={{
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: localAuthorId === a.id ? "#1e3a8a" : "#e5e7eb",
                        backgroundColor: localAuthorId === a.id ? "rgba(30,58,138,0.1)" : "#fff",
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                      }}
                    >
                      <Text style={{ color: "#111827", fontWeight: "600" }}>{a.name}</Text>
                      <Text style={{ color: "#6b7280", fontSize: 12 }}>{a.totalPosts} posts</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View>
              <Text style={{ marginBottom: 8, fontSize: 14, fontWeight: "600", color: "#111827" }}>
                Ordenar por data
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => setLocalSort("desc")}
                  style={{
                    flex: 1,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: localSort === "desc" ? "#1e3a8a" : "#e5e7eb",
                    backgroundColor: localSort === "desc" ? "rgba(30,58,138,0.1)" : "#fff",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: "#111827", fontWeight: "600" }}>Mais recentes</Text>
                </Pressable>
                <Pressable
                  onPress={() => setLocalSort("asc")}
                  style={{
                    flex: 1,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: localSort === "asc" ? "#1e3a8a" : "#e5e7eb",
                    backgroundColor: localSort === "asc" ? "rgba(30,58,138,0.1)" : "#fff",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: "#111827", fontWeight: "600" }}>Mais antigos</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
            <Pressable
              onPress={clear}
              style={{
                flex: 1,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                paddingHorizontal: 12,
                paddingVertical: 12,
              }}
            >
              <Text style={{ textAlign: "center", color: "#111827", fontWeight: "600" }}>
                Limpar filtros
              </Text>
            </Pressable>
            <Pressable
              onPress={apply}
              style={{
                flex: 1,
                borderRadius: 8,
                backgroundColor: "#1e3a8a",
                paddingHorizontal: 12,
                paddingVertical: 12,
              }}
            >
              <Text style={{ textAlign: "center", color: "#ffffff", fontWeight: "700" }}>
                Aplicar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
