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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      
      {/* HERO SECTION — 5-SECOND TEST COMPLIANT */}
      <div className="bg-[#111827] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl space-y-3 sm:space-y-4 relative z-10">
          
          <div className="inline-flex items-center space-x-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
            <span className="truncate">Connecting 620 Stores in Mumbai, Bengaluru & Delhi NCR</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Shop from Nearby Local Stores<br />
            <span className="text-blue-400">With Reliable Availability & Smart Alternatives.</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base font-medium leading-relaxed">
            NOVA CART connects 620 neighborhood stores across Mumbai, Bengaluru & Delhi NCR with 18-minute delivery SLA, zero ghost stock, and instant price-matched alternatives.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            <Link
              to="/categories"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore All Categories</span>
            </Link>

            <a
              href="#oos-demo"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-4 py-3.5 rounded-xl sm:rounded-2xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Try Out-of-Stock Demo</span>
            </a>

            <Link
              to="/admin/stores"
              className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs sm:text-sm px-4 py-3.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center space-x-1.5"
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>View 620 Store Network</span>
            </Link>
          </div>

        </div>

        {/* Hyperlocal Fulfilled Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] sm:text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Store: <strong className="text-white">Subhash Stores — Andheri East</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Delivery SLA: <strong className="text-emerald-400">18 Mins Guaranteed</strong></span>
          </div>
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">Grocery Categories</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Fresh staples, produce & daily needs</p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center">
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/categories?slug=${cat.slug}`}
              className="bg-[#111827] border border-slate-800 hover:border-blue-500 hover:shadow-lg p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex flex-col items-center text-center transition-all group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform border border-blue-500/20">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-bold text-[10px] sm:text-xs text-slate-200 group-hover:text-blue-400 line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* OUT OF STOCK INTELLIGENCE DEMO BANNER */}
      <div id="oos-demo" className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-3 h-3" />
              <span>Core Business Feature</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Smart Out-of-Stock Intelligence Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              29% of quick-commerce users experience ghost availability. Click an unavailable item below to see NOVA CART's price-matched alternative replacement in action!
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {oosProducts.slice(0, 2).map(prod => (
              <button
                key={prod.id}
                onClick={() => handleOpenOosModal(prod)}
                className="bg-slate-50 border border-slate-200 hover:border-red-500 p-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs text-left shadow-sm transition-all group flex items-center space-x-2 flex-1 sm:flex-none"
              >
                <img src={prod.image_url} alt={prod.name} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
                <div>
                  <span className="block font-bold text-slate-900 line-clamp-1 text-[10px] sm:text-[11px] group-hover:text-red-600">
                    {prod.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-red-600 font-extrabold uppercase">OUT OF STOCK • Demo</span>
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
          <RecommendationRow
            title="Recommended for You"
            subtitle="Based on your staple purchases and order history in Mumbai"
            icon="sparkles"
            badgeText="Personalized Engine"
            products={recommendations.recommendedForYou}
            onOpenOosModal={handleOpenOosModal}
          />

          <RecommendationRow
            title="Frequently Bought Together"
            subtitle="Popular recipe & daily pairings ordered together"
            icon="bag"
            badgeText="Pairing Engine"
            products={recommendations.frequentlyBoughtTogether}
            onOpenOosModal={handleOpenOosModal}
          />

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
