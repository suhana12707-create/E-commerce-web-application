import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onNavigate: (view: 'home' | 'shop' | 'orders') => void;
  current: string;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header({ onNavigate, current, onSearch, searchQuery }: HeaderProps) {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = (view: 'home' | 'shop' | 'orders') => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-stone-800 hover:text-stone-600 transition"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => nav('home')}
              className="flex items-baseline gap-1 group"
            >
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-stone-900">
                Tide
              </span>
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-stone-400 italic">
                &amp;
              </span>
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-stone-900">
                Timber
              </span>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {(['shop', 'orders'] as const).map((view) => (
              <button
                key={view}
                onClick={() => nav(view)}
                className={`text-sm tracking-wide transition-colors ${
                  current === view
                    ? 'text-stone-900 font-medium'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {view === 'shop' ? 'Shop' : 'Orders'}
              </button>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-stone-500 hover:text-stone-900 transition"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden text-stone-600 hover:text-stone-900 transition"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={openCart}
              className="relative text-stone-800 hover:text-stone-600 transition"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-stone-50 text-[10px] font-medium rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-stone-50">
          <div className="flex items-center justify-between h-16 px-5 border-b border-stone-200">
            <span className="font-serif text-xl text-stone-900">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-stone-600"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col p-6 gap-1">
            {(['home', 'shop', 'orders'] as const).map((view) => (
              <button
                key={view}
                onClick={() => nav(view)}
                className={`text-left py-4 text-2xl font-serif border-b border-stone-200 transition ${
                  current === view ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                {view === 'home' ? 'Home' : view === 'shop' ? 'Shop' : 'Orders'}
              </button>
            ))}
          </nav>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-stone-50 px-5 sm:px-8 py-6 border-b border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Search size={20} className="text-stone-400" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  onSearch(e.target.value);
                  if (current !== 'shop') onNavigate('shop');
                }}
                placeholder="Search the collection..."
                className="flex-1 bg-transparent text-lg text-stone-900 placeholder-stone-400 outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-stone-500 hover:text-stone-900"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
