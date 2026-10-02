import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Truck,
  ArrowLeft,
  Store
} from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Loading live order tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <Link to="/orders" className="text-blue-400 font-bold text-xs mt-2 inline-block">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  // Define tracking steps
  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Received by store' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Store accepted order' },
    { key: 'preparing', label: 'Preparing', desc: 'Items packed in warehouse' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Partner rider assigned' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed to customer' }
  ];

  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'delayed': return 2;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isDelayed = order.status === 'delayed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <Link to="/orders" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-400">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Orders
      </Link>

      {/* Header */}
      <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white">{order.order_number}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {new Date(order.created_at).toLocaleString()} • {order.payment_method}
          </p>
        </div>

        <Link
          to={`/support?orderId=${order.order_number}`}
          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-colors self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Report Issue / Get Support</span>
        </Link>
      </div>

      {/* DELAY NOTICE BANNER */}
      {isDelayed && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-5 text-red-300 flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-sm text-red-400">Order Delay Notice</h3>
            <p className="text-xs text-slate-200 font-semibold mt-0.5">
              Your order is running 15 minutes late due to inventory batch restocking queue at Subhash Stores.
            </p>
            <p className="text-[11px] text-red-400 mt-1">
              Revised Delivery Time: <strong>+{order.delay_minutes || 15} Mins</strong>
            </p>
          </div>
        </div>
      )}

      {/* VISUAL TRACKING TIMELINE STEPPER */}
      <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-md">
        <h2 className="text-base font-extrabold text-white mb-6">Live Order Progress</h2>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIdx && !isDelayed;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="flex md:flex-col items-center space-x-4 md:space-x-0 text-left md:text-center flex-1 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent && isDelayed
                      ? 'bg-red-600 text-white ring-4 ring-red-500/20'
                      : isDone || isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div className="md:mt-3">
                  <h4 className={`font-bold text-xs ${isCurrent ? 'text-blue-400' : 'text-white'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items & Delivery Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Items List */}
        <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-md">
          <h3 className="text-sm font-extrabold text-white mb-4 pb-2 border-b border-slate-800">
            Ordered Items ({order.items?.length || 0})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {(order.items || []).map(item => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                <div>
                  <span className="font-bold text-white">{item.product_name}</span>
                  <span className="text-slate-400 block text-[11px]">Qty: {item.quantity} x ₹{item.price}</span>
                </div>
                <span className="font-extrabold text-white">₹{item.item_total}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-white">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Delivery Fee</span>
              <span className="text-white">₹{order.delivery_fee}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-white pt-1">
              <span>Total Paid</span>
              <span className="text-blue-400">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Fulfillment Store & Address */}
        <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-md space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fulfilling Store</h3>
            <div className="flex items-start space-x-3 bg-[#1f2937]/50 p-3 rounded-2xl border border-slate-800 text-xs">
              <Store className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-white">{order.store_name}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Shop 14, Marol Naka, Andheri East, Mumbai</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Delivery Address</h3>
            <div className="flex items-start space-x-3 bg-[#1f2937]/50 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p className="font-medium">{order.delivery_address}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
