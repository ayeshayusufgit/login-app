import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const isProd = process.env.ENV === 'prod';

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(isProd && {
    ssl: {
      ca: fs.readFileSync(path.resolve('certs/ca.pem')),
    },
  }),
};

let con;

export const connectDB = async () => {
  try {
    con = await mysql.createConnection(dbConfig);
    console.log(`✅ Connected to ${isProd ? 'production' : 'local'} database`);
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
