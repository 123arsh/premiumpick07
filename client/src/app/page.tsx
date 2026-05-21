'use client';

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchFilter } from '@/components/products/SearchFilter';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';

export default function HomePage() {
  const {
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
  } = useProducts();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) loadMore();
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="mb-10 text-center sm:text-left">
          <h2 className="font-display text-3xl font-normal tracking-tight sm:text-4xl lg:text-5xl">
            Discover premium picks
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Hand-selected products with exclusive affiliate deals. Click any card to view the offer.
          </p>
        </section>

        <SearchFilter
          search={search}
          category={category}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />

        <ProductGrid products={products} loading={loading} />

        {hasMore && !loading && (
          <div ref={loadMoreRef} className="mt-10 flex justify-center">
            <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
              Load more
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
