import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageHelper';
import { ShoppingCart, AlertTriangle, RefreshCw, Check } from 'lucide-react';

export default function ProductCard({ product, onOpenOosModal }) {
  const { cart, addToCart } = useCart();

  if (!product) return null;

  const isOos = product.stock_qty <= 0 || product.is_available === false;
  const isLowStock = !isOos && product.stock_qty <= product.min_stock_threshold;
  
  const inCartItem = cart.find(i => i.product.id === product.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group relative shadow-sm">
      
      {/* Discount Badge */}
      {product.discount_percent > 0 && !isOos && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
          {product.discount_percent}% OFF
        </span>
      )}

      {/* Out of Stock Ribbon / Overlay */}
      {isOos && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3" />
          <span>OUT OF STOCK</span>
        </div>
      )}

      {/* Image & Link to Detail */}
      <div className="relative pt-3 px-3 bg-slate-50 flex items-center justify-center h-40 sm:h-44 overflow-hidden border-b border-slate-100">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            onError={(e) => handleImageError(e, product.category_id)}
            className={`object-contain max-h-32 sm:max-h-36 group-hover:scale-105 transition-transform duration-300 ${
              isOos ? 'opacity-40 grayscale' : ''
            }`}
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[10px]">
              {product.brand}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{product.unit}</span>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Stock Status Notification */}
          <div className="mt-2 text-xs">
            {isOos ? (
              <span className="text-red-600 font-bold text-[10px] sm:text-[11px] flex items-center space-x-1">
                <span>Unavailable in Store Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-800 font-bold text-[10px] sm:text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Only {product.stock_qty} left in stock
              </span>
            ) : (
              <span className="text-emerald-700 text-[10px] sm:text-[11px] font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>In Stock • Fast Delivery</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Button */}
        <div className="mt-3 sm:mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-sm sm:text-base font-black text-slate-900">₹{product.price}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">₹{product.original_price}</span>
              )}
            </div>
          </div>

          {/* Action Button: Add to Cart for available items, View Alternative for OOS items */}
          {isOos ? (
            <button
              onClick={() => onOpenOosModal ? onOpenOosModal(product) : null}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-colors shadow-sm"
              title="View Smart Out-of-Stock Alternatives"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Alternatives</span>
            </button>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className={`text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-sm ${
                cartQty > 0
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{cartQty > 0 ? `In Cart (${cartQty})` : 'Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
