import { Check } from 'lucide-react';
import type { OrderWithItems } from '@/lib/types';
import { formatDate, formatPrice } from '@/lib/format';

interface OrderConfirmationProps {
  order: OrderWithItems;
  onContinue: () => void;
  onTrack: () => void;
}

export function OrderConfirmation({ order, onContinue, onTrack }: OrderConfirmationProps) {
  return (
    <section className="pt-28 pb-20 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 w-full">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-emerald-700" />
          </div>
          <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
            Order placed
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 tracking-tight">
            Thank you, {order.customer_name.split(' ')[0]}.
          </h1>
          <p className="text-stone-500 mt-4">
            We have received your order and will send a confirmation to{' '}
            <span className="text-stone-700">{order.email}</span>.
          </p>
        </div>

        <div className="border border-stone-200 rounded-sm bg-stone-50 p-6 sm:p-8 animate-fade-in-up animation-delay-100">
          <div className="flex justify-between items-start mb-6 pb-5 border-b border-stone-200">
            <div>
              <p className="text-xs tracking-wide text-stone-500">Order number</p>
              <p className="font-medium text-stone-900 mt-1">
                {order.order_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs tracking-wide text-stone-500">Date</p>
              <p className="font-medium text-stone-900 mt-1">
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {order.items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between text-sm text-stone-700"
              >
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>{formatPrice(item.unit_price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 text-sm border-t border-stone-200 pt-4">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span>
                {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-stone-900 font-medium pt-2 border-t border-stone-200">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 animate-fade-in-up animation-delay-200">
          <button
            onClick={onTrack}
            className="flex-1 bg-stone-900 text-stone-50 py-3.5 text-sm tracking-wide rounded-sm hover:bg-stone-800 transition"
          >
            Track this order
          </button>
          <button
            onClick={onContinue}
            className="flex-1 border border-stone-300 text-stone-700 py-3.5 text-sm tracking-wide rounded-sm hover:bg-stone-100 transition"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </section>
  );
}
