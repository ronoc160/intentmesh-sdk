// server/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const router = express.Router();
const USERS_FILE = "./data/users.json";

// Helper functions
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function generateApiKey() {
  return "sk_live_" + uuidv4().replace(/-/g, "").slice(0, 24);
}

// 🔐 Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const apiKey = generateApiKey();
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    apiKey,
  };

  users.push(user);
  saveUsers(users);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, apiKey });
});

// 🔐 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, apiKey: user.apiKey });
});

// 🔐 Get current user
router.get("/me", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const users = loadUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ email: user.email, apiKey: user.apiKey });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
