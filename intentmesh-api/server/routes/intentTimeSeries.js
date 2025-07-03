// server/routes/intentTimeSeries.js
import express from "express"
import fs from "fs"
import readline from "readline"
import verifyApiKey from "../middleware/verifyApiKey.js"

const router = express.Router()

router.get("/intent-timeseries", verifyApiKey, async (req, res) => {
  const fileStream = fs.createReadStream("./server/data/intent.log.jsonl")
  const rl = readline.createInterface({ input: fileStream })
  const byDate = {}

  for await (const line of rl) {
    try {
      const d = JSON.parse(line)
      const date = d.timestamp?.slice(0, 10)
      if (!byDate[date]) byDate[date] = { high: 0, medium: 0, low: 0 }
      if (["high", "medium", "low"].includes(d.intentLevel))
        byDate[date][d.intentLevel]++
    } catch {}
  }
  const dates = Object.keys(byDate).sort()
  res.json({
    dates,
    high: dates.map((d) => byDate[d].high),
    medium: dates.map((d) => byDate[d].medium),
    low: dates.map((d) => byDate[d].low),
  })
})

export default router