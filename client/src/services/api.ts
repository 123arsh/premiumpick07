import { API_URL } from '@/lib/constants';
import type { Product, ProductsResponse } from '@/types';

type FetchOptions = RequestInit & { token?: string };

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...rest,
      headers: {
        ...(rest.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Request timed out. Please check your backend URL or network connection.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
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

  changePassword: (
    token: string,
    body: { currentPassword: string; newPassword: string }
  ) =>
    request<{ success: boolean; message: string }>('/admin/change-password', {
      method: 'PUT',
      body: JSON.stringify(body),
      token,
    }),

  forgotPassword: (username: string, resetSecret: string) =>
    request<{ success: boolean; message: string; data: { resetToken: string } }>(
      '/admin/forgot-password',
      { method: 'POST', body: JSON.stringify({ username, resetSecret }) }
    ),

  resetPassword: (body: { token: string; newPassword: string; confirmPassword: string }) =>
    request<{ success: boolean; message: string }>('/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
