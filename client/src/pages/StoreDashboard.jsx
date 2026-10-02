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
  TrendingDown
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
      await loadData();
    } catch (err) {
      console.error('Failed to update stock:', err);
      alert('Error updating stock item');
    } finally {
      setUpdatingId(null);
    }
  };

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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Smart Warehouse Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{activeStore.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Live Database Sync Active • {activeStore.address}
          </p>
        </div>

        <button
          onClick={loadData}
          className="bg-[#1f2937] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Refresh Live Stock Data</span>
        </button>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Catalog</span>
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-2xl font-black text-white mt-2 block">{stats.totalProducts || 0}</span>
          <span className="text-[11px] text-slate-500">Tracked SKU items</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-emerald-500/30 p-4 sm:p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Available Items</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 mt-2 block">{stats.availableProducts || 0}</span>
          <span className="text-[11px] text-emerald-500 font-semibold">Ready for instant dispatch</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-amber-500/30 p-4 sm:p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Low-Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400 mt-2 block">{stats.lowStockProducts || 0}</span>
          <span className="text-[11px] text-amber-500 font-semibold">Below safety buffer</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-red-500/30 p-4 sm:p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-red-400 font-semibold">
            <span>Out of Stock</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-2xl font-black text-red-400 mt-2 block">{stats.outOfStockProducts || 0}</span>
          <span className="text-[11px] text-red-500 font-semibold">Requires replenishment</span>
        </div>
      </div>

      {/* SMART RESTOCK SUGGESTIONS BANNER */}
      {restockSuggestions && restockSuggestions.length > 0 && (
        <div className="bg-[#111827] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Smart Warehouse Restock Suggestions</h3>
                <p className="text-xs text-slate-400">Deterministic inventory recommendations based on local order velocity</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {restockSuggestions.slice(0, 3).map(sug => (
              <div key={sug.product_id} className="bg-[#1f2937] rounded-2xl border border-slate-700 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                    <span className={sug.priority === 'CRITICAL' ? 'text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30' : 'text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30'}>
                      {sug.priority} RESTOCK
                    </span>
                    <span className="text-slate-400">Min: {sug.min_threshold}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-white line-clamp-1">{sug.product_name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Current Stock: <strong className="text-red-400">{sug.current_stock}</strong></p>
                  <p className="text-[11px] text-emerald-400 font-bold">Suggested Restock: +{sug.suggested_restock} units</p>
                </div>

                <button
                  onClick={() => handleStockUpdate(sug.product_id, sug.current_stock + sug.suggested_restock, true)}
                  className="mt-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold py-2 px-3 rounded-xl transition-colors flex items-center justify-center space-x-1 shadow-sm"
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
      <div className="bg-[#111827] rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-md">
        
        {/* Table controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search store inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1f2937] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'ALL' ? 'bg-blue-600 text-white' : 'bg-[#1f2937] text-slate-300 hover:bg-slate-800'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterMode('LOW_STOCK')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'LOW_STOCK' ? 'bg-amber-600 text-white' : 'bg-[#1f2937] text-slate-300 hover:bg-slate-800'
              }`}
            >
              Low Stock ({stats.lowStockProducts})
            </button>
            <button
              onClick={() => setFilterMode('OOS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'OOS' ? 'bg-red-600 text-white' : 'bg-[#1f2937] text-slate-300 hover:bg-slate-800'
              }`}
            >
              Out of Stock ({stats.outOfStockProducts})
            </button>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1f2937]/70 text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-800">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Current Qty</th>
                <th className="p-3 text-right">Instant Inventory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.map(item => {
                const isItemOos = item.stock_qty <= 0 || !item.is_available;
                const isItemLow = !isItemOos && item.stock_qty <= item.min_stock_threshold;

                return (
                  <tr key={item.id} className="hover:bg-[#1f2937]/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain bg-[#111827] rounded-lg p-1 border border-slate-800 shrink-0" />
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[11px] text-slate-400">{item.brand} • {item.unit}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-slate-300 font-medium">{item.category_name}</td>

                    <td className="p-3 font-bold text-white">₹{item.price}</td>

                    <td className="p-3">
                      {isItemOos ? (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          OUT OF STOCK
                        </span>
                      ) : isItemLow ? (
                        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          LOW STOCK ({item.stock_qty})
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          IN STOCK
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center font-black text-sm text-white">
                      {item.stock_qty}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={updatingId === item.id || item.stock_qty <= 0}
                          onClick={() => handleStockUpdate(item.id, Math.max(0, item.stock_qty - 1))}
                          className="w-7 h-7 bg-[#1f2937] hover:bg-slate-700 text-white font-bold rounded-lg flex items-center justify-center disabled:opacity-30 border border-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleStockUpdate(item.id, item.stock_qty + 5)}
                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold rounded-lg text-xs flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+5</span>
                        </button>

                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleStockUpdate(item.id, isItemOos ? 10 : 0, !isItemOos ? false : true)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                            isItemOos
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
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
