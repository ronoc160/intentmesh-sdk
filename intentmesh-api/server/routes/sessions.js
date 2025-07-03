import express from 'express'
import fs from 'fs'
import readline from 'readline'
import path from 'path'
import verifyApiKey from '../middleware/verifyApiKey.js'

const router = express.Router()

router.get('/sessions', verifyApiKey, async (req, res) => {
  const { from, to, intentLevels, buyerTiers, q } = req.query
  const startDate = from ? new Date(from) : null
  const endDate = to   ? new Date(to)   : null

  // normalize filters to arrays
  const intentFilter = intentLevels
    ? Array.isArray(intentLevels) ? intentLevels : [intentLevels]
    : []
  const tierFilter = buyerTiers
    ? Array.isArray(buyerTiers) ? buyerTiers : [buyerTiers]
    : []
  const searchTerm = q ? String(q).toLowerCase() : ''

  const filePath = path.join('server','data','intent.log.jsonl')
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({ input: fileStream })

  // build sessions map
  const sessionsMap = new Map()
  for await (const line of rl) {
    try {
      const ev = JSON.parse(line)
      const ts = new Date(ev.timestamp)
      const sid = ev.sessionId
      let entry = sessionsMap.get(sid)

      if (!entry) {
        entry = {
          sessionId: sid,
          userId:    ev.userId,
          startTime: ts,
          lastTime:  ts,
          intentLevel: ev.intentLevel,
          buyerTier:   ev.buyerTier,
        }
        sessionsMap.set(sid, entry)
      } else if (ts > entry.lastTime) {
        // update lastTime & latest intent/tier
        entry.lastTime    = ts
        entry.intentLevel = ev.intentLevel
        entry.buyerTier   = ev.buyerTier
      }
    } catch {
      // skip malformed
    }
  }

  // turn into array and sort
  let sessions = Array.from(sessionsMap.values())
    .map(e => ({
      sessionId: e.sessionId,
      userId:    e.userId,
      startTime: e.startTime.toISOString(),
      lastTime:  e.lastTime.toISOString(),
      intentLevel: e.intentLevel,
      buyerTier:   e.buyerTier,
    }))
    .sort((a,b) => new Date(b.startTime) - new Date(a.startTime))

  // apply filters
  if (startDate) {
    sessions = sessions.filter(s => new Date(s.startTime) >= startDate)
  }
  if (endDate) {
    sessions = sessions.filter(s => new Date(s.lastTime) <= endDate)
  }
  if (intentFilter.length) {
    sessions = sessions.filter(s => intentFilter.includes(s.intentLevel))
  }
  if (tierFilter.length) {
    sessions = sessions.filter(s => tierFilter.includes(s.buyerTier))
  }
    if (searchTerm) {
    sessions = sessions.filter(s => {
      const sid = s.sessionId || ''
      const uid = String(s.userId || '').toLowerCase()
      return sid.includes(searchTerm) || uid.includes(searchTerm)
    })
  }

  // stats: total, avgIntent, avgTime
  const total = sessions.length
  const intentScoreMap = { low:0, medium:1, high:2 }
  let intentSum = 0, timeSum = 0
  sessions.forEach(s => {
    intentSum += intentScoreMap[s.intentLevel]||0
    timeSum   += (new Date(s.lastTime) - new Date(s.startTime)) / 1000
  })
  const stats = {
    total,
    avgIntent: total ? intentSum/total : 0,
    avgTime:   total ? timeSum/total : 0,
  }

  // chart data: sessionsPerDay, intent breakdown, tier breakdown
  const byDate = {}
  const intentBreak = { high:0, medium:0, low:0 }
  const tierBreak   = { budget:0, mid:0, premium:0 }
  sessions.forEach(s => {
    const date = s.startTime.slice(0,10)
    byDate[date] = (byDate[date]||0) + 1
    intentBreak[s.intentLevel] = (intentBreak[s.intentLevel]||0) + 1
    tierBreak[s.buyerTier]     = (tierBreak[s.buyerTier]||0) + 1
  })
  const dates = Object.keys(byDate).sort()

  const chart = {
    dates,
    sessionsPerDay: dates.map(d => byDate[d]),
    intent:    [intentBreak.high, intentBreak.medium, intentBreak.low],
    tier:      [tierBreak.budget, tierBreak.mid, tierBreak.premium],
  }

  res.json({ sessions, stats, chart })
})

export default router
