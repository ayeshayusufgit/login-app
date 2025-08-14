import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(`window.BACKEND_URL = "${process.env.BACKEND_URL}";`);
});

export default router;