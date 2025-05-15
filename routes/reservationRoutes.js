import express from 'express';
import pool from '../config/database.js'; // Import the database connection pool
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/reservations',
  [
    body('name').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim().escape(),
    body('date').isISO8601().toDate(),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body('guests').isInt({ gt: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  console.log('Received reservation:', req.body);

    const { name, email, phone, date, time, guests } = req.body; // Extract data from the request body

  try {
      // The date and time are already validated and potentially transformed by express-validator
    const [rows] = await pool.execute(
      'INSERT INTO reservations (name, email, phone, date, time, guests) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, date, time, guests]
    );
    res.status(201).json({ message: 'Reservation created successfully!', reservationId: rows.insertId });
  } catch (error) {
    console.error('Error inserting reservation:', error);
    res.status(500).json({ message: 'Error creating reservation.' });
  }
  }
);

router.get('/reservations', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM reservations');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations.' });
  }
});

export default router;