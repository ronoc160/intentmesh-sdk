// routes/stats.js
import express from "express";
import fs from "fs";
import readline from "readline";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/stats", verifyToken, async (req, res) => {
  const userApiKey = req.user.apiKey;
  const summary = {
    total: 0,
    intentLevel: { high: 0, medium: 0, low: 0 },
    buyerTier: { premium: 0, mid: 0, budget: 0 },
  };

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream("./server/data/intent.log.jsonl"),
    });

    for await (const line of rl) {
      try {
        const event = JSON.parse(line);
        // Match entries by apiKey
        if (event.apiKey !== userApiKey) continue;

        summary.total++;
        if (event.intentLevel)
          summary.intentLevel[event.intentLevel] =
            (summary.intentLevel[event.intentLevel] || 0) + 1;
        if (event.buyerTier)
          summary.buyerTier[event.buyerTier] =
            (summary.buyerTier[event.buyerTier] || 0) + 1;
      } catch (err) {
        // skip malformed lines
      }
    }

    res.json(summary);
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

export default router;
