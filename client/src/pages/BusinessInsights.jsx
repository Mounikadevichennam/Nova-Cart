import React, { useState, useEffect } from 'react';
import { getBusinessInsights } from '../services/api';
import { useUser } from '../context/UserContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  RefreshCcw,
  Target,
  AlertTriangle,
  Users,
  ShoppingBag,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

export default function BusinessInsights() {
  const { activeStore } = useUser();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      setLoading(true);
      try {
        const data = await getBusinessInsights(activeStore.id);
        setInsights(data);
      } catch (err) {
        console.error('Failed to load business insights:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, [activeStore]);

  if (loading || !insights) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold">Computing business performance & target impact projections...</p>
      </div>
    );
  }

  const { summary, currentMetrics, targetImpacts, categoryBreakdown, cancellationReasons } = insights;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-[#111827] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Executive Business Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">NOVA CART Impact & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time problem diagnostics & explicit projected target outcomes
          </p>
        </div>

        <div className="bg-[#1e293b] border border-slate-700 p-3.5 rounded-2xl text-xs text-slate-300">
          <span className="text-amber-400 font-extrabold block">Current Platform Repeat Rate: 27%</span>
          <span className="text-[11px] text-emerald-400 font-bold mt-0.5 block">PROJECTED TARGET OUTCOME: Recover to 38%</span>
        </div>
      </div>

      {/* CORE KPI CARDS (REAL APP DATA) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Orders (App Data)</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-white mt-2 block">{summary.totalOrders}</span>
          <span className="text-[11px] text-emerald-400 font-bold">Avg Order Value: ₹{summary.averageOrderValue}</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Repeat Customers Baseline</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black text-white mt-2 block">27%</span>
          <span className="text-[11px] text-amber-400 font-bold">Down from 41% baseline</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Store OOS Products</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-2xl font-black text-red-400 mt-2 block">{summary.outOfStockCount} Items</span>
          <span className="text-[11px] text-red-400 font-bold">35% cancellations root cause</span>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Support Tickets</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-black text-white mt-2 block">{summary.openSupportTickets} Open</span>
          <span className="text-[11px] text-slate-400">5,900 tickets/mo platform wide</span>
        </div>
      </div>

      {/* PROJECTED TARGET OUTCOME & EXPECTED BUSINESS IMPACT */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-[#111827] to-emerald-900/30 border border-emerald-500/40 rounded-3xl p-6 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>PROJECTED TARGET OUTCOMES (EXPECTED BUSINESS IMPACT)</span>
        </div>
        <h3 className="text-lg font-black text-white mb-1">
          Expected Business Impact Model
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          The metrics below represent explicitly calculated target projections based on NOVA CART's platform deployment:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {targetImpacts.map((item, idx) => (
            <div key={idx} className="bg-[#111827] rounded-2xl p-4 border border-emerald-500/30 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                  PROJECTED TARGET OUTCOME
                </span>
                <h4 className="font-extrabold text-xs text-white mt-2">{item.metric}</h4>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-xs text-red-400 line-through">Baseline: {item.current}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-lg font-black text-emerald-400">{item.projected}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-3 font-medium pt-2 border-t border-slate-800">
                {item.impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Revenue Breakdown */}
        <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-white mb-1">Sales Breakdown by Grocery Category</h3>
          <p className="text-xs text-slate-400 mb-6">Multi-category buyers generate 2.4x higher repeat purchases</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Root Cause of Cancellations */}
        <div className="bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-white mb-1">Cancellations Root Cause Analysis</h3>
          <p className="text-xs text-slate-400 mb-4">35% of total cancellations stem from out-of-stock items</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cancellationReasons}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="percentage"
                  nameKey="reason"
                >
                  {cancellationReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {cancellationReasons.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-300 text-[11px] line-clamp-1">{item.reason} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
