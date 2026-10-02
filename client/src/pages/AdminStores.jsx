import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStores } from '../services/api';
import {
  Store,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Star,
  Clock,
  ArrowRight,
  Building2,
  Layers
} from 'lucide-react';

export default function AdminStores() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    networkSummary: {
      totalStores: 620,
      activeStoresCount: 588,
      inactiveStoresCount: 32,
      cityBreakdown: { mumbai: 240, bengaluru: 210, delhi: 170 },
      avgRating: 4.7,
      avgSlaMins: 19
    },
    filteredCount: 620,
    stores: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchNetwork = async () => {
    setLoading(true);
    try {
      const res = await getStores(searchTerm, selectedCity, selectedStatus);
      setData(res);
    } catch (err) {
      console.error('Failed to load store network:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetwork();
  }, [selectedCity, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNetwork();
  };

  const { networkSummary, stores } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Network Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Partner Store Network Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">620 Hyperlocal Partner Stores</h1>
            <p className="text-xs text-slate-400 mt-1">
              Connecting local neighborhood stores across Mumbai, Bengaluru & Delhi NCR
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center space-x-6 text-xs shrink-0">
            <div>
              <span className="text-slate-400 block">Total Stores</span>
              <span className="text-2xl font-black text-emerald-400">620</span>
            </div>
            <div className="border-l border-slate-700 pl-6">
              <span className="text-slate-400 block">Active Status</span>
              <span className="text-sm font-bold text-white">{networkSummary.activeStoresCount} Active</span>
            </div>
            <div className="border-l border-slate-700 pl-6">
              <span className="text-slate-400 block">Avg Delivery SLA</span>
              <span className="text-sm font-bold text-white">{networkSummary.avgSlaMins} Mins</span>
            </div>
          </div>
        </div>

        {/* City Breakdown Summary */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-center text-xs">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Mumbai Network</span>
            <span className="text-base font-extrabold text-white">240 Stores</span>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Bengaluru Network</span>
            <span className="text-base font-extrabold text-white">210 Stores</span>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Delhi NCR Network</span>
            <span className="text-base font-extrabold text-white">170 Stores</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-[#111827] rounded-2xl sm:rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search store name, area, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="font-bold text-slate-400">City:</span>
              {['All', 'Mumbai', 'Bengaluru', 'Delhi NCR'].map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCity === city
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1.5 text-xs ml-auto md:ml-0">
              <span className="font-bold text-slate-400">Status:</span>
              {['All', 'Active', 'Inactive'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedStatus === st
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* STORES GRID */}
      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold">Loading 620 store network list...</p>
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-[#111827] rounded-3xl p-12 text-center text-slate-400 border border-slate-800">
          <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No partner stores found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting city or search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map(store => (
            <div
              key={store.id}
              className="bg-[#111827] rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:shadow-xl transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded mr-2">
                      {store.city}
                    </span>
                    <h3 className="font-extrabold text-base text-white line-clamp-1 mt-1">
                      {store.name}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                    store.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {store.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" />
                  <span className="line-clamp-1">{store.address}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#1e293b]/60 border border-slate-700/60 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Rating & SLA</span>
                    <span className="font-bold text-white flex items-center">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                      {store.rating} • {store.delivery_time_mins} mins
                    </span>
                  </div>

                  <div className="bg-[#1e293b]/60 border border-slate-700/60 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Inventory</span>
                    <span className="font-bold text-white">
                      {store.total_products || 240} items
                    </span>
                  </div>
                </div>

                {/* Stock distribution stats */}
                <div className="mt-3 flex items-center justify-between text-[11px] bg-[#1e293b]/40 p-2 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-semibold">{store.available_products || 205} Available</span>
                  <span className="text-amber-400 font-semibold">{store.low_stock_products || 20} Low</span>
                  <span className="text-red-400 font-semibold">{store.out_of_stock_products || 15} OOS</span>
                </div>
              </div>

              <Link
                to={`/admin/stores/${store.id}`}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <span>View Store Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
