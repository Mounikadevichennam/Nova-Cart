import express from 'express';
import { db } from '../services/database.js';

const router = express.Router();

// GET inventory items for store dashboard
router.get('/', async (req, res) => {
  try {
    const { storeId = 'store-1' } = req.query;
    const inventory = await db.getInventory(storeId);
    
    // Compute dashboard statistics
    const totalProducts = inventory.length;
    const availableProducts = inventory.filter(p => p.stock_qty > 0 && p.is_available).length;
    const lowStockProducts = inventory.filter(p => p.stock_qty > 0 && p.stock_qty <= p.min_stock_threshold).length;
    const outOfStockProducts = inventory.filter(p => p.stock_qty === 0 || !p.is_available).length;

    // Generate smart restock suggestions
    const restockSuggestions = inventory
      .filter(p => p.stock_qty <= p.min_stock_threshold)
      .map(p => ({
        product_id: p.id,
        product_name: p.name,
        current_stock: p.stock_qty,
        min_threshold: p.min_stock_threshold,
        suggested_restock: p.stock_qty === 0 ? 20 : (p.min_stock_threshold * 3 - p.stock_qty),
        priority: p.stock_qty === 0 ? 'CRITICAL' : 'HIGH',
        reason: p.stock_qty === 0 ? 'Out of stock — causing 35% customer cancellations' : 'Low stock — risk of stockout within 4 hours'
      }));

    res.json({
      success: true,
      stats: {
        totalProducts,
        availableProducts,
        lowStockProducts,
        outOfStockProducts
      },
      restockSuggestions,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inventory', error: error.message });
  }
});

// POST update stock quantity or availability
router.post('/update', async (req, res) => {
  try {
    const { storeId = 'store-1', productId, stockQty, isAvailable } = req.body;
    if (!productId || stockQty === undefined) {
      return res.status(400).json({ success: false, message: 'productId and stockQty are required' });
    }

    const updatedItem = await db.updateInventoryStock(storeId, productId, stockQty, isAvailable);
    const updatedProduct = await db.getProductById(productId, storeId);

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update inventory', error: error.message });
  }
});

export default router;
