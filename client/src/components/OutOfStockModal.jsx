import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getOutOfStockAlternatives } from '../services/api';
import { X, AlertTriangle, ArrowRight, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function OutOfStockModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ bestAlternative: null, alternatives: [] });

  useEffect(() => {
    if (isOpen && product) {
      setLoading(true);
      getOutOfStockAlternatives(product.id)
        .then(res => {
          if (res?.success) {
            setData({
              bestAlternative: res.bestAlternative,
              alternatives: res.alternatives || []
            });
          }
        })
        .catch(err => console.error('Error fetching OOS data:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddAlternative = (altProduct) => {
    addToCart(altProduct, 1, `Added Smart Alternative: ${altProduct.name} to Cart 🛒`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* OOS Warning Header */}
        <div className="flex items-start space-x-3 border-b border-slate-800 pb-4 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                OUT OF STOCK
              </span>
              <span className="text-xs text-slate-400">Subhash Stores — Andheri East</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {product.name} ({product.unit})
            </h2>
            <p className="text-xs text-red-400 font-medium mt-0.5">
              Normal Add to Cart is disabled because this item is currently unavailable in store inventory.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-6">
          
          {loading ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-medium">Evaluating category inventory & price matching...</p>
            </div>
          ) : (
            <>
              {/* BEST ALTERNATIVE HIGHLIGHT BOX */}
              {data.bestAlternative ? (
                <div className="bg-[#1f2937]/70 border-2 border-blue-500/60 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>BEST MATCH ALTERNATIVE</span>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Recommended Replacement</span>
                  
                  <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img
                        src={data.bestAlternative.image_url}
                        alt={data.bestAlternative.name}
                        className="w-20 h-20 object-contain bg-[#111827] rounded-xl p-2 border border-slate-800"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                          {data.bestAlternative.brand}
                        </span>
                        <h4 className="font-bold text-white text-base mt-1">
                          {data.bestAlternative.name}
                        </h4>
                        <p className="text-xs text-slate-400">{data.bestAlternative.unit}</p>
                        
                        <div className="mt-1 flex items-baseline space-x-2">
                          <span className="text-lg font-black text-white">₹{data.bestAlternative.price}</span>
                          {data.bestAlternative.priceDifference && (
                            <span className="text-xs font-medium text-emerald-400">
                              ({data.bestAlternative.priceDifference > 0 ? `+₹${data.bestAlternative.priceDifference}` : `₹${data.bestAlternative.priceDifference}`})
                            </span>
                          )}
                          <span className="text-xs text-emerald-400 font-semibold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            In Stock ({data.bestAlternative.stock_qty} available)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddAlternative(data.bestAlternative)}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/30 shrink-0"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Alternative to Cart</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-900 rounded-xl text-center text-xs text-slate-400">
                  No exact match alternative found in this store currently.
                </div>
              )}

              {/* ADDITIONAL SIMILAR BRAND ALTERNATIVES */}
              {data.alternatives.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Other In-Stock Options in {product.category_name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.alternatives.map(alt => (
                      <div
                        key={alt.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={alt.image_url}
                            alt={alt.name}
                            className="w-12 h-12 object-contain bg-[#111827] rounded-lg p-1 border border-slate-800"
                          />
                          <div>
                            <p className="font-bold text-xs text-white line-clamp-1">{alt.name}</p>
                            <p className="text-[11px] text-slate-400">{alt.unit} • ₹{alt.price}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddAlternative(alt)}
                          className="text-xs font-bold text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 px-3 py-1.5 rounded-lg shrink-0 transition-colors border border-blue-500/30"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Inventory reflected from latest store update • NOVA CART OOS Engine</span>
          <button onClick={onClose} className="text-slate-400 font-semibold hover:underline">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
