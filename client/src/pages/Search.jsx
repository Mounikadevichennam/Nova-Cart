import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import OutOfStockModal from '../components/OutOfStockModal';
import { GridSkeleton } from '../components/LoadingSkeleton';
import { Search as SearchIcon, AlertTriangle } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const [selectedOosProduct, setSelectedOosProduct] = useState(null);
  const [isOosModalOpen, setIsOosModalOpen] = useState(false);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      try {
        const results = await getProducts('store-1', query);
        setProducts(results || []);
      } catch (err) {
        console.error('Error searching products:', err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  const filteredProducts = onlyInStock
    ? products.filter(p => p.stock_qty > 0 && p.is_available)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Search Bar Header */}
      <div className="bg-[#111827] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md mb-8">
        <h1 className="text-xl font-black text-white flex items-center">
          <SearchIcon className="w-5 h-5 text-blue-400 mr-2" />
          <span>Search Results for "{query || 'All Items'}"</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Found {filteredProducts.length} items matching your query in Subhash Stores inventory
        </p>

        {/* Filter Toggle */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 bg-slate-900 border-slate-700"
            />
            <span>Show Only In-Stock Products</span>
          </label>

          <span className="text-xs text-slate-400">
            {products.filter(p => p.stock_qty === 0).length} out-of-stock items available for smart replacements
          </span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <GridSkeleton count={8} />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#111827] rounded-3xl p-12 text-center text-slate-400 border border-slate-800">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No products matching "{query}"</h3>
          <p className="text-xs text-slate-400 mt-1">Try searching for atta, milk, oil, tea, or biscuits.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
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

      <OutOfStockModal
        product={selectedOosProduct}
        isOpen={isOosModalOpen}
        onClose={() => setIsOosModalOpen(false)}
      />

    </div>
  );
}
