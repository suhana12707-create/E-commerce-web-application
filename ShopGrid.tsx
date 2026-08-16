import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

interface ShopGridProps {
  products: Product[];
  searchQuery: string;
  onOpenProduct: (product: Product) => void;
}

const CATEGORIES = ['All', 'Objects', 'Textiles', 'Fragrance', 'Paper'] as const;

export function ShopGrid({ products, searchQuery, onOpenProduct }: ShopGridProps) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.in_stock);
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else
      list = [...list].sort(
        (a, b) => Number(b.is_featured) - Number(a.is_featured)
      );
    return list;
  }, [products, category, sort, searchQuery]);

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-10 sm:mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
            The Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-tight">
            All goods
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-stone-200 pb-5">
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 text-sm rounded-full transition-colors ${
                  category === cat
                    ? 'bg-stone-900 text-stone-50'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-stone-500">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-sm bg-transparent border border-stone-300 rounded-sm px-3 py-1.5 text-stone-800 outline-none focus:border-stone-900 transition"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-stone-900 mb-2">Nothing here yet</p>
            <p className="text-stone-500">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-y-14">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpenProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
