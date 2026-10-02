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
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Loading live order tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
        <Link to="/orders" className="text-emerald-600 font-bold text-xs mt-2 inline-block">
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
      case 'delayed': return 2; // Delayed during preparation/dispatch queue
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isDelayed = order.status === 'delayed';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <Link to="/orders" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-gray-900">{order.order_number}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Placed on {new Date(order.created_at).toLocaleString()} • {order.payment_method}
          </p>
        </div>

        <Link
          to={`/support?orderId=${order.order_number}`}
          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-colors self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Report Issue / Get Support</span>
        </Link>
      </div>

      {/* DELAY NOTICE BANNER */}
      {isDelayed && (
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-3xl p-5 text-red-900 flex items-start space-x-3 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-sm text-red-700">Order Delay Notice</h3>
            <p className="text-xs text-red-800 font-semibold mt-0.5">
              Your order is running 15 minutes late due to inventory batch restocking queue at Subhash Stores.
            </p>
            <p className="text-[11px] text-red-600 mt-1">
              Revised Delivery Time: <strong>+{order.delay_minutes || 15} Mins</strong>
            </p>
          </div>
        </div>
      )}

      {/* VISUAL TRACKING TIMELINE STEPPER */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-extrabold text-gray-900 mb-6">Live Order Progress</h2>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIdx && !isDelayed;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="flex md:flex-col items-center space-x-4 md:space-x-0 text-left md:text-center flex-1 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent && isDelayed
                      ? 'bg-red-600 text-white ring-4 ring-red-200'
                      : isDone || isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div className="md:mt-3">
                  <h4 className={`font-bold text-xs ${isCurrent ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items & Delivery Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Items List */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Ordered Items ({order.items?.length || 0})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {(order.items || []).map(item => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                <div>
                  <span className="font-bold text-gray-900">{item.product_name}</span>
                  <span className="text-gray-500 block text-[11px]">Qty: {item.quantity} x ₹{item.price}</span>
                </div>
                <span className="font-extrabold text-gray-900">₹{item.item_total}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Fee</span>
              <span>₹{order.delivery_fee}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-gray-900 pt-1">
              <span>Total Paid</span>
              <span className="text-emerald-700">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Fulfillment Store & Address */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fulfilling Store</h3>
            <div className="flex items-start space-x-3 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 text-xs">
              <Store className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-emerald-950">{order.store_name}</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">Shop 14, Marol Naka, Andheri East, Mumbai</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</h3>
            <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs text-gray-700">
              <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <p className="font-medium">{order.delivery_address}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
