import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import { useUser } from '../context/UserContext';
import StatusBadge from '../components/StatusBadge';
import { Package, Clock, ArrowRight, HelpCircle, AlertTriangle } from 'lucide-react';

export default function Orders() {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const list = await getOrders(currentUser.id);
        setOrders(list || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Your Orders</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track live quick-commerce order status, delivery timelines, and support tickets
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#111827] rounded-3xl p-12 text-center text-slate-400 border border-slate-800">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-400 mt-1">Start by adding fresh groceries to your cart!</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-[#111827] rounded-2xl border border-slate-800 p-5 hover:border-blue-500/50 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <span className="font-extrabold text-sm text-white">{order.order_number}</span>
                  <StatusBadge status={order.status} />
                </div>

                <p className="text-xs text-slate-400">
                  {order.store_name} • {new Date(order.created_at).toLocaleString()}
                </p>

                <div className="mt-2 text-xs text-slate-300 font-medium line-clamp-1">
                  {(order.items || []).map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                </div>

                {order.status === 'delayed' && (
                  <div className="mt-2 text-[11px] font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/30 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Delay notice: Running 15 minutes late</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 shrink-0 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                <span className="font-black text-base text-white">₹{order.total_amount}</span>
                <Link
                  to={`/orders/${order.id || order.order_number}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1"
                >
                  <span>Track Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
