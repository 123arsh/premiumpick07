'use client';

import { useCallback, useEffect, useState } from 'react';
import { productApi } from '@/services/api';
import type { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const res = await productApi.getAll({
          page: pageNum,
          limit: 12,
          search: search || undefined,
          category: category || undefined,
        });

        setProducts((prev) =>
          append ? [...prev, ...res.data.products] : res.data.products
        );
        setHasMore(res.data.pagination.hasMore);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search, category]
  );

  useEffect(() => {
    productApi.getCategories().then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  const loadMore = () => {
    if (!loadingMore && hasMore) fetchProducts(page + 1, true);
  };

  return {
    products,
    categories,
    loading,
    loadingMore,
    error,
    hasMore,
    search,
    setSearch,
    category,
    setCategory,
    loadMore,
    refetch: () => fetchProducts(1, false),
  };
}
