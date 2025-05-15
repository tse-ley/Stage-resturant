import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js'; // Assuming your database connection is here

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for secret

// Authentication middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from 'Bearer TOKEN' format

  if (token == null) {
    return res.sendStatus(401); // If there's no token, return 401 Unauthorized
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // If token is not valid, return 403 Forbidden
    }
    req.user = user; // Attach user information from token to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT
    const accessToken = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' }); // Token expires in 1 hour

    res.json({ accessToken: accessToken });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;