import express from "express";
import fs from "fs";
import path from "path";
import verifyApiKey from "../middleware/verifyApiKey.js";

const router = express.Router();

const INTENT_LOG_PATH = path.join("server", "data", "intent.log.jsonl");

router.post("/track", verifyApiKey, (req, res) => {
  const payload = req.body;

  if (!payload.userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    fs.appendFileSync(INTENT_LOG_PATH, JSON.stringify(payload) + "\n");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Logging error:", err);
    res.status(500).json({ error: "Failed to log intent" });
  }
});

export default router;
