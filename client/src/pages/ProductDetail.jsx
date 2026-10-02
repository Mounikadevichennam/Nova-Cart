import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getRecommendations, getOutOfStockAlternatives } from '../services/api';
import { useCart } from '../context/CartContext';
import RecommendationRow from '../components/RecommendationRow';
import OutOfStockModal from '../components/OutOfStockModal';
import {
  ShoppingCart,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { cart, addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState({
    frequentlyBoughtTogether: [],
    similarProducts: []
  });
  const [oosData, setOosData] = useState({ bestAlternative: null, alternatives: [] });

  const [selectedOosProduct, setSelectedOosProduct] = useState(null);
  const [isOosModalOpen, setIsOosModalOpen] = useState(false);

  useEffect(() => {
    async function loadProductDetail() {
      setLoading(true);
      try {
        const prod = await getProductById(id, 'store-1');
        setProduct(prod);

        if (prod) {
          if (prod.stock_qty <= 0 || !prod.is_available) {
            const oosRes = await getOutOfStockAlternatives(prod.id, 'store-1');
            setOosData({
              bestAlternative: oosRes.bestAlternative,
              alternatives: oosRes.alternatives || []
            });
          }

          const recRes = await getRecommendations('user-1', prod.id, 'store-1');
          setRecommendations(recRes || {});
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-semibold">Loading product details & stock intelligence...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link to="/" className="text-blue-400 font-bold text-xs mt-2 inline-block">
          ← Return to Home
        </Link>
      </div>
    );
  }

  const isOos = product.stock_qty <= 0 || !product.is_available;
  const inCartItem = cart.find(i => i.product.id === product.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Back link */}
      <Link to="/" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-400">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </Link>

      {/* Main Product Card */}
      <div className="bg-[#111827] rounded-3xl border border-slate-800 p-5 md:p-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Product Image */}
          <div className="bg-[#1f2937]/50 rounded-2xl p-6 flex items-center justify-center relative border border-slate-800">
            {isOos && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>OUT OF STOCK</span>
              </span>
            )}
            <img
              src={product.image_url}
              alt={product.name}
              className={`max-h-72 object-contain ${isOos ? 'opacity-40 grayscale' : ''}`}
            />
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs mb-2">
                <span className="font-extrabold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 rounded-md">
                  {product.brand}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-semibold">{product.category_name}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {product.name}
              </h1>

              <p className="text-xs text-slate-400 mt-1">Pack Size: <strong className="text-white">{product.unit}</strong></p>

              {/* Price & Discount */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-white">₹{product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-base text-slate-500 line-through">₹{product.original_price}</span>
                )}
                {product.discount_percent > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                    Save {product.discount_percent}%
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Delivery ETA */}
              <div className="mt-5 p-3 rounded-2xl bg-[#1f2937]/70 border border-slate-800 flex items-center space-x-3 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Delivery in <strong className="text-emerald-400">18 mins</strong> from Subhash Stores — Andheri East</span>
              </div>
            </div>

            {/* ACTION AREA */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              {isOos ? (
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-xs text-red-300">
                    <p className="font-bold flex items-center text-red-400">
                      <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
                      THIS PRODUCT IS OUT OF STOCK
                    </p>
                    <p className="mt-1 text-slate-300">
                      Normal Add to Cart is disabled. Explore our rule-based alternative replacement below.
                    </p>
                  </div>

                  {/* Inline Best Alternative Replacement Box */}
                  {oosData.bestAlternative && (
                    <div className="bg-[#1f2937]/80 border-2 border-blue-500/60 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Best Match Available Replacement</span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={oosData.bestAlternative.image_url}
                            alt={oosData.bestAlternative.name}
                            className="w-14 h-14 object-contain bg-[#111827] rounded-xl p-1 border border-slate-800"
                          />
                          <div>
                            <p className="font-extrabold text-sm text-white line-clamp-1">
                              {oosData.bestAlternative.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {oosData.bestAlternative.unit} • ₹{oosData.bestAlternative.price}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(oosData.bestAlternative, 1, `Added Smart Alternative: ${oosData.bestAlternative.name}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/30 flex items-center space-x-1.5 shrink-0"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add Alternative</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{cartQty > 0 ? `In Cart (${cartQty} items)` : 'Add to Cart'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <RecommendationRow
        title="Frequently Bought Together"
        subtitle={`Items commonly ordered alongside ${product.name}`}
        icon="bag"
        products={recommendations.frequentlyBoughtTogether}
        onOpenOosModal={(p) => {
          setSelectedOosProduct(p);
          setIsOosModalOpen(true);
        }}
      />

      <RecommendationRow
        title="Similar Products in Category"
        subtitle={`Alternative options in ${product.category_name}`}
        icon="sparkles"
        products={recommendations.similarProducts}
        onOpenOosModal={(p) => {
          setSelectedOosProduct(p);
          setIsOosModalOpen(true);
        }}
      />

      <OutOfStockModal
        product={selectedOosProduct}
        isOpen={isOosModalOpen}
        onClose={() => setIsOosModalOpen(false)}
      />

    </div>
  );
}
