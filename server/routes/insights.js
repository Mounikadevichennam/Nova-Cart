import express from 'express';
import { db } from '../services/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { storeId = 'store-1' } = req.query;

    const products = await db.getProducts(storeId);
    const orders = await db.getOrders();
    const tickets = await db.getSupportTickets();

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const delayedOrders = orders.filter(o => o.status === 'delayed').length;

    const outOfStockCount = products.filter(p => p.stock_qty === 0 || !p.is_available).length;
    const lowStockCount = products.filter(p => p.stock_qty > 0 && p.stock_qty <= p.min_stock_threshold).length;

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    // Computed case study metrics & baseline vs target outcomes
    const currentMetrics = {
      registeredUsers: 120000,
      monthlyOrders: 38500,
      repeatPurchaseRate: 27, // % (down from 41%)
      avgDeliveryTimeMins: 37, // mins (up from 29)
      cancellationRate: 11, // % (up from 6%)
      oosCancellationShare: 35, // % of cancellations due to OOS
      ghostAvailabilityShare: 29, // % customers reporting unavailable post-order
      monthlySupportTickets: 5900
    };

    const targetImpacts = [
      {
        metric: "Repeat Purchase Rate",
        current: "27%",
        projected: "38%",
        impact: "+11% recovery driven by Multi-Category & Personalised Discovery",
        type: "Target Outcome"
      },
      {
        metric: "OOS Order Cancellations",
        current: "35% of total",
        projected: "12% of total",
        impact: "-65% drop via Smart OOS Alternatives & Daily Stock Sync",
        type: "Target Outcome"
      },
      {
        metric: "Average Delivery Time",
        current: "37 mins",
        projected: "24 mins",
        impact: "Saved 13 mins via Hyperlocal Warehouse Priority Routing",
        type: "Target Outcome"
      },
      {
        metric: "Support Ticket Friction",
        current: "5,900 / mo",
        projected: "2,400 / mo",
        impact: "-59% reduction via Instant Timeline Delay Transparency",
        type: "Target Outcome"
      }
    ];

    const categoryBreakdown = [
      { category: 'Atta, Rice & Dal', percentage: 34, revenue: 1309000 },
      { category: 'Dairy, Eggs & Bread', percentage: 28, revenue: 1078000 },
      { category: 'Oil, Ghee & Masalas', percentage: 16, revenue: 616000 },
      { category: 'Fresh Fruits & Veggies', percentage: 12, revenue: 462000 },
      { category: 'Snacks & Beverages', percentage: 6, revenue: 231000 },
      { category: 'Cleaning & Household', percentage: 4, revenue: 154000 }
    ];

    const cancellationReasons = [
      { reason: 'Product Out of Stock at Store', percentage: 35, color: '#ef4444' },
      { reason: 'Store Update Delay (>24h old)', percentage: 29, color: '#f97316' },
      { reason: 'Delivery Delay Exceeding SLA', percentage: 21, color: '#eab308' },
      { reason: 'Customer Changed Mind', percentage: 15, color: '#94a3b8' }
    ];

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          completedOrders,
          cancelledOrders,
          delayedOrders,
          outOfStockCount,
          lowStockCount,
          totalRevenue: totalRevenue.toFixed(2),
          averageOrderValue,
          openSupportTickets: tickets.filter(t => t.status === 'open').length
        },
        currentMetrics,
        targetImpacts,
        categoryBreakdown,
        cancellationReasons
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch business insights', error: error.message });
  }
});

export default router;
