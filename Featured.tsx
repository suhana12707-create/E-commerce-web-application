import type { Product } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

interface FeaturedProps {
  products: Product[];
  onShopAll: () => void;
  onOpenProduct: (product: Product) => void;
}

export function Featured({ products, onShopAll, onOpenProduct }: FeaturedProps) {
  if (products.length === 0) return null;
  const featured = products.filter((p) => p.is_featured).slice(0, 3);

  return (
    <section className="py-20 sm:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
              Selected
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Pieces we are loving
            </h2>
          </div>
          <button
            onClick={onShopAll}
            className="group inline-flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 transition self-start sm:self-auto"
          >
            View all
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpenProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
