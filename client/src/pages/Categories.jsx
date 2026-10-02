import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import OutOfStockModal from '../components/OutOfStockModal';
import { GridSkeleton } from '../components/LoadingSkeleton';
import { Filter, ShoppingBag } from 'lucide-react';

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSlug = searchParams.get('slug') || '';

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedOosProduct, setSelectedOosProduct] = useState(null);
  const [isOosModalOpen, setIsOosModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catList, prodList] = await Promise.all([
          getCategories(),
          getProducts('store-1', '', selectedSlug)
        ]);
        setCategories(catList || []);
        setProducts(prodList || []);
      } catch (err) {
        console.error('Failed to fetch category data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedSlug]);

  const handleCategorySelect = (slug) => {
    if (slug === selectedSlug) {
      setSearchParams({});
    } else {
      setSearchParams({ slug });
    }
  };

  const activeCategoryName = categories.find(c => c.slug === selectedSlug)?.name || 'All Grocery Categories';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">{activeCategoryName}</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore fresh items available for 18-min delivery from Subhash Stores — Andheri East
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Category Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 p-4 sticky top-24">
            <div className="flex items-center space-x-2 font-bold text-xs text-white uppercase tracking-wider mb-3 pb-2.5 border-b border-slate-800">
              <Filter className="w-4 h-4 text-blue-400" />
              <span>Categories</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  !selectedSlug
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                All Products
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedSlug === cat.slug
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="line-clamp-1">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <GridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="bg-[#111827] rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 mt-1">Try selecting another category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenOosModal={(p) => {
                    setSelectedOosProduct(p);
                    setIsOosModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </main>

      </div>

      <OutOfStockModal
        product={selectedOosProduct}
        isOpen={isOosModalOpen}
        onClose={() => setIsOosModalOpen(false)}
      />

    </div>
  );
}
