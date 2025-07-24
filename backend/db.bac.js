import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'mysql-loginapp-db-ayesha-login-db.f.aivencloud.com',
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || 'AVNS_MjGXx79jT1clBMpNaGS',
  database: process.env.DB_NAME || 'defaultdb',
});

console.log('✅ Connected to MySQL DB');
export default db;