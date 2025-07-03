import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Route modules
import intentRoutes from "./routes/intent.js";
import heatmapRoutes from "./routes/heatmap.js";
import statsRoutes from "./routes/stats.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import intentTimeSeriesRoutes from "./routes/intentTimeSeries.js";
import buyerTierPieRoutes from "./routes/buyerTierPie.js";
import apiKeyRoutes from './routes/apikey.js'
import sessionsRoutes from './routes/sessions.js'
dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.0.208:3000",
  "http://localhost:5173",       // ← add this line
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like CURL or mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",               // if you send Bearer tokens
    "x-api-key",                   // your API key header
  ],
}));
app.options("*", cors());
// Health check
app.get("/ping", (_, res) => res.send("✅ API is alive"));

// Mount routes
app.use("/api", intentRoutes);
app.use("/api", heatmapRoutes);
app.use("/api", statsRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", intentTimeSeriesRoutes)
app.use("/api", buyerTierPieRoutes)
app.use("/auth", authRoutes);
app.use("/api", apiKeyRoutes);
app.use("/api", sessionsRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 IntentMesh API running on http://localhost:${PORT}`);
});
