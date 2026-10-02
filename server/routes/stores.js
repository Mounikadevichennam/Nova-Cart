import express from 'express';
import { db } from '../services/database.js';

const router = express.Router();

// GET all 620 partner stores with filtering and search
router.get('/', async (req, res) => {
  try {
    const { search = '', city = '', status = '' } = req.query;
    const storeNetwork = await db.getStores(search, city, status);
    res.json({ success: true, ...storeNetwork });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch partner store network', error: error.message });
  }
});

// GET store details + store-specific inventory products
router.get('/:id', async (req, res) => {
  try {
    const storeDetails = await db.getStoreById(req.params.id);
    if (!storeDetails || !storeDetails.store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.json({ success: true, data: storeDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch store details', error: error.message });
  }
});

export default router;
