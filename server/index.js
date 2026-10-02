import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import storesRouter from './routes/stores.js';
import ordersRouter from './routes/orders.js';
import inventoryRouter from './routes/inventory.js';
import recommendationsRouter from './routes/recommendations.js';
import supportRouter from './routes/support.js';
import insightsRouter from './routes/insights.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend local & production origins
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'NOVA CART Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/stores', storesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/support', supportRouter);
app.use('/api/insights', insightsRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred. Please try again later.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NOVA CART Server running on http://localhost:${PORT}`);
});
