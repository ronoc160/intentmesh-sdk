import fs from "fs";
import path from "path";

const USERS_FILE = path.join("server", "data", "users.json");

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE));
  } catch {
    return [];
  }
}

export default function verifyApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key) return res.status(401).json({ error: "Missing API key" });

  const users = loadUsers();
  const user = users.find((u) => u.apiKey === key);

  if (!user) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  req.user = user;
  next();
}

