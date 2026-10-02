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
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group relative">
      
      {/* Discount Badge */}
      {product.discount_percent > 0 && !isOos && (
        <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
          {product.discount_percent}% OFF
        </span>
      )}

      {/* Out of Stock Ribbon / Overlay */}
      {isOos && (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3" />
          <span>OUT OF STOCK</span>
        </div>
      )}

      {/* Image & Link to Detail */}
      <div className="relative pt-4 px-4 bg-gray-50/80 flex items-center justify-center h-44 overflow-hidden border-b border-gray-100">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            onError={(e) => handleImageError(e, product.category_id)}
            className={`object-contain max-h-36 group-hover:scale-105 transition-transform duration-300 ${
              isOos ? 'opacity-50 grayscale' : ''
            }`}
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
              {product.brand}
            </span>
            <span className="text-[11px] font-semibold text-gray-400">{product.unit}</span>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Stock Status Notification */}
          <div className="mt-2 text-xs">
            {isOos ? (
              <span className="text-red-600 font-bold text-[11px] flex items-center space-x-1">
                <span>Unavailable in Store Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="text-amber-800 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Only {product.stock_qty} left in stock
              </span>
            ) : (
              <span className="text-emerald-700 text-[11px] font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>In Stock • Fast Delivery</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Button */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-black text-gray-900">₹{product.price}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-gray-400 line-through">₹{product.original_price}</span>
              )}
            </div>
          </div>

          {/* Action Button: Add to Cart for available items, View Alternative for OOS items */}
          {isOos ? (
            <button
              onClick={() => onOpenOosModal ? onOpenOosModal(product) : null}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-black px-3 py-2 rounded-xl flex items-center space-x-1 transition-colors shadow-sm"
              title="View Smart Out-of-Stock Alternatives"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Alternatives</span>
            </button>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className={`text-xs font-black px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-sm ${
                cartQty > 0
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
