import { Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-serif text-2xl text-stone-50">Tide</span>
              <span className="font-serif text-2xl text-stone-500 italic">&amp;</span>
              <span className="font-serif text-2xl text-stone-50">Timber</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              A small studio sourcing quiet, lasting objects for the home.
              Made by hand, shipped with care from Portland, Oregon.
            </p>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-4">
              Shop
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-stone-50 transition">Objects</a></li>
              <li><a href="#" className="hover:text-stone-50 transition">Textiles</a></li>
              <li><a href="#" className="hover:text-stone-50 transition">Fragrance</a></li>
              <li><a href="#" className="hover:text-stone-50 transition">Paper</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-stone-500 mb-4">
              Studio
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-stone-50 transition">Our story</a></li>
              <li><a href="#" className="hover:text-stone-50 transition">Journal</a></li>
              <li><a href="#" className="hover:text-stone-50 transition">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-stone-800">
          <p className="text-xs text-stone-500">
            © 2026 Tide &amp; Timber. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-stone-400">
            <a href="#" className="hover:text-stone-50 transition" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-stone-50 transition" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
