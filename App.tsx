import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Featured } from '@/components/Featured';
import { ShopGrid } from '@/components/ShopGrid';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { Checkout } from '@/components/Checkout';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { Orders } from '@/components/Orders';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { OrderWithItems, Product } from '@/lib/types';

type View = 'home' | 'shop' | 'orders' | 'checkout' | 'confirmation';

function Storefront() {
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedOrder, setCompletedOrder] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError('Could not load the collection.');
        } else if (data) {
          setProducts(data as Product[]);
        }
        setLoading(false);
      });
  }, []);

  const navigate = (next: 'home' | 'shop' | 'orders') => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = (order: OrderWithItems) => {
    setCompletedOrder(order);
    setView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <Header
        onNavigate={navigate}
        current={view === 'checkout' || view === 'confirmation' ? 'shop' : view}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {view === 'home' && (
        <>
          <Hero onShop={() => navigate('shop')} />
          {loading ? (
            <div className="py-24 flex justify-center">
              <Loader2 className="animate-spin text-stone-400" />
            </div>
          ) : error ? (
            <div className="py-24 text-center text-stone-500">{error}</div>
          ) : (
            <Featured
              products={products}
              onShopAll={() => navigate('shop')}
              onOpenProduct={setSelectedProduct}
            />
          )}
        </>
      )}

      {view === 'shop' && (
        <ShopGrid
          products={products}
          searchQuery={searchQuery}
          onOpenProduct={setSelectedProduct}
        />
      )}

      {view === 'orders' && <Orders />}

      {view === 'checkout' && (
        <Checkout
          onComplete={handleOrderComplete}
          onCancel={() => navigate('shop')}
        />
      )}

      {view === 'confirmation' && completedOrder && (
        <OrderConfirmation
          order={completedOrder}
          onContinue={() => navigate('shop')}
          onTrack={() => navigate('orders')}
        />
      )}

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <CartDrawer onCheckout={handleCheckout} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}
