import express from 'express';
import { db } from '../services/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
});

export default router;
