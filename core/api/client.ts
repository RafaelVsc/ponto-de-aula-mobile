import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import { API_URL } from '../constants/env';

type ApiClient = Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;
  patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
}) as ApiClient;

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setAuthToken = (token: string | null | undefined) => {
  authToken = token ?? null;
};

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

api.interceptors.request.use((config) => {
  if (authToken && config?.headers) {
    
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (__DEV__) {
    const method = (config.method ?? 'get').toUpperCase();
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    console.debug('[api:req]', method, url);
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    if (__DEV__) {
      const url = error?.config?.url ?? '';
      console.debug('[api:err]', status ?? 'NO_STATUS', url, error?.message);
      if (data) {
        try {
          console.debug('[api:err:data]', JSON.stringify(data));
        } catch {
          console.debug('[api:err:data]', data);
        }
      }
      if (error?.config?.data) {
        console.debug('[api:req:data]', error.config.data);
      }
    }
    if (status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export { api };
