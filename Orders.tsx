import { useEffect, useState } from 'react';
import { Loader2, Package, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem } from '@/lib/types';
import { formatDate, formatPrice } from '@/lib/format';

const STATUS_STEPS: Order['status'][] = ['confirmed', 'packing', 'shipped', 'delivered'];

const STATUS_LABELS: Record<Order['status'], string> = {
  confirmed: 'Confirmed',
  packing: 'Packing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export function Orders() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);

      if (data && data.length > 0) {
        const ids = data.map((o) => o.id);
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', ids);

        if (itemsError) throw itemsError;
        const map: Record<string, OrderItem[]> = {};
        (items || []).forEach((item) => {
          if (!map[item.order_id]) map[item.order_id] = [];
          map[item.order_id].push(item);
        });
        setItemsByOrder(map);
      } else {
        setItemsByOrder({});
      }
    } catch {
      setError('Could not look up orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orders.length === 0) return;
    const ids = orders.map((o) => o.id);
    supabase
      .from('order_items')
      .select('*')
      .in('order_id', ids)
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, OrderItem[]> = {};
        data.forEach((item) => {
          if (!map[item.order_id]) map[item.order_id] = [];
          map[item.order_id].push(item);
        });
        setItemsByOrder(map);
      });
  }, [orders]);

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
            Order tracking
          </p>
          <h1 className="font-serif text-4xl text-stone-900 tracking-tight">
            Your orders
          </h1>
          <p className="text-stone-500 mt-3">
            Enter the email you used at checkout to see your order history.
          </p>
        </div>

        <form onSubmit={search} className="flex gap-3 mb-10">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-sm pl-11 pr-4 py-3 text-stone-900 placeholder-stone-400 outline-none focus:border-stone-900 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-stone-900 text-stone-50 px-6 py-3 text-sm tracking-wide rounded-sm hover:bg-stone-800 transition disabled:bg-stone-300 inline-flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Find'}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {searched && !loading && orders.length === 0 && !error && (
          <div className="text-center py-16">
            <Package size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="font-serif text-xl text-stone-900 mb-1">No orders found</p>
            <p className="text-sm text-stone-500">
              We could not find any orders for that email.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => {
            const items = itemsByOrder[order.id] || [];
            const currentStep = STATUS_STEPS.indexOf(order.status);
            return (
              <div
                key={order.id}
                className="border border-stone-200 rounded-sm p-6 bg-stone-50"
              >
                <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
                  <div>
                    <p className="text-xs tracking-wide text-stone-500">
                      Order {order.order_number}
                    </p>
                    <p className="text-sm text-stone-700">
                      Placed {formatDate(order.created_at)}
                    </p>
                  </div>
                  <p className="font-medium text-stone-900">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mb-6">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex-1 flex items-center gap-1.5">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                            i <= currentStep
                              ? 'bg-stone-900 text-stone-50'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {i + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-1.5 tracking-wide ${
                            i <= currentStep ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {STATUS_LABELS[step]}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className={`h-px flex-1 mt-[-14px] ${
                            i < currentStep ? 'bg-stone-900' : 'bg-stone-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <ul className="space-y-2 border-t border-stone-200 pt-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between text-sm text-stone-700"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.unit_price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
