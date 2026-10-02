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
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const { role, switchRole, activeStore, currentUser } = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isStoreMode = role === 'store_manager';
  const isAdminMode = role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#111827] border-b border-slate-800 shadow-md">
      {/* Top Bar with Business Challenge 3-Role Switcher */}
      <div className="bg-[#0b0f17] text-slate-300 text-xs px-3 sm:px-4 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-0 border-b border-slate-800/60">
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md font-black bg-blue-600 text-white uppercase tracking-wider shrink-0">
            620 STORES
          </span>
          <span className="text-slate-400 truncate">
            Mumbai (240) • Bengaluru (210) • Delhi NCR (170)
          </span>
        </div>

        {/* 3-Role Switcher */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500 font-medium hidden md:inline text-[11px]">Role Switcher:</span>
          <div className="bg-[#111827] p-0.5 rounded-lg flex items-center border border-slate-800">
            <button
              onClick={() => switchRole('customer')}
              className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all ${
                role === 'customer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👤 Customer
            </button>
            <button
              onClick={() => switchRole('store_manager')}
              className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all ${
                role === 'store_manager'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏪 Store Portal
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏢 Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-white">NOVA</span>
                  <span className="font-black text-lg sm:text-xl text-blue-500">CART</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold -mt-1 tracking-wider hidden xs:block">HYPERLOCAL NETWORK</p>
              </div>
            </Link>
          </div>

          {/* Hyperlocal Store Location Badge (Customer Mode Desktop) */}
          {!isStoreMode && !isAdminMode && (
            <div className="hidden xl:flex items-center bg-[#1f2937]/70 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 text-xs shrink-0">
              <MapPin className="w-4 h-4 text-blue-400 mr-1.5 shrink-0" />
              <div>
                <div className="font-bold flex items-center space-x-1">
                  <span>{activeStore.name}</span>
                  <span className="text-amber-400">★ {activeStore.rating}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-semibold flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-emerald-400" />
                  <span>Delivery in <strong className="text-emerald-400">{activeStore.delivery_time_mins} mins</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar (Customer Mode - Desktop & Tablet) */}
          {!isStoreMode && !isAdminMode && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search fresh groceries, atta, milk, vegetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1f2937] text-white placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl text-xs border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Right Navigation */}
          <nav className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {isAdminMode ? (
              <>
                <Link
                  to="/admin/stores"
                  className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>620 Stores</span>
                </Link>

                <Link
                  to="/business-insights"
                  className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname === '/business-insights'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Analytics</span>
                </Link>
              </>
            ) : isStoreMode ? (
              <>
                <Link
                  to="/store-dashboard"
                  className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname === '/store-dashboard'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>Store Portal</span>
                </Link>

                <Link
                  to="/business-insights"
                  className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname === '/business-insights'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Insights</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/categories"
                  className={`hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
                    location.pathname === '/categories' ? 'text-blue-400 font-extrabold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Categories
                </Link>

                <Link
                  to="/orders"
                  className={`hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
                    location.pathname.startsWith('/orders') ? 'text-blue-400 font-extrabold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>Orders</span>
                </Link>

                {/* Cart Button */}
                <Link
                  to="/cart"
                  className="relative flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-blue-600/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="bg-white text-blue-900 text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5">
                      {totalItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="flex items-center space-x-1.5 p-1 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-slate-700">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden xl:inline text-slate-200 font-bold pr-1">{currentUser.name.split(' ')[0]}</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Search Bar (Customer Mode) */}
        {!isStoreMode && !isAdminMode && (
          <div className="md:hidden pb-2.5 pt-0.5">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search groceries, atta, milk, snacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1f2937] text-white placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl text-xs border border-slate-700 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </form>
          </div>
        )}
      </div>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111827] border-b border-slate-800 px-4 py-3 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {isAdminMode ? (
            <div className="space-y-1">
              <Link
                to="/admin/stores"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>620 Partner Store Network</span>
              </Link>
              <Link
                to="/business-insights"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Network Business Insights</span>
              </Link>
            </div>
          ) : isStoreMode ? (
            <div className="space-y-1">
              <Link
                to="/store-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>Store Manager Inventory Dashboard</span>
              </Link>
              <Link
                to="/business-insights"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Store Performance Analytics</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <ShoppingBag className="w-4 h-4 text-blue-400" />
                <span>Home</span>
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <ShoppingBag className="w-4 h-4 text-blue-400" />
                <span>Browse Categories</span>
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <Package className="w-4 h-4 text-blue-400" />
                <span>Track Orders</span>
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>Help & Support</span>
              </Link>
            </div>
          )}
        </div>
      )}

    </header>
  );
}
