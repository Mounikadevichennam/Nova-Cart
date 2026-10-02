import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoreById, updateInventoryStock } from '../services/api';
import {
  Store,
  MapPin,
  Star,
  Clock,
  Package,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Search,
  Plus,
  Minus,
  TrendingDown
} from 'lucide-react';

export default function StoreDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await getStoreById(id);
      setStoreData(res);
    } catch (err) {
      console.error('Failed to load store details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleStockUpdate = async (productId, newQty, isAvailable) => {
    setUpdatingId(productId);
    try {
      await updateInventoryStock(id, productId, newQty, isAvailable);
      await loadDetails();
    } catch (err) {
      console.error('Error updating inventory item:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || !storeData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Loading store inventory & database status...</p>
      </div>
    );
  }

  const { store, products, stats } = storeData;

  const filteredProducts = (products || []).filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link to="/admin/stores" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to 620 Store Network
      </Link>

      {/* STORE METADATA HEADER */}
      <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Store Inventory Controller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{store.name}</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {store.address} ({store.city})
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-[#1e293b] border border-slate-700 p-3.5 rounded-2xl text-center text-xs">
            <span className="text-slate-400 block text-[10px]">Rating & SLA</span>
            <span className="font-extrabold text-amber-400 flex items-center justify-center mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              {store.rating} ({store.delivery_time_mins} mins)
            </span>
          </div>

          <div className="bg-[#1e293b] border border-slate-700 p-3.5 rounded-2xl text-center text-xs">
            <span className="text-slate-400 block text-[10px]">Network Status</span>
            <span className={`font-black uppercase text-xs mt-0.5 block ${store.is_active ? 'text-emerald-400' : 'text-red-400'}`}>
              {store.is_active ? 'ACTIVE STORE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-4 shadow-sm">
          <span className="text-xs text-slate-400 font-semibold block">Total Catalog Items</span>
          <span className="text-2xl font-black text-white mt-1 block">{stats.totalProducts}</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-emerald-500/30 p-4 shadow-sm">
          <span className="text-xs text-emerald-400 font-semibold block">Available In Stock</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.availableProducts}</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-amber-500/30 p-4 shadow-sm">
          <span className="text-xs text-amber-400 font-semibold block">Low Stock Items</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{stats.lowStockProducts}</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-red-500/30 p-4 shadow-sm">
          <span className="text-xs text-red-400 font-semibold block">Out of Stock Items</span>
          <span className="text-2xl font-black text-red-400 mt-1 block">{stats.outOfStockProducts}</span>
        </div>
      </div>

      {/* STORE SPECIFIC INVENTORY LIST */}
      <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-white">Inventory Catalog for {store.name}</h2>
            <p className="text-xs text-slate-400">Live database stock state mapped to customer availability</p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search store catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1e293b]/70 text-slate-300 uppercase tracking-wider font-extrabold border-b border-slate-800">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock Status</th>
                <th className="p-3 text-center">Stock Qty</th>
                <th className="p-3 text-right">Direct Stock Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.map(item => {
                const isOos = item.stock_qty <= 0 || !item.is_available;
                const isLow = !isOos && item.stock_qty <= item.min_stock_threshold;

                return (
                  <tr key={item.id} className="hover:bg-[#1e293b]/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 object-contain bg-[#1e293b] rounded-lg p-1 border border-slate-700 shrink-0" />
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[11px] text-slate-400">{item.brand} • {item.unit}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-slate-300 font-medium">{item.category_name}</td>

                    <td className="p-3 font-bold text-white">₹{item.price}</td>

                    <td className="p-3">
                      {isOos ? (
                        <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          OUT OF STOCK
                        </span>
                      ) : isLow ? (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          LOW STOCK ({item.stock_qty})
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          AVAILABLE
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
                          className="w-7 h-7 bg-[#1e293b] hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-lg flex items-center justify-center disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleStockUpdate(item.id, item.stock_qty + 5)}
                          className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold rounded-lg text-xs flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+5</span>
                        </button>

                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleStockUpdate(item.id, isOos ? 15 : 0, !isOos ? false : true)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                            isOos
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                          }`}
                        >
                          {isOos ? 'Set Available' : 'Set OOS'}
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
