import express from 'express';
import { db } from '../services/database.js';

const router = express.Router();

router.get('/tickets', async (req, res) => {
  try {
    const { userId = 'user-1' } = req.query;
    const tickets = await db.getSupportTickets(userId);
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch support tickets', error: error.message });
  }
});

router.post('/tickets', async (req, res) => {
  try {
    const { order_id, category, subject, description } = req.body;
    if (!category || !subject || !description) {
      return res.status(400).json({ success: false, message: 'Category, subject, and description are required' });
    }

    const ticket = await db.createSupportTicket(req.body);
    res.status(201).json({ success: true, message: 'Support ticket created', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create support ticket', error: error.message });
  }
});

export default router;
