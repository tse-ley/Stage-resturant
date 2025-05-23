import express from 'express';
import reservationRoutes from './routes/reservationRoute.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes, { authenticateToken } from './routes/authRoutes.js';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', authRoutes); // Use auth routes under /api
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});