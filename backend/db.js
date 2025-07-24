import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "B@hr@inmysql786",
  database: "logindb",
});