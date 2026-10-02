// NOVA CART Database Service Layer
// Seamlessly connects to Supabase PostgreSQL or falls back to stateful dataset (620 Store Network)

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  mockCategories,
  mockStores,
  mockUsers,
  mockProducts,
  mockInventory,
  mockOrders,
  mockSupportTickets
} from '../data/mockData.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let useSupabase = false;

if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes('your-supabase-project')) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    useSupabase = true;
    console.log('✅ Supabase PostgreSQL Client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Could not connect to Supabase, defaulting to stateful store:', err.message);
  }
} else {
  console.log('ℹ️ Running in fast local/stateful mode with 620-Store Network dataset.');
}

// In-memory stateful store (mutable for instant live inventory & order sync)
let state = {
  categories: [...mockCategories],
  stores: [...mockStores],
  users: [...mockUsers],
  products: [...mockProducts],
  inventory: [...mockInventory],
  orders: [...mockOrders],
  supportTickets: [...mockSupportTickets]
};

export const db = {
  // Categories
  async getCategories() {
    if (useSupabase) {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data?.length) return data;
    }
    return state.categories;
  },

  // 620 Store Network querying with filters
  async getStores(search = '', city = '', status = '') {
    let storesList = state.stores;
    if (useSupabase) {
      const { data, error } = await supabase.from('stores').select('*');
      if (!error && data?.length) storesList = data;
    }

    let result = storesList;

    if (city && city !== 'All') {
      result = result.filter(s => s.city.toLowerCase() === city.toLowerCase());
    }

    if (status && status !== 'All') {
      const isActive = status === 'Active';
      result = result.filter(s => s.is_active === isActive);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.area && s.area.toLowerCase().includes(q)) ||
        s.city.toLowerCase().includes(q) ||
        (s.owner_name && s.owner_name.toLowerCase().includes(q))
      );
    }

    // Compute network level summary metrics
    const totalStores = state.stores.length; // 620 stores
    const activeStoresCount = state.stores.filter(s => s.is_active).length;
    const inactiveStoresCount = totalStores - activeStoresCount;
    const mumbaiStoresCount = state.stores.filter(s => s.city === 'Mumbai').length;
    const bengaluruStoresCount = state.stores.filter(s => s.city === 'Bengaluru').length;
    const delhiStoresCount = state.stores.filter(s => s.city === 'Delhi NCR').length;

    return {
      networkSummary: {
        totalStores,
        activeStoresCount,
        inactiveStoresCount,
        cityBreakdown: {
          mumbai: mumbaiStoresCount,
          bengaluru: bengaluruStoresCount,
          delhi: delhiStoresCount
        },
        avgRating: 4.7,
        avgSlaMins: 19
      },
      filteredCount: result.length,
      stores: result
    };
  },

  async getStoreById(storeId) {
    let store = state.stores.find(s => s.id === storeId);
    if (!store) {
      store = state.stores[0]; // fallback to Subhash Stores
    }

    // Get specific products for this store
    const storeProducts = await this.getProducts(store.id);

    return {
      store,
      products: storeProducts,
      stats: {
        totalProducts: store.total_products || storeProducts.length,
        availableProducts: store.available_products || storeProducts.filter(p => p.is_available).length,
        lowStockProducts: store.low_stock_products || storeProducts.filter(p => p.stock_status === 'low_stock').length,
        outOfStockProducts: store.out_of_stock_products || storeProducts.filter(p => p.stock_status === 'out_of_stock').length
      }
    };
  },

  // Products with joined inventory availability for a specific store
  async getProducts(storeId = 'store-1', search = '', categorySlug = '') {
    let rawProducts = state.products;

    if (useSupabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data?.length) rawProducts = data;
    }

    let invList = state.inventory;
    if (useSupabase) {
      const { data, error } = await supabase.from('inventory').select('*').eq('store_id', storeId);
      if (!error && data) invList = data;
    }

    // Attach inventory & availability info to products
    let result = rawProducts.map(prod => {
      const invItem = invList.find(i => i.product_id === prod.id && i.store_id === storeId);
      
      // Seed default healthy stock if store inventory mapping doesn't exist yet for secondary store
      const stockQty = invItem ? invItem.stock_qty : 15;
      const minThreshold = invItem ? invItem.min_stock_threshold : 5;
      const isAvailable = invItem ? (invItem.is_available && stockQty > 0) : stockQty > 0;

      return {
        ...prod,
        stock_qty: stockQty,
        min_stock_threshold: minThreshold,
        is_available: isAvailable,
        stock_status: stockQty === 0 ? 'out_of_stock' : stockQty <= minThreshold ? 'low_stock' : 'in_stock'
      };
    });

    // Apply filters
    if (categorySlug) {
      const cat = state.categories.find(c => c.slug === categorySlug || c.id === categorySlug);
      if (cat) {
        result = result.filter(p => p.category_id === cat.id);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return result;
  },

  async getProductById(productId, storeId = 'store-1') {
    const products = await this.getProducts(storeId);
    return products.find(p => p.id === productId) || null;
  },

  // Inventory Management (Store Manager side)
  async getInventory(storeId = 'store-1') {
    return await this.getProducts(storeId);
  },

  async updateInventoryStock(storeId, productId, stockQty, isAvailable) {
    const newQty = parseInt(stockQty, 10);
    const availableBool = isAvailable !== undefined ? Boolean(isAvailable) : newQty > 0;

    if (useSupabase) {
      const { error } = await supabase
        .from('inventory')
        .upsert({
          store_id: storeId,
          product_id: productId,
          stock_qty: newQty,
          is_available: availableBool,
          last_updated: new Date().toISOString()
        });
      if (error) console.error('Supabase inventory update error:', error);
    }

    // Always update in-memory state as well for instant real-time customer view sync
    let invItem = state.inventory.find(i => i.store_id === storeId && i.product_id === productId);
    if (invItem) {
      invItem.stock_qty = newQty;
      invItem.is_available = availableBool;
      invItem.last_updated = new Date().toISOString();
    } else {
      invItem = {
        id: `inv-${Date.now()}`,
        store_id: storeId,
        product_id: productId,
        stock_qty: newQty,
        min_stock_threshold: 5,
        is_available: availableBool,
        last_updated: new Date().toISOString()
      };
      state.inventory.push(invItem);
    }

    return invItem;
  },

  // Orders
  async getOrders(userId = null) {
    let ordersList = state.orders;
    if (useSupabase) {
      const query = supabase.from('orders').select('*, order_items(*)');
      if (userId) query.eq('user_id', userId);
      const { data, error } = await query;
      if (!error && data?.length) ordersList = data;
    }

    if (userId) {
      return ordersList.filter(o => o.user_id === userId);
    }
    return ordersList;
  },

  async getOrderById(orderId) {
    const orders = await this.getOrders();
    return orders.find(o => o.id === orderId || o.order_number === orderId) || null;
  },

  async createOrder(orderPayload) {
    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: orderPayload.user_id || 'user-1',
      user_name: orderPayload.user_name || 'Rahul Sharma',
      store_id: orderPayload.store_id || 'store-1',
      store_name: orderPayload.store_name || 'Subhash Stores — Andheri East',
      subtotal: orderPayload.subtotal,
      delivery_fee: orderPayload.delivery_fee,
      total_amount: orderPayload.total_amount,
      status: 'placed',
      delay_minutes: 0,
      delay_reason: null,
      delivery_address: orderPayload.delivery_address || 'Flat 402, Green Meadows, Marol, Andheri East, Mumbai 400059',
      payment_method: orderPayload.payment_method || 'UPI (Google Pay)',
      created_at: new Date().toISOString(),
      items: orderPayload.items || []
    };

    if (useSupabase) {
      const { error } = await supabase.from('orders').insert([{
        id: newOrder.id,
        order_number: newOrder.order_number,
        user_id: newOrder.user_id,
        store_id: newOrder.store_id,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.delivery_fee,
        total_amount: newOrder.total_amount,
        status: newOrder.status,
        delivery_address: newOrder.delivery_address,
        payment_method: newOrder.payment_method
      }]);
      if (error) console.error('Supabase order creation error:', error);
    }

    // Deduct stock in inventory for each purchased item
    for (const item of newOrder.items) {
      const currentProduct = await this.getProductById(item.product_id, newOrder.store_id);
      if (currentProduct) {
        const remainingStock = Math.max(0, currentProduct.stock_qty - item.quantity);
        await this.updateInventoryStock(newOrder.store_id, item.product_id, remainingStock);
      }
    }

    state.orders.unshift(newOrder);
    return newOrder;
  },

  // Support Tickets
  async getSupportTickets(userId = null) {
    let tickets = state.supportTickets;
    if (useSupabase) {
      const query = supabase.from('support_tickets').select('*');
      if (userId) query.eq('user_id', userId);
      const { data, error } = await query;
      if (!error && data?.length) tickets = data;
    }

    if (userId) {
      return tickets.filter(t => t.user_id === userId);
    }
    return tickets;
  },

  async createSupportTicket(ticketPayload) {
    const newTicket = {
      id: `tkt-${Date.now()}`,
      ticket_number: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      order_id: ticketPayload.order_id,
      order_number: ticketPayload.order_number,
      user_id: ticketPayload.user_id || 'user-1',
      user_name: ticketPayload.user_name || 'Rahul Sharma',
      category: ticketPayload.category,
      subject: ticketPayload.subject,
      description: ticketPayload.description,
      status: 'open',
      priority: ticketPayload.category === 'Delayed delivery' ? 'high' : 'medium',
      resolution_notes: null,
      created_at: new Date().toISOString()
    };

    if (useSupabase) {
      const { error } = await supabase.from('support_tickets').insert([{
        id: newTicket.id,
        ticket_number: newTicket.ticket_number,
        order_id: newTicket.order_id,
        user_id: newTicket.user_id,
        category: newTicket.category,
        subject: newTicket.subject,
        description: newTicket.description,
        status: newTicket.status,
        priority: newTicket.priority
      }]);
      if (error) console.error('Supabase support ticket error:', error);
    }

    state.supportTickets.unshift(newTicket);
    return newTicket;
  }
};
