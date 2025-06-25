import express from "express";
import fs from "fs";
import readline from "readline";
import verifyApiKey from "../middleware/verifyApiKey.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// 🔥 POST heatmap data
router.post("/heatmap", verifyApiKey, (req, res) => {
  const data = req.body;
  if (!data?.userId || !data.clicks) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    fs.appendFileSync("./data/heatmap.jsonl", JSON.stringify(data) + "\n");
    res.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Heatmap write error:", err);
    res.status(500).json({ error: "Failed to write heatmap data" });
  }
});

// 📈 GET heatmap data (authenticated dashboard access)
router.get("/heatmap", verifyApiKey, verifyToken, async (req, res) => {
  const { userId, sessionId } = req.query;
  if (!userId || !sessionId) {
    return res.status(400).json({ error: "Missing userId or sessionId" });
  }

  const results = [];
  try {
    const fileStream = fs.createReadStream("./data/heatmap.jsonl");
    const rl = readline.createInterface({ input: fileStream });

    for await (const line of rl) {
      try {
        const event = JSON.parse(line);
        if (event.userId === userId && event.sessionId === sessionId) {
          results.push(...(event.clicks || []));
        }
      } catch {
        // silently skip bad lines
      }
    }

    res.json({ clicks: results });
  } catch (err) {
    console.error("❌ Heatmap read error:", err);
    res.status(500).json({ error: "Failed to read heatmap log" });
  }
});

export default router;
