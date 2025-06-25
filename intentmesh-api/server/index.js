import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Route modules
import intentRoutes from "./routes/intent.js";
import heatmapRoutes from "./routes/heatmap.js";
import statsRoutes from "./routes/stats.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "http://192.168.0.208:3000"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
}));

// Health check
app.get("/ping", (_, res) => res.send("✅ API is alive"));

// Mount routes
app.use("/api", intentRoutes);
app.use("/api", heatmapRoutes);
app.use("/", statsRoutes);
app.use("/", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 IntentMesh API running on http://localhost:${PORT}`);
});
