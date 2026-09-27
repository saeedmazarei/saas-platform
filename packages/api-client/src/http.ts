import axios from 'axios';
import type { z } from 'zod';

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

export type HttpClientConfig = {
  baseUrl: string;
  getAccessToken: () => string | null;
  onUnauthorized: () => void;
};

let config: HttpClientConfig = {
  baseUrl: '/api',
  getAccessToken: () => null,
  onUnauthorized: () => {},
};

const http = axios.create({ baseURL: config.baseUrl });

export function configureHttpClient(overrides: Partial<HttpClientConfig>) {
  config = { ...config, ...overrides };
  http.defaults.baseURL = config.baseUrl;
}

http.interceptors.request.use((request) => {
  const token = config.getAccessToken();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Network error. Check your connection and try again.';
    const data = error.response.data as { message?: unknown } | undefined;
    if (typeof data?.message === 'string') return data.message;
  }
  return 'Request failed';
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions<T> = {
  params?: Record<string, string | number | boolean | undefined>;
  schema?: z.ZodType<T>;
  signal?: AbortSignal;
  skipAuthRedirect?: boolean;
};

async function send<T>(method: Method, url: string, body: unknown, options: RequestOptions<T> = {}): Promise<T> {
  const { params, schema, signal, skipAuthRedirect } = options;

  let data: unknown;
  try {
    const response = await http.request({ url, method, data: body, params, signal });
    data = response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0;
    if (status === 401 && !skipAuthRedirect) config.onUnauthorized();
    throw new ApiError(status, getErrorMessage(error), error);
  }

  if (!schema) return undefined as T;

  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(200, 'Unexpected response from the server.', result.error);
  }
  return result.data;
}

export const request = {
  get: <T = void>(url: string, options?: RequestOptions<T>) => send('GET', url, undefined, options),
  post: <T = void>(url: string, body?: unknown, options?: RequestOptions<T>) => send('POST', url, body, options),
  patch: <T = void>(url: string, body?: unknown, options?: RequestOptions<T>) => send('PATCH', url, body, options),
  delete: <T = void>(url: string, options?: RequestOptions<T>) => send('DELETE', url, undefined, options),
};