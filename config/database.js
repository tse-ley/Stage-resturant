import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'YOUR_DATABASE_HOST',
  user: 'YOUR_DATABASE_USER',
  password: 'YOUR_DATABASE_PASSWORD',
  database: 'YOUR_DATABASE_NAME',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;