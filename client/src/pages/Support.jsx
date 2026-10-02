import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSupportTickets, createSupportTicket, getOrders } from '../services/api';
import { useUser } from '../context/UserContext';
import StatusBadge from '../components/StatusBadge';
import { HelpCircle, Plus, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Support() {
  const [searchParams] = useSearchParams();
  const initialOrderNo = searchParams.get('orderId') || '';

  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);

  // Form State
  const [showForm, setShowForm] = useState(Boolean(initialOrderNo));
  const [selectedOrderNo, setSelectedOrderNo] = useState(initialOrderNo);
  const [category, setCategory] = useState('Delayed delivery');
  const [subject, setSubject] = useState(initialOrderNo ? `Issue regarding order ${initialOrderNo}` : '');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [ticketList, orderList] = await Promise.all([
          getSupportTickets(currentUser.id),
          getOrders(currentUser.id)
        ]);
        setTickets(ticketList || []);
        setOrders(orderList || []);
      } catch (err) {
        console.error('Failed to load support tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedOrder = orders.find(o => o.order_number === selectedOrderNo);

      const payload = {
        order_id: selectedOrder?.id || null,
        order_number: selectedOrderNo || 'N/A',
        user_id: currentUser.id,
        user_name: currentUser.name,
        category,
        subject,
        description
      };

      const newTicket = await createSupportTicket(payload);
      setTickets([newTicket, ...tickets]);
      setShowForm(false);
      setDescription('');
      setSubject('');
      alert('Support ticket created successfully! Our team will respond shortly.');
    } catch (err) {
      console.error('Failed to create ticket:', err);
      alert('Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const supportCategories = [
    'Delayed delivery',
    'Refund status',
    'Missing product',
    'Wrong product',
    'Product unavailable',
    'Coupon issue'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Help & Support</h1>
          <p className="text-xs text-slate-400 mt-1">
            Resolve delivery delays, missing items, or out-of-stock alternative refunds
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel Ticket' : 'Create New Ticket'}</span>
        </button>
      </div>

      {/* NEW SUPPORT TICKET FORM */}
      {showForm && (
        <form onSubmit={handleSubmitTicket} className="bg-[#111827] rounded-3xl border-2 border-blue-500/50 p-6 shadow-xl space-y-4">
          <h2 className="text-base font-extrabold text-white pb-2 border-b border-slate-800 flex items-center">
            <HelpCircle className="w-5 h-5 text-blue-400 mr-2" />
            <span>Create Support Ticket</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Select Order (Optional)</label>
              <select
                value={selectedOrderNo}
                onChange={(e) => setSelectedOrderNo(e.target.value)}
                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- No specific order --</option>
                {orders.map(o => (
                  <option key={o.id} value={o.order_number}>
                    {o.order_number} ({o.status} - ₹{o.total_amount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {supportCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              required
              placeholder="Brief summary of the issue..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what happened in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
          >
            {submitting ? 'Submitting...' : 'Submit Support Ticket'}
          </button>
        </form>
      )}

      {/* TICKETS LIST */}
      <div className="space-y-4">
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Your Active & Resolved Tickets</h2>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading support tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="bg-[#111827] rounded-3xl p-8 text-center text-slate-400 border border-slate-800 text-xs">
            No support tickets submitted yet.
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-[#111827] rounded-2xl border border-slate-800 p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-white">{ticket.ticket_number}</span>
                  <span className="text-xs bg-[#1f2937] text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-700">
                    {ticket.category}
                  </span>
                </div>
                <StatusBadge status={ticket.status} type="ticket" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">{ticket.subject}</h4>
                <p className="text-xs text-slate-300 mt-1">{ticket.description}</p>
              </div>

              {ticket.resolution_notes && (
                <div className="bg-[#1f2937]/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200">
                  <span className="font-bold block text-blue-400">Support Resolution:</span>
                  <p className="mt-0.5 text-slate-300">{ticket.resolution_notes}</p>
                </div>
              )}

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 flex justify-between">
                <span>Associated Order: <strong className="text-white">{ticket.order_number || 'None'}</strong></span>
                <span>Submitted: {new Date(ticket.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
