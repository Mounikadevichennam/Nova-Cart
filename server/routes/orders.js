import express from 'express';
import { db } from '../services/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await db.getOrders(userId || null);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order details', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { items, subtotal, delivery_fee, total_amount, delivery_address, user_id, store_id } = req.body;
    if (!items || !items.length || subtotal === undefined || total_amount === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid order payload' });
    }

    const newOrder = await db.createOrder(req.body);
    res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
});

export default router;
