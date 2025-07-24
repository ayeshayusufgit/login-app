// backend/server.js
import express from "express";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", authRoutes);

// Catch-all to serve index.html for frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});