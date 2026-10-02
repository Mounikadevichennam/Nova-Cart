import React, { useState, useEffect } from 'react';
import { getInventory, updateInventoryStock } from '../services/api';
import { useUser } from '../context/UserContext';
import {
  Store,
  Package,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Minus,
  Search,
  Filter,
  Sparkles,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';

export default function StoreDashboard() {
  const { activeStore } = useUser();
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState({
    stats: { totalProducts: 0, availableProducts: 0, lowStockProducts: 0, outOfStockProducts: 0 },
    restockSuggestions: [],
    data: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'LOW_STOCK', 'OOS'
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getInventory(activeStore.id);
      setInventoryData(res || { stats: {}, restockSuggestions: [], data: [] });
    } catch (err) {
      console.error('Failed to fetch store inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeStore]);

  const handleStockUpdate = async (productId, newQty, isAvailable) => {
    setUpdatingId(productId);
    try {
      await updateInventoryStock(activeStore.id, productId, newQty, isAvailable);
      await loadData(); // Reload live state
    } catch (err) {
      console.error('Failed to update stock:', err);
      alert('Error updating stock item');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter items
  const items = (inventoryData.data || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterMode === 'LOW_STOCK') {
      return matchesSearch && item.stock_qty > 0 && item.stock_qty <= item.min_stock_threshold;
    }
    if (filterMode === 'OOS') {
      return matchesSearch && (item.stock_qty === 0 || !item.is_available);
    }
    return matchesSearch;
  });

  const { stats, restockSuggestions } = inventoryData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Smart Warehouse Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{activeStore.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Live Database Sync Active • {activeStore.address}
          </p>
        </div>

        <button
          onClick={loadData}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Refresh Live Stock Data</span>
        </button>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span>Total Catalog</span>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-2xl font-black text-gray-900 mt-2 block">{stats.totalProducts || 0}</span>
          <span className="text-[11px] text-gray-400">Tracked SKU items</span>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>Available Items</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-800 mt-2 block">{stats.availableProducts || 0}</span>
          <span className="text-[11px] text-emerald-600">Ready for instant dispatch</span>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold">
            <span>Low-Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-800 mt-2 block">{stats.lowStockProducts || 0}</span>
          <span className="text-[11px] text-amber-600">Below minimum safety buffer</span>
        </div>

        <div className="bg-white rounded-2xl border border-red-200 bg-red-50/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-red-700 font-semibold">
            <span>Out of Stock</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-2xl font-black text-red-800 mt-2 block">{stats.outOfStockProducts || 0}</span>
          <span className="text-[11px] text-red-600">Requires immediate replenishment</span>
        </div>
      </div>

      {/* SMART RESTOCK SUGGESTIONS BANNER */}
      {restockSuggestions && restockSuggestions.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-amber-950">Smart Warehouse Restock Suggestions</h3>
                <p className="text-xs text-amber-800">Deterministic inventory engine recommendations based on local order velocity</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {restockSuggestions.slice(0, 3).map(sug => (
              <div key={sug.product_id} className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                    <span className={sug.priority === 'CRITICAL' ? 'text-red-600 bg-red-100 px-2 py-0.5 rounded' : 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded'}>
                      {sug.priority} RESTOCK
                    </span>
                    <span className="text-gray-400">Min Threshold: {sug.min_threshold}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1">{sug.product_name}</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Current Stock: <strong className="text-red-600">{sug.current_stock}</strong></p>
                  <p className="text-[11px] text-emerald-700 font-bold">Suggested Restock: +{sug.suggested_restock} units</p>
                </div>

                <button
                  onClick={() => handleStockUpdate(sug.product_id, sug.current_stock + sug.suggested_restock, true)}
                  className="mt-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold py-2 px-3 rounded-xl transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Apply Restock (+{sug.suggested_restock})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INVENTORY TABLE CONTROL */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
        
        {/* Table controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search store inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'ALL' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterMode('LOW_STOCK')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'LOW_STOCK' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock ({stats.lowStockProducts})
            </button>
            <button
              onClick={() => setFilterMode('OOS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'OOS' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Out of Stock ({stats.outOfStockProducts})
            </button>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-extrabold border-b border-gray-100">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Current Qty</th>
                <th className="p-3 text-right">Instant Inventory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => {
                const isItemOos = item.stock_qty <= 0 || !item.is_available;
                const isItemLow = !isItemOos && item.stock_qty <= item.min_stock_threshold;

                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-gray-100 shrink-0" />
                        <div>
                          <span className="font-bold text-gray-900 block">{item.name}</span>
                          <span className="text-[11px] text-gray-400">{item.brand} • {item.unit}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-gray-600 font-medium">{item.category_name}</td>

                    <td className="p-3 font-bold text-gray-900">₹{item.price}</td>

                    <td className="p-3">
                      {isItemOos ? (
                        <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                          OUT OF STOCK
                        </span>
                      ) : isItemLow ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          LOW STOCK ({item.stock_qty})
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          IN STOCK
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center font-black text-sm text-gray-900">
                      {item.stock_qty}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Decrement */}
                        <button
                          disabled={updatingId === item.id || item.stock_qty <= 0}
                          onClick={() => handleStockUpdate(item.id, Math.max(0, item.stock_qty - 1))}
                          className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Set Stock Input / Plus */}
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleStockUpdate(item.id, item.stock_qty + 5)}
                          className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-xs flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+5</span>
                        </button>

                        {/* Toggle OOS / Available */}
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleStockUpdate(item.id, isItemOos ? 10 : 0, !isItemOos ? false : true)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                            isItemOos
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {isItemOos ? 'Make Available (+10)' : 'Mark OOS'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
