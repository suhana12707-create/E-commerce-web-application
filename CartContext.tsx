import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'tide-timber-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return {
      items,
      isOpen,
      count,
      subtotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (product, quantity = 1) => {
        setItems((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prev, { product, quantity }];
        });
        setIsOpen(true);
      },
      removeItem: (productId) =>
        setItems((prev) => prev.filter((item) => item.product.id !== productId)),
      updateQuantity: (productId, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((item) => item.product.id !== productId)
            : prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              )
        ),
      clear: () => setItems([]),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
