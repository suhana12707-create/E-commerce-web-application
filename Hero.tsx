import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShop: () => void;
}

export function Hero({ onShop }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-stone-100">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/278664/pexels-photo-278664.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/55 via-stone-900/25 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full">
        <div className="max-w-xl">
          <p className="text-stone-100 text-xs sm:text-sm tracking-[0.25em] uppercase mb-5 animate-fade-in">
            New Season · Autumn 2026
          </p>
          <h1 className="font-serif text-stone-50 text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight animate-fade-in-up">
            Quiet objects for a slower home.
          </h1>
          <p className="text-stone-100/90 text-base sm:text-lg leading-relaxed mt-6 max-w-md animate-fade-in-up animation-delay-100">
            A small, considered collection of ceramics, textiles and fragrance —
            made by hand, meant to last.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-9 animate-fade-in-up animation-delay-200">
            <button
              onClick={onShop}
              className="group inline-flex items-center justify-center gap-2 bg-stone-50 text-stone-900 px-7 py-4 text-sm tracking-wide rounded-sm hover:bg-white transition-colors"
            >
              Shop the collection
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <button className="inline-flex items-center justify-center border border-stone-100/40 text-stone-50 px-7 py-4 text-sm tracking-wide rounded-sm hover:bg-stone-100/10 transition-colors">
              Our story
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-100/70 text-[11px] tracking-[0.2em] uppercase animate-fade-in animation-delay-300">
        Scroll
      </div>
    </section>
  );
}
