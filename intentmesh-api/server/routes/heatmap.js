import express     from "express";
import fs          from "fs";
import readline    from "readline";
import verifyApiKey from "../middleware/verifyApiKey.js";
import verifyToken  from "../middleware/verifyToken.js";

const router = express.Router();

// 1️⃣ PUBLIC SDK → POST new heatmap events, guarded by API key only
router.post("/heatmap", verifyApiKey, async (req, res) => {
  const { userId, sessionId, clicks } = req.body;
  if (!userId || !sessionId || !clicks) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    fs.appendFileSync(
      "./server/data/heatmap.jsonl",
      JSON.stringify({ userId, sessionId, clicks, apiKey: req.user.apiKey, timestamp: Date.now() }) + "\n"
    );
    res.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Heatmap write error:", err);
    res.status(500).json({ error: "Failed to write heatmap data" });
  }
});

// 2️⃣ DASHBOARD → GET heatmap for a session, guarded by JWT
router.get("/heatmap", verifyToken, async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  const results = [];
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream("./server/data/heatmap.jsonl"),
    });

    for await (const line of rl) {
      const event = JSON.parse(line);
      // Only return sessions belonging to the logged-in user
      if (event.sessionId === sessionId && event.userId === req.user.id) {
        results.push(...(event.clicks || []));
      }
    }

    res.json({ clicks: results });
  } catch (err) {
    console.error("❌ Heatmap read error:", err);
    res.status(500).json({ error: "Failed to load heatmap data" });
  }
});

export default router;
