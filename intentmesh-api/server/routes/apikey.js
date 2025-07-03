import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const USERS_FILE = path.join('server', 'data', 'users.json');

// Utility to load and save users
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// GET: return the current user's API key
// Protected by JWT (verifyToken)
router.get('/apikey', verifyToken, (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ apiKey: user.apiKey });
});

// POST: regenerate the current user's API key
router.post('/apikey/regenerate', verifyToken, (req, res) => {
  const users = loadUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate a new key and persist
  const newKey = 'sk_' + crypto.randomBytes(24).toString('hex');
  users[idx].apiKey = newKey;
  saveUsers(users);

  res.json({ apiKey: newKey });
});

export default router;
