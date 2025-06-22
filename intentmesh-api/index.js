import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import readline from "readline";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.options("*", cors());
// 🔒 Restrict CORS to known origins (customize this as needed)
const allowedOrigins = ["http://localhost:3000", "http://192.168.0.208:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

const API_KEY = process.env.API_KEY;
const userSessions = {};

// 🔐 API key middleware (only applied where needed)
function verifyApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (key !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ✅ Health check
app.get("/ping", (req, res) => {
  res.send("✅ API is alive");
});

// 📥 Proxy to real /track endpoint
// 📥 Save intent data directly
app.post("/api/track", verifyApiKey, async (req, res) => {
  const payload = req.body;

  if (!payload.userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // 📝 Log to local file
    fs.appendFileSync(
      "./data/intent.log.jsonl",
      JSON.stringify(payload) + "\n"
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Logging error:", err);
    res.status(500).json({ error: "Failed to log intent" });
  }
});

// 🧑‍🤝‍🧑 Optional mock user endpoints
app.get("/users", (req, res) => {
  res.json({ users: Object.keys(userSessions) });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const data = userSessions[userId];
  if (!data) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ events: data });
});
app.get("/api/heatmap", verifyApiKey, async (req, res) => {
  const { userId, sessionId } = req.query;
  const filePath = "./data/heatmap.jsonl";
  const results = [];

  if (!userId || !sessionId) {
    return res.status(400).json({ error: "Missing userId or sessionId" });
  }

  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream });

    for await (const line of rl) {
      try {
        const event = JSON.parse(line);
        if (event.userId === userId && event.sessionId === sessionId) {
          results.push(...(event.clicks || []));
        }
      } catch {
        // skip bad lines silently
      }
    }

    res.json({ clicks: results });
  } catch (err) {
    console.error("❌ Error reading heatmap log:", err);
    res.status(500).json({ error: "Failed to read heatmap log" });
  }
});

// 📊 Aggregate stats
app.get("/stats", verifyApiKey, async (req, res) => {
  const filePath = "./data/intent.log.jsonl";
  const summary = {
    total: 0,
    intentLevel: { high: 0, medium: 0, low: 0 },
    buyerTier: { premium: 0, mid: 0, budget: 0 },
  };

  try {
    const fileStream = fs.createReadStream(filePath);
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
      } catch (err) {
        console.warn("⚠️ Skipped malformed line:", line);
      }
    }

    res.json(summary);
  } catch (err) {
    console.error("❌ Failed to read stats:", err);
    res.status(500).json({ error: "Unable to read stats file" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 IntentMesh API running on http://localhost:${PORT}`);
});
