import express from "express";
import fs from "fs";
import readline from "readline";
import verifyApiKey from "../middleware/verifyApiKey.js";

const router = express.Router();

router.get("/stats", verifyApiKey, async (req, res) => {
  const summary = {
    total: 0,
    intentLevel: { high: 0, medium: 0, low: 0 },
    buyerTier: { premium: 0, mid: 0, budget: 0 },
  };

  try {
    const fileStream = fs.createReadStream("./data/intent.log.jsonl");
    const rl = readline.createInterface({ input: fileStream });

    for await (const line of rl) {
      try {
        const data = JSON.parse(line);
        summary.total++;
        if (data.intentLevel)
          summary.intentLevel[data.intentLevel] =
            (summary.intentLevel[data.intentLevel] || 0) + 1;
        if (data.buyerTier)
          summary.buyerTier[data.buyerTier] =
            (summary.buyerTier[data.buyerTier] || 0) + 1;
      } catch {
        // skip malformed lines
      }
    }

    res.json(summary);
  } catch (err) {
    console.error("❌ Stats read error:", err);
    res.status(500).json({ error: "Unable to read stats" });
  }
});

export default router;
