import { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-stone-50 shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-stone-700" />
            <h2 className="font-serif text-lg text-stone-900">Your Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="text-stone-500 hover:text-stone-900 transition"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
              <ShoppingBag size={24} className="text-stone-400" />
            </div>
            <p className="font-serif text-lg text-stone-900">Your cart is empty</p>
            <p className="text-sm text-stone-500 leading-relaxed">
              Thoughtful objects for slow living. Add something you love.
            </p>
            <button
              onClick={closeCart}
              className="mt-2 text-sm tracking-wide text-stone-700 underline underline-offset-4 hover:text-stone-900"
            >
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-stone-100 overflow-hidden rounded-sm">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-medium text-stone-900 truncate">
                          {item.product.name}
                        </p>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-stone-400 hover:text-stone-700 transition"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-300 rounded-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-stone-600 hover:text-stone-900 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-2 text-sm text-stone-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-stone-600 hover:text-stone-900 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-stone-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-stone-200 px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={onCheckout}
                className="w-full bg-stone-900 text-stone-50 py-3.5 text-sm tracking-wide rounded-sm hover:bg-stone-800 transition-colors"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
