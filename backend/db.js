import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //ssl: { rejectUnauthorized: true }, // assume production (Aiven) SSL required; remove if local without SSL
};

let con;

export const connectDB = async () => {
  try {
    con = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

export const queryDB = async (sql, params = []) => {
  try {
    const [rows] = await con.query(sql, params);
    return rows;
  } catch (err) {
    console.error('❌ Query error:', err.message);
    throw err;
  }
};
