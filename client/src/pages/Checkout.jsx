import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { createOrder } from '../services/api';
import { MapPin, CreditCard, ShieldCheck, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { currentUser, activeStore } = useUser();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(currentUser.address || 'Flat 402, Green Meadows, Marol, Andheri East, Mumbai 400059');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        user_id: currentUser.id,
        user_name: currentUser.name,
        store_id: activeStore.id,
        store_name: activeStore.name,
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        delivery_address: address,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          item_total: item.product.price * item.quantity
        }))
      };

      const newOrder = await createOrder(orderPayload);
      clearCart();
      navigate(`/orders/${newOrder.id || newOrder.order_number}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review delivery details & confirm your quick-commerce order from Subhash Stores
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Form Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Delivery Address Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center mb-4 pb-3 border-b border-slate-200">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <span>Delivery Address</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Dispatched from nearest local hub ({activeStore.name})
              </p>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center mb-4 pb-3 border-b border-slate-200">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              <span>Payment Option (Demo)</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">UPI Instant</span>
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="text-blue-600"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">Google Pay, PhonePe, Paytm</span>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Cash on Delivery</span>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-blue-600"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">Pay cash or QR on arrival</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Summary Column */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 pb-3 border-b border-slate-200">
              Order Summary
            </h2>

            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs text-slate-600">
                  <span className="line-clamp-1 flex-1 pr-2">{quantity}x {product.name}</span>
                  <span className="font-bold shrink-0 text-slate-900">₹{(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-200">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-900 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span className="text-slate-900 font-medium">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <span>Place Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
