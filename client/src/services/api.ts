import { API_URL } from '@/lib/constants';
import type { Product, ProductsResponse } from '@/types';

type FetchOptions = RequestInit & { token?: string };

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      ...(rest.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const productApi = {
  getAll: (params: { page?: number; limit?: number; search?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    return request<ProductsResponse>(`/products?${query}`);
  },

  getCategories: () =>
    request<{ success: boolean; data: { categories: string[] } }>('/products/categories'),
};

export const adminApi = {
  login: (username: string, password: string) =>
    request<{ success: boolean; data: { token: string; admin: { id: string; username: string } } }>(
      '/admin/login',
      { method: 'POST', body: JSON.stringify({ username, password }) }
    ),

  logout: (token: string) =>
    request('/admin/logout', { method: 'POST', token }),

  me: (token: string) =>
    request<{ success: boolean; data: { admin: { id: string; username: string } } }>(
      '/admin/me',
      { token }
    ),

  getProducts: (token: string, search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<{ success: boolean; data: { products: Product[]; total: number } }>(
      `/admin/products${query}`,
      { token }
    );
  },

  createProduct: (token: string, formData: FormData) =>
    request<{ success: boolean; data: { product: Product } }>('/admin/products', {
      method: 'POST',
      body: formData,
      token,
    }),

  updateProduct: (token: string, id: string, formData: FormData) =>
    request<{ success: boolean; data: { product: Product } }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: formData,
      token,
    }),

  deleteProduct: (token: string, id: string) =>
    request(`/admin/products/${id}`, { method: 'DELETE', token }),
};
