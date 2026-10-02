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
  ArrowLeft,
  ShieldCheck
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
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-semibold">Loading product details & stock intelligence...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <Link to="/" className="text-emerald-600 font-bold text-xs mt-2 inline-block">
          ← Return to Home
        </Link>
      </div>
    );
  }

  const isOos = product.stock_qty <= 0 || !product.is_available;
  const inCartItem = cart.find(i => i.product.id === product.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back link */}
      <Link to="/" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </Link>

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Product Image */}
          <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center relative border border-gray-100">
            {isOos && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>OUT OF STOCK</span>
              </span>
            )}
            <img
              src={product.image_url}
              alt={product.name}
              className={`max-h-72 object-contain ${isOos ? 'opacity-50 grayscale' : ''}`}
            />
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs mb-2">
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {product.brand}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 font-semibold">{product.category_name}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {product.name}
              </h1>

              <p className="text-xs text-gray-500 mt-1">Pack Size: <strong className="text-gray-800">{product.unit}</strong></p>

              {/* Price & Discount */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-base text-gray-400 line-through">₹{product.original_price}</span>
                )}
                {product.discount_percent > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    Save {product.discount_percent}%
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Delivery ETA */}
              <div className="mt-5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center space-x-3 text-xs text-emerald-900">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard Delivery in <strong>18 mins</strong> from Subhash Stores — Andheri East</span>
              </div>
            </div>

            {/* ACTION AREA: Add to Cart OR Out-of-Stock Intelligence Block */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              {isOos ? (
                /* OUT OF STOCK BLOCK */
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700">
                    <p className="font-bold flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
                      THIS PRODUCT IS OUT OF STOCK
                    </p>
                    <p className="mt-1 text-red-600">
                      Normal Add to Cart is disabled. Explore our AI rule-based alternative replacement below.
                    </p>
                  </div>

                  {/* Inline Best Alternative Replacement Box */}
                  {oosData.bestAlternative && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-500 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Best Match Available Replacement</span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={oosData.bestAlternative.image_url}
                            alt={oosData.bestAlternative.name}
                            className="w-14 h-14 object-contain bg-white rounded-xl p-1 border border-emerald-200"
                          />
                          <div>
                            <p className="font-extrabold text-sm text-gray-900 line-clamp-1">
                              {oosData.bestAlternative.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {oosData.bestAlternative.unit} • ₹{oosData.bestAlternative.price}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(oosData.bestAlternative, 1, `Added Smart Alternative: ${oosData.bestAlternative.name}`)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 shrink-0"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add Alternative</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* IN STOCK NORMAL ADD TO CART */
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
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

      {/* RECOMMENDATIONS FOR THIS PRODUCT */}
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
