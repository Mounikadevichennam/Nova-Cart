import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import {
  ShoppingBag,
  Search,
  MapPin,
  Clock,
  User,
  HelpCircle,
  Package,
  Store,
  BarChart3,
  Building2,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const { role, switchRole, activeStore, currentUser } = useUser();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isStoreMode = role === 'store_manager';
  const isAdminMode = role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar with Business Challenge 3-Role Switcher */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white uppercase tracking-wider">
            620 Store Network MVP
          </span>
          <span className="hidden md:inline text-slate-300">
            Mumbai (240) • Bengaluru (210) • Delhi NCR (170)
          </span>
        </div>

        {/* 3-Role Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium hidden sm:inline text-[11px]">Role Switcher:</span>
          <div className="bg-slate-800 p-0.5 rounded-lg flex items-center border border-slate-700">
            <button
              onClick={() => switchRole('customer')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                role === 'customer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              👤 Customer
            </button>
            <button
              onClick={() => switchRole('store_manager')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                role === 'store_manager'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🏪 Store Portal
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🏢 Admin (620 Network)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-md">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-black text-xl tracking-tight text-slate-900">NOVA</span>
                <span className="font-black text-xl text-emerald-600">CART</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold -mt-1 tracking-wider">HYPERLOCAL GROCERY NETWORK</p>
            </div>
          </Link>

          {/* Hyperlocal Store Location Badge (Customer Mode) */}
          {!isStoreMode && !isAdminMode && (
            <div className="hidden lg:flex items-center bg-emerald-50 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs shrink-0">
              <MapPin className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <div>
                <div className="font-bold flex items-center space-x-1">
                  <span>{activeStore.name}</span>
                  <span className="text-emerald-700">★ {activeStore.rating}</span>
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Delivery in <strong>{activeStore.delivery_time_mins} mins</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar (Customer Mode) */}
          {!isStoreMode && !isAdminMode && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fresh groceries, atta, milk, fruits, snacks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 focus:bg-white text-gray-900 pl-10 pr-10 py-2 rounded-xl text-xs sm:text-sm border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Right Navigation */}
          <nav className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {isAdminMode ? (
              <>
                <Link
                  to="/admin/stores"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>620 Partner Stores</span>
                </Link>

                <Link
                  to="/business-insights"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === '/business-insights'
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Network Analytics</span>
                </Link>
              </>
            ) : isStoreMode ? (
              <>
                <Link
                  to="/store-dashboard"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === '/store-dashboard'
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Store Portal</span>
                </Link>

                <Link
                  to="/business-insights"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    location.pathname === '/business-insights'
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                  <span>Business Insights</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/categories"
                  className={`hidden sm:flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-bold ${
                    location.pathname === '/categories' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  Categories
                </Link>

                <Link
                  to="/orders"
                  className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-bold ${
                    location.pathname.startsWith('/orders') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden md:inline">Orders</span>
                </Link>

                <Link
                  to="/support"
                  className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-bold ${
                    location.pathname === '/support' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden md:inline">Support</span>
                </Link>

                {/* Cart Button */}
                <Link
                  to="/cart"
                  className="relative flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="bg-white text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-full ml-1">
                      {totalItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Badge */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-1.5 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-gray-50 text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden xl:inline text-gray-800 font-bold">{currentUser.name.split(' ')[0]}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
