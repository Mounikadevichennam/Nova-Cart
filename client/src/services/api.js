import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL.trim();
    return url.endsWith('/api') ? url : url.endsWith('/') ? `${url}api` : `${url}/api`;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getProducts = async (storeId = 'store-1', search = '', category = '') => {
  try {
    const res = await api.get('/products', { params: { storeId, search, category } });
    return res.data.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

export const getProductById = async (id, storeId = 'store-1') => {
  try {
    const res = await api.get(`/products/${id}`, { params: { storeId } });
    return res.data.data;
  } catch (err) {
    console.error('Error fetching product:', err);
    throw err;
  }
};

export const getCategories = async () => {
  try {
    const res = await api.get('/categories');
    return res.data.data;
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw err;
  }
};

export const getStores = async (search = '', city = '', status = '') => {
  try {
    const res = await api.get('/stores', { params: { search, city, status } });
    return res.data;
  } catch (err) {
    console.error('Error fetching partner store network:', err);
    throw err;
  }
};

export const getStoreById = async (id) => {
  try {
    const res = await api.get(`/stores/${id}`);
    return res.data.data;
  } catch (err) {
    console.error('Error fetching store details:', err);
    throw err;
  }
};

export const getRecommendations = async (userId = 'user-1', productId = null, storeId = 'store-1') => {
  try {
    const res = await api.get('/recommendations', { params: { userId, productId, storeId } });
    return res.data.data;
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    throw err;
  }
};

export const getOutOfStockAlternatives = async (productId, storeId = 'store-1') => {
  try {
    const res = await api.get(`/recommendations/out-of-stock/${productId}`, { params: { storeId } });
    return res.data;
  } catch (err) {
    console.error('Error fetching OOS alternatives:', err);
    throw err;
  }
};

export const getOrders = async (userId = 'user-1') => {
  try {
    const res = await api.get('/orders', { params: { userId } });
    return res.data.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  } catch (err) {
    console.error('Error fetching order detail:', err);
    throw err;
  }
};

export const createOrder = async (orderPayload) => {
  try {
    const res = await api.post('/orders', orderPayload);
    return res.data.data;
  } catch (err) {
    console.error('Error creating order:', err);
    throw err;
  }
};

export const getInventory = async (storeId = 'store-1') => {
  try {
    const res = await api.get('/inventory', { params: { storeId } });
    return res.data;
  } catch (err) {
    console.error('Error fetching inventory:', err);
    throw err;
  }
};

export const updateInventoryStock = async (storeId = 'store-1', productId, stockQty, isAvailable) => {
  try {
    const res = await api.post('/inventory/update', { storeId, productId, stockQty, isAvailable });
    return res.data.data;
  } catch (err) {
    console.error('Error updating inventory stock:', err);
    throw err;
  }
};

export const getSupportTickets = async (userId = 'user-1') => {
  try {
    const res = await api.get('/support/tickets', { params: { userId } });
    return res.data.data;
  } catch (err) {
    console.error('Error fetching support tickets:', err);
    throw err;
  }
};

export const createSupportTicket = async (ticketPayload) => {
  try {
    const res = await api.post('/support/tickets', ticketPayload);
    return res.data.data;
  } catch (err) {
    console.error('Error creating support ticket:', err);
    throw err;
  }
};

export const getBusinessInsights = async (storeId = 'store-1') => {
  try {
    const res = await api.get('/insights', { params: { storeId } });
    return res.data.data;
  } catch (err) {
    console.error('Error fetching business insights:', err);
    throw err;
  }
};
