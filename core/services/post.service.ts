import { api } from '../api/client';
import type {
  ApiResponse,
  AuthorSummary,
  CreatePostPayload,
  PaginatedResponse,
  Post,
  PostSearchParams,
  UpdatePostPayload
} from '../types/index';

const BASE_URL = '/posts';

// Lista de posts (com filtros/paginação)
export async function fetchPosts(params?: PostSearchParams): Promise<PaginatedResponse<Post[]>> {
  return api.get<PaginatedResponse<Post[]>>(`${BASE_URL}/search`, { params });
}

export async function fetchMyPosts(): Promise<PaginatedResponse<Post[]>> {
  return api.get<PaginatedResponse<Post[]>>(`/posts/mine`);
}

// // Detalhe de post
export async function fetchPostById(id: string): Promise<ApiResponse<Post>> {
  return api.get<ApiResponse<Post>>(`${BASE_URL}/${id}`);
}

// // Criar post
export async function createPost(payload: CreatePostPayload): Promise<ApiResponse<Post>> {
  return api.post<ApiResponse<Post>>(BASE_URL, payload);
}

// // Atualizar post
export async function updatePost(
  id: string,
  payload: UpdatePostPayload
): Promise<ApiResponse<Post>> {
  return api.put<ApiResponse<Post>>(`${BASE_URL}/${id}`, payload);
}

// Remover post
export async function deletePost(id: string): Promise<ApiResponse<{ id: string }>> {
  return api.delete<ApiResponse<{ id: string }>>(`${BASE_URL}/${id}`);
}

// Buscar autores de post
export async function fetchAuthors(): Promise<ApiResponse<AuthorSummary[]>> {
  return api.get<ApiResponse<AuthorSummary[]>>(`${BASE_URL}/authors`);
}
