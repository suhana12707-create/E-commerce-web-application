import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group cursor-pointer" onClick={() => onOpen(product)}>
      <div className="relative aspect-square bg-stone-100 overflow-hidden rounded-sm mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-stone-50/95 text-stone-900 text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
            {product.badge}
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute top-3 right-3 bg-stone-900/80 text-stone-50 text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
            Sold out
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (product.in_stock) addItem(product);
          }}
          disabled={!product.in_stock}
          className="absolute bottom-3 right-3 bg-stone-900 text-stone-50 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed translate-y-1 group-hover:translate-y-0"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] tracking-[0.15em] uppercase text-stone-400">
          {product.category}
        </p>
        <h3 className="text-stone-900 font-medium leading-snug">{product.name}</h3>
        <p className="text-stone-700 text-sm">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
