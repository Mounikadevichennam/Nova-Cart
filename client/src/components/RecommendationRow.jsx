import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles, ShoppingBag, MapPin, Zap } from 'lucide-react';

export default function RecommendationRow({ title, subtitle, icon, products, onOpenOosModal, badgeText }) {
  if (!products || products.length === 0) return null;

  const getIcon = () => {
    switch (icon) {
      case 'sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'bag': return <ShoppingBag className="w-5 h-5 text-blue-400" />;
      case 'pin': return <MapPin className="w-5 h-5 text-emerald-400" />;
      default: return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <section className="my-6 sm:my-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 sm:mb-4 gap-1">
        <div>
          <div className="flex items-center space-x-2">
            {getIcon()}
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{title}</h2>
            {badgeText && (
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium italic">
              "{subtitle}"
            </p>
          )}
        </div>
      </div>

      {/* Grid: 2 cols on mobile (320px..430px), 3 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenOosModal={onOpenOosModal}
          />
        ))}
      </div>
    </section>
  );
}
