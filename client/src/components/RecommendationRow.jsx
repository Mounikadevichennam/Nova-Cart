import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles, ShoppingBag, MapPin, Zap } from 'lucide-react';

export default function RecommendationRow({ title, subtitle, icon, products, onOpenOosModal, badgeText }) {
  if (!products || products.length === 0) return null;

  const getIcon = () => {
    switch (icon) {
      case 'sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'bag': return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'pin': return <MapPin className="w-5 h-5 text-blue-600" />;
      default: return <Zap className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section className="my-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            {getIcon()}
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
            {badgeText && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 font-medium italic">
              "{subtitle}"
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
