import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.ENV || 'local';

const config = env === 'local' ? {
  host: process.env.LOCAL_DB_HOST,
  port: process.env.LOCAL_DB_PORT,
  user: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASSWORD,
  database: process.env.LOCAL_DB_NAME,
} : {
  host: process.env.PROD_DB_HOST,
  port: process.env.PROD_DB_PORT,
  user: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_NAME,
  ssl: { rejectUnauthorized: false },
};

const db = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
});

console.log(`✅ Connected to ${env === 'local' ? 'Local' : 'Aiven'} MySQL DB`);

export default db;