// server/routes/events.js
import express from 'express'
import fs from 'fs'
import readline from 'readline'
import verifyApiKey from '../middleware/verifyApiKey.js'

const router = express.Router()

// GET /api/users/:id/events → [{ sessionId, timestamp, intentLevel, buyerTier }, …]
router.get('/users/:id/events', verifyApiKey, async (req, res) => {
  const { id } = req.params
  const fileStream = fs.createReadStream('./server/data/intent.log.jsonl')
  const rl = readline.createInterface({ input: fileStream })
  
  // Map of sessionId → { latest: Date, intentLevel, buyerTier }
  const sessionsMap = new Map()

  for await (const line of rl) {
    try {
      const ev = JSON.parse(line)
      if (ev.userId !== id) continue

      const ts = new Date(ev.timestamp)
      const existing = sessionsMap.get(ev.sessionId)
      if (!existing || ts > existing.latest) {
        sessionsMap.set(ev.sessionId, {
          latest: ts,
          intentLevel: ev.intentLevel,
          buyerTier:  ev.buyerTier,
        })
      }
    } catch {
      // skip malformed lines
    }
  }

  // Convert to array and sort descending by timestamp
  const sessions = Array.from(sessionsMap.entries())
    .map(([sessionId, info]) => ({
      sessionId,
      timestamp:   info.latest.toISOString(),
      intentLevel: info.intentLevel,
      buyerTier:   info.buyerTier,
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  res.json({ sessions })
})

export default router
