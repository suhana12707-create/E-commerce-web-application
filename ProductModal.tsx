import { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [product]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm grid grid-cols-1 sm:grid-cols-2 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-square sm:aspect-auto bg-stone-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-7 sm:p-10 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[11px] tracking-[0.15em] uppercase text-stone-400">
              {product.category}
            </p>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-900 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <h2 className="font-serif text-3xl text-stone-900 leading-tight">
            {product.name}
          </h2>
          <p className="text-xl text-stone-700 mt-3">{formatPrice(product.price)}</p>
          <p className="text-stone-600 leading-relaxed mt-5 text-sm">
            {product.description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                product.in_stock ? 'bg-emerald-500' : 'bg-stone-400'
              }`}
            />
            <span className="text-stone-600">
              {product.in_stock ? 'In stock' : 'Currently sold out'}
            </span>
          </div>

          <div className="mt-auto pt-8 flex gap-3">
            <button
              onClick={() => {
                addItem(product);
                onClose();
              }}
              disabled={!product.in_stock}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 text-stone-50 py-4 text-sm tracking-wide rounded-sm hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              Add to cart
            </button>
            <button
              onClick={onClose}
              className="px-5 border border-stone-300 text-stone-700 text-sm rounded-sm hover:bg-stone-100 transition"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
