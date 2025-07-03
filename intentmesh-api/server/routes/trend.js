import express from 'express'
import fs from 'fs'
import readline from 'readline'

const router = express.Router()

router.get('/api/intent-trend', async (req, res) => {
  const days = {}
  const fileStream = fs.createReadStream('./server/data/intent.log.jsonl')
  const rl = readline.createInterface({ input: fileStream })

  for await (const line of rl) {
    try {
      const ev = JSON.parse(line)
      const day = ev.timestamp.slice(0, 10) // 'YYYY-MM-DD'
      if (!days[day]) days[day] = { interested: 0, buyerTier: 0 }
      if (ev.intentLevel === "high") days[day].interested++
      if (ev.buyerTier === "premium") days[day].buyerTier++
    } catch {}
  }

  const labels = Object.keys(days).sort()
  const datasets = [
    {
      label: 'Interested',
      data: labels.map(l => days[l].interested),
      borderColor: '#7C3AED',
      backgroundColor: 'rgba(124,58,237,0.09)',
      pointRadius: 0,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Buyer Tier',
      data: labels.map(l => days[l].buyerTier),
      borderColor: '#38BDF8',
      backgroundColor: 'rgba(56,189,248,0.09)',
      pointRadius: 0,
      tension: 0.4,
      fill: true,
    }
  ]

  res.json({ labels, datasets })
})

export default router
