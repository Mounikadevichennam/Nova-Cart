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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* OOS Warning Header */}
        <div className="flex items-start space-x-3 border-b border-gray-100 pb-4 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                OUT OF STOCK
              </span>
              <span className="text-xs text-gray-500">Subhash Stores — Andheri East</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mt-1">
              {product.name} ({product.unit})
            </h2>
            <p className="text-xs text-red-600 font-medium mt-0.5">
              Normal Add to Cart is disabled because this item is currently unavailable in store inventory.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-6">
          
          {loading ? (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-medium">Evaluating category inventory & price matching...</p>
            </div>
          ) : (
            <>
              {/* BEST ALTERNATIVE HIGHLIGHT BOX */}
              {data.bestAlternative ? (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-500/40 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>BEST MATCH ALTERNATIVE</span>
                  </div>

                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Recommended Replacement</span>
                  
                  <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img
                        src={data.bestAlternative.image_url}
                        alt={data.bestAlternative.name}
                        className="w-20 h-20 object-contain bg-white rounded-xl p-2 border border-emerald-100"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {data.bestAlternative.brand}
                        </span>
                        <h4 className="font-bold text-gray-900 text-base mt-1">
                          {data.bestAlternative.name}
                        </h4>
                        <p className="text-xs text-gray-500">{data.bestAlternative.unit}</p>
                        
                        <div className="mt-1 flex items-baseline space-x-2">
                          <span className="text-lg font-black text-gray-900">₹{data.bestAlternative.price}</span>
                          {data.bestAlternative.priceDifference && (
                            <span className="text-xs font-medium text-emerald-700">
                              ({data.bestAlternative.priceDifference > 0 ? `+₹${data.bestAlternative.priceDifference}` : `₹${data.bestAlternative.priceDifference}`})
                            </span>
                          )}
                          <span className="text-xs text-emerald-700 font-semibold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            In Stock ({data.bestAlternative.stock_qty} available)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddAlternative(data.bestAlternative)}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/30 shrink-0"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Alternative to Cart</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                  No exact match alternative found in this store currently.
                </div>
              )}

              {/* ADDITIONAL SIMILAR BRAND ALTERNATIVES */}
              {data.alternatives.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Other In-Stock Options in {product.category_name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.alternatives.map(alt => (
                      <div
                        key={alt.id}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={alt.image_url}
                            alt={alt.name}
                            className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-gray-100"
                          />
                          <div>
                            <p className="font-bold text-xs text-gray-900 line-clamp-1">{alt.name}</p>
                            <p className="text-[11px] text-gray-500">{alt.unit} • ₹{alt.price}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddAlternative(alt)}
                          className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg shrink-0 transition-colors"
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
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>NOVA CART Out-of-Stock Intelligence Engine</span>
          <button onClick={onClose} className="text-gray-600 font-semibold hover:underline">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
