import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16 border-t border-slate-800">
      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-slate-800 pb-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">18-Min Hyperlocal Delivery</h4>
            <p className="text-xs text-slate-400 mt-1">Dispatched directly from Subhash Stores</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">Smart OOS Alternatives</h4>
            <p className="text-xs text-slate-400 mt-1">Instant quality replacements for out of stock items</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">Live Inventory Sync</h4>
            <p className="text-xs text-slate-400 mt-1">Zero ghost stock — real database availability</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">Empowering 620 Stores</h4>
            <p className="text-xs text-slate-400 mt-1">Connecting local kiranas across 3 Indian cities</p>
          </div>
        </div>

        {/* Footer Meta & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white text-xs font-extrabold">
              N
            </div>
            <span className="font-bold text-slate-200">NOVA CART Quick-Commerce Platform</span>
            <span>— Built for Hackathon MVP</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>Mumbai</span>
            <span>•</span>
            <span>Bengaluru</span>
            <span>•</span>
            <span>Delhi NCR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
