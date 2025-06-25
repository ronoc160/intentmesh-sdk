import express from "express";

const router = express.Router();
const userSessions = {}; // Optional: stub/mock for now

router.get("/users", (req, res) => {
  res.json({ users: Object.keys(userSessions) });
});

router.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const data = userSessions[userId];
  if (!data) return res.status(404).json({ error: "User not found" });
  res.json({ events: data });
});

export default router;
