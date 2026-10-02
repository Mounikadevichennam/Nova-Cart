import React from 'react';
import { useUser } from '../context/UserContext';
import { User, MapPin, Mail, Phone, Store, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { currentUser, role, activeStore } = useUser();
  
  const displayAddress = currentUser.address || (activeStore ? `${activeStore.address} (${activeStore.city})` : 'Subhash Stores, Andheri East, Mumbai');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{currentUser.name}</h1>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">
              Role: {role === 'customer' ? 'Customer Account (Demo)' : role === 'store_manager' ? 'Store Manager (Demo)' : 'Network Admin (Demo)'}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-xs">
          <div className="flex items-center space-x-3 text-slate-700">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{currentUser.email}</span>
          </div>

          {currentUser.phone && (
            <div className="flex items-center space-x-3 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{currentUser.phone}</span>
            </div>
          )}

          <div className="flex items-start space-x-3 text-slate-700">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-slate-900">
                {role === 'store_manager' ? 'Assigned Store Location Address:' : 'Saved Delivery Address:'}
              </span>
              <span className="text-slate-600 font-medium">{displayAddress}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-700 pt-3 border-t border-slate-200">
            <Store className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Active Store: <strong className="text-slate-900">{activeStore.name}</strong> ({activeStore.city})</span>
          </div>
        </div>
      </div>

    </div>
  );
}
