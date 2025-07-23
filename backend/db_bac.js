import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'B@hr@inmysql786',
  database: process.env.DB_NAME || 'loginapp',
});

console.log('✅ Connected to MySQL DB');
export default db;