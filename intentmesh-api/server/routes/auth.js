// server/routes/auth.js
import express from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const USERS_FILE = path.join("server", "data", "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Load users
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE));
  } catch {
    return [];
  }
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Create API key
function generateApiKey() {
  return "sk_" + crypto.randomBytes(24).toString("hex");
}

// 📥 Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already in use" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const apiKey = generateApiKey();

  const newUser = {
    id: crypto.randomUUID(),
    email,
    password: hashed,
    apiKey,
  };

  users.push(newUser);
  saveUsers(users);

  const token = jwt.sign({ id: newUser.id, email }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, apiKey });
});

// 🔑 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, apiKey: user.apiKey });
});

export default router;
