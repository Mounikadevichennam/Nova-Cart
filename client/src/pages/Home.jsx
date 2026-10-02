import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts, getRecommendations } from '../services/api';
import ProductCard from '../components/ProductCard';
import RecommendationRow from '../components/RecommendationRow';
import OutOfStockModal from '../components/OutOfStockModal';
import { GridSkeleton } from '../components/LoadingSkeleton';
import {
  ShoppingBag,
  Sparkles,
  Clock,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState({
    recommendedForYou: [],
    frequentlyBoughtTogether: [],
    localPicks: []
  });

  // Out of Stock Modal State
  const [selectedOosProduct, setSelectedOosProduct] = useState(null);
  const [isOosModalOpen, setIsOosModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catData, prodData, recData] = await Promise.all([
          getCategories(),
          getProducts('store-1'),
          getRecommendations('user-1', null, 'store-1')
        ]);
        setCategories(catData || []);
        setProducts(prodData || []);
        setRecommendations(recData || {});
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenOosModal = (product) => {
    setSelectedOosProduct(product);
    setIsOosModalOpen(true);
  };

  const oosProducts = products.filter(p => p.stock_qty === 0 || !p.is_available);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* HERO SECTION — PASSES THE 5-SECOND TEST */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl space-y-4 relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-extrabold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Connecting 620 Local Stores Across Mumbai, Bengaluru & Delhi NCR</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Shop Fresh Groceries from Local Stores.<br />
            <span className="text-emerald-400">Zero Ghost Stock. Smart Alternatives.</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
            NOVA CART bridges neighborhood stores with 18-minute delivery, deterministic product recommendations, and instant price-matched out-of-stock replacements.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/categories"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center space-x-2"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Explore All Categories</span>
            </Link>

            <a
              href="#oos-demo"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl border border-slate-700 transition-all flex items-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Try Out-of-Stock Demo</span>
            </a>

            <Link
              to="/admin/stores"
              className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 font-bold text-xs sm:text-sm px-4 py-3.5 rounded-2xl transition-all flex items-center space-x-1.5"
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>View 620 Store Network</span>
            </Link>
          </div>

        </div>

        {/* Hyperlocal Fulfilled Badge */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Active Store: <strong className="text-white">Subhash Stores — Andheri East</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Delivery SLA: <strong className="text-white">18 Minutes Guaranteed</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Database Sync: <strong className="text-white">100% Live Availability</strong></span>
          </div>
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Shop by Grocery Category</h2>
            <p className="text-xs text-gray-500">Explore fresh staples, dairy, vegetables, and daily household needs</p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center">
            View All Categories <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/categories?slug=${cat.slug}`}
              className="bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-md p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-gray-900 group-hover:text-emerald-700 line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* OUT OF STOCK INTELLIGENCE DEMO BANNER */}
      <div id="oos-demo" className="bg-amber-50 border border-amber-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Core Business Feature</span>
            </div>
            <h3 className="text-lg font-black text-gray-900">
              Smart Out-of-Stock Intelligence Engine
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-xl">
              29% of quick-commerce users experience ghost availability. Click an unavailable item below to see NOVA CART's price-matched alternative replacement in action!
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {oosProducts.slice(0, 2).map(prod => (
              <button
                key={prod.id}
                onClick={() => handleOpenOosModal(prod)}
                className="bg-white border-2 border-red-300 hover:border-red-500 px-3.5 py-2.5 rounded-2xl text-xs text-left shadow-sm transition-all group flex items-center space-x-2"
              >
                <img src={prod.image_url} alt={prod.name} className="w-8 h-8 object-contain" />
                <div>
                  <span className="block font-bold text-gray-900 line-clamp-1 text-[11px] group-hover:text-red-600">
                    {prod.name}
                  </span>
                  <span className="text-[10px] text-red-600 font-extrabold uppercase">OUT OF STOCK • Click Demo</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS SECTIONS */}
      {loading ? (
        <GridSkeleton count={8} />
      ) : (
        <>
          {/* Section 1: Recommended For You */}
          <RecommendationRow
            title="Recommended for You"
            subtitle="Based on your staple purchases and order history in Mumbai"
            icon="sparkles"
            badgeText="Personalized Engine"
            products={recommendations.recommendedForYou}
            onOpenOosModal={handleOpenOosModal}
          />

          {/* Section 2: Frequently Bought Together */}
          <RecommendationRow
            title="Frequently Bought Together"
            subtitle="Popular recipe & daily pairings ordered together"
            icon="bag"
            badgeText="Pairing Engine"
            products={recommendations.frequentlyBoughtTogether}
            onOpenOosModal={handleOpenOosModal}
          />

          {/* Section 3: Popular Near You / Local Picks */}
          <RecommendationRow
            title="Popular at Subhash Stores"
            subtitle="Fastest delivery items in stock at Andheri East"
            icon="pin"
            badgeText="Hyperlocal Store Stock"
            products={recommendations.localPicks}
            onOpenOosModal={handleOpenOosModal}
          />
        </>
      )}

      {/* Out of Stock Modal */}
      <OutOfStockModal
        product={selectedOosProduct}
        isOpen={isOosModalOpen}
        onClose={() => setIsOosModalOpen(false)}
      />

    </div>
  );
}
