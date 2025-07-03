// server/routes/buyerTierPie.js
import express from "express"
import fs from "fs"
import readline from "readline"
import verifyApiKey from "../middleware/verifyApiKey.js"

const router = express.Router()

router.get("/buyer-tier-pie", verifyApiKey, async (req, res) => {
  const counts = { premium: 0, mid: 0, budget: 0 }
  const fileStream = fs.createReadStream("./server/data/intent.log.jsonl")
  const rl = readline.createInterface({ input: fileStream })

  for await (const line of rl) {
    try {
      const d = JSON.parse(line)
      if (d.buyerTier && counts.hasOwnProperty(d.buyerTier)) {
        counts[d.buyerTier]++
      }
    } catch {}
  }
  res.json({
    labels: ["Premium", "Mid", "Budget"],
    data: [counts.premium, counts.mid, counts.budget],
  })
})

export default router