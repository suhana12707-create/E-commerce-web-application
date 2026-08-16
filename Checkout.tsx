import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, generateOrderNumber } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { OrderWithItems } from '@/lib/types';

interface CheckoutProps {
  onComplete: (order: OrderWithItems) => void;
  onCancel: () => void;
}

export function Checkout({ onComplete, onCancel }: CheckoutProps) {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const orderNumber = generateOrderNumber();
      const fullAddress = `${form.address}, ${form.city} ${form.zip}, ${form.country}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: form.name,
          email: form.email,
          shipping_address: fullAddress,
          subtotal,
          shipping,
          total,
          status: 'confirmed',
        })
        .select()
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Order could not be created');

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        unit_price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const complete: OrderWithItems = {
        ...order,
        items: items.map((item) => ({
          id: '',
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          unit_price: item.product.price,
          quantity: item.quantity,
        })),
      };

      clear();
      onComplete(complete);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong placing your order.'
      );
    } finally {
      setLoading(false);
    }
  };

  const field =
    'w-full bg-stone-50 border border-stone-300 rounded-sm px-4 py-3 text-stone-900 placeholder-stone-400 outline-none focus:border-stone-900 transition';

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <button
          onClick={onCancel}
          className="text-sm text-stone-500 hover:text-stone-900 transition mb-6"
        >
          ← Back to cart
        </button>
        <h1 className="font-serif text-4xl text-stone-900 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-sm tracking-wide uppercase text-stone-500 mb-4">
                Contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={field}
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm tracking-wide uppercase text-stone-500 mb-4">
                Shipping address
              </h2>
              <div className="space-y-4">
                <input
                  required
                  placeholder="Street address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={field}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={field}
                  />
                  <input
                    required
                    placeholder="ZIP"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className={field}
                  />
                  <input
                    required
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={field}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full bg-stone-900 text-stone-50 py-4 text-sm tracking-wide rounded-sm hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Placing order...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Place order · {formatPrice(total)}
                </>
              )}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-stone-100 rounded-sm p-6">
              <h2 className="text-sm tracking-wide uppercase text-stone-500 mb-4">
                Order summary
              </h2>
              <ul className="space-y-3 mb-5">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex justify-between text-sm text-stone-700"
                  >
                    <span className="truncate pr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-stone-300 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-medium pt-2 border-t border-stone-300">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              {subtotal < 150 && subtotal > 0 && (
                <p className="text-xs text-stone-500 mt-4">
                  Add {formatPrice(150 - subtotal)} more for free shipping.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
