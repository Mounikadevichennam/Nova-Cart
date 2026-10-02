import express from 'express';
import { db } from '../services/database.js';
import {
  getRecommendedForYou,
  getFrequentlyBoughtTogether,
  getSimilarProducts,
  getLocalPicks,
  getOutOfStockAlternatives
} from '../services/recommendationEngine.js';

const router = express.Router();

// GET all recommendation categories for home or search page
router.get('/', async (req, res) => {
  try {
    const { userId = 'user-1', productId, storeId = 'store-1' } = req.query;

    const products = await db.getProducts(storeId);
    const store = await db.getStoreById(storeId);
    const orders = await db.getOrders();
    const inventory = products; // products already carry inventory status

    const recommendedForYou = getRecommendedForYou(userId, products, inventory, orders, storeId);
    const localPicks = getLocalPicks(products, inventory, store, storeId);

    let frequentlyBoughtTogether = [];
    let similarProducts = [];

    if (productId) {
      frequentlyBoughtTogether = getFrequentlyBoughtTogether(productId, products, inventory, storeId);
      similarProducts = getSimilarProducts(productId, products, inventory, storeId);
    } else if (recommendedForYou.length > 0) {
      // Use first recommended item as seed for frequently bought together
      frequentlyBoughtTogether = getFrequentlyBoughtTogether(recommendedForYou[0].id, products, inventory, storeId);
    }

    res.json({
      success: true,
      data: {
        recommendedForYou,
        frequentlyBoughtTogether,
        similarProducts,
        localPicks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations', error: error.message });
  }
});

// GET out-of-stock alternatives for a specific unavailable product
router.get('/out-of-stock/:productId', async (req, res) => {
  try {
    const { storeId = 'store-1' } = req.query;
    const { productId } = req.params;

    const products = await db.getProducts(storeId);
    const targetProduct = products.find(p => p.id === productId);

    if (!targetProduct) {
      return res.status(404).json({ success: false, message: 'Target product not found' });
    }

    const { bestAlternative, alternatives } = getOutOfStockAlternatives(productId, products, products, storeId);

    res.json({
      success: true,
      targetProduct,
      bestAlternative,
      alternatives
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to compute out-of-stock alternatives', error: error.message });
  }
});

export default router;
