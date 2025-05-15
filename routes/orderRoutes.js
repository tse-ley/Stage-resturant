import { Router, body, validationResult } from 'express';
import pool from '../config/database.js';
 
const router = Router();

// POST route to create a new order
router.post('/orders', [
  body('order_items').isArray().withMessage('order_items must be an array'),
  body('total_amount').isNumeric().withMessage('total_amount must be a number'),
], async (req, res) => {
  const { customer_name, customer_email, customer_phone, order_items, total_amount } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Basic validation for order_items being non-empty
 if (!order_items || order_items.length === 0) {
    return res.status(400).json({ message: 'Order items cannot be empty.' });
  }

  try {
    // Convert order_items array to JSON string for storage
    const orderItemsJson = JSON.stringify(order_items);

    const query = 'INSERT INTO orders (customer_name, customer_email, customer_phone, order_items, total_amount) VALUES (?, ?, ?, ?, ?)';
    const [results] = await pool.query(query, [customer_name, customer_email, customer_phone, orderItemsJson, total_amount]);

    res.status(201).json({ message: 'Order placed successfully', orderId: results.insertId });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

// GET route to fetch all orders
router.get('/orders', async (req, res) => {
  try {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC';
    const [rows] = await pool.query(query);

    // Parse the JSON string in order_items for each row
    const orders = rows.map(row => ({
      ...row,
      order_items: JSON.parse(row.order_items)
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

export default router;