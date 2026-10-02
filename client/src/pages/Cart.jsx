import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, totalAmount } = useCart();

  const freeDeliveryThreshold = 499;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-[#111827] border border-slate-800 rounded-full flex items-center justify-center mx-auto text-blue-400 mb-4 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
          Explore fresh groceries, daily staples, and smart recommendations to fill your cart.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all"
        >
          <span>Start Shopping Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dispatched from <strong className="text-slate-200">Subhash Stores — Andheri East</strong>
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Progress Indicator */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1.5">
          <span className="flex items-center">
            <Truck className="w-4 h-4 mr-1 text-emerald-400" />
            {remainingForFree === 0 ? '🎉 You unlocked FREE Delivery!' : `Add ₹${remainingForFree.toFixed(0)} more for FREE Delivery`}
          </span>
          <span className="text-slate-400">₹{subtotal.toFixed(0)} / ₹{freeDeliveryThreshold}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${progressToFreeDelivery}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-[#111827] rounded-2xl border border-slate-800 p-4 flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-contain bg-[#1f2937]/50 rounded-xl p-1 border border-slate-800 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-extrabold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                    {product.brand}
                  </span>
                  <h3 className="font-bold text-sm text-white line-clamp-1 mt-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400">{product.unit} • ₹{product.price}</p>
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="flex items-center bg-[#1f2937] rounded-xl p-1 border border-slate-700">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold hover:bg-slate-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="block font-black text-sm text-white">
                    ₹{(product.price * quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-[11px] text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-md">
            <h2 className="text-base font-extrabold text-white mb-4 pb-3 border-b border-slate-800">
              Bill Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Item Subtotal ({cart.length} items)</span>
                <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Delivery Charge</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-400 uppercase">FREE</span>
                ) : (
                  <span className="font-bold text-white">₹{deliveryFee.toFixed(2)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="font-black text-sm text-white">To Pay</span>
                <span className="font-black text-xl text-blue-400">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Guaranteed zero ghost availability — all items verified in store stock.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
