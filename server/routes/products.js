import express from 'express';
import { db } from '../services/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { storeId = 'store-1', search = '', category = '' } = req.query;
    const products = await db.getProducts(storeId, search, category);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { storeId = 'store-1' } = req.query;
    const product = await db.getProductById(req.params.id, storeId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message });
  }
});

export default router;
