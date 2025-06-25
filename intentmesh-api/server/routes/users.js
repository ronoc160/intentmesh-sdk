import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import fs from "fs";
import path from "path";

const router = express.Router();
const USERS_FILE = path.join("server", "data", "users.json");

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE));
  } catch {
    return [];
  }
}

// GET all users (restricted)
router.get("/users", verifyToken, (req, res) => {
  const users = loadUsers().map(({ id, email, apiKey }) => ({ id, email, apiKey }));
  res.json({ users });
});

// GET a specific user (restricted)
router.get("/users/:id", verifyToken, (req, res) => {
  const userId = req.params.id;
  const users = loadUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  const { id, email, apiKey } = user;
  res.json({ user: { id, email, apiKey } });
});

export default router;
