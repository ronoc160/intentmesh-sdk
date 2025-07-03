<template>
  <div class="relative w-full h-full">
    <!-- Heatmap canvas -->
    <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>
    <!-- You can slot UI overlays here if you like -->
    <slot name="overlay" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import axios from 'axios'

/**
 * Props:
 *  - mode:        "session" | "aggregate"
 *  - sessionId:   string|null
 *  - userId:      string|null
 *  - startDate:   YYYY-MM-DD
 *  - endDate:     YYYY-MM-DD
 */
const props = defineProps<{
  mode: string
  sessionId: string|null
  userId:    string|null
  startDate: string
  endDate:   string
}>()

const canvas = ref<HTMLCanvasElement|null>(null)
const clicks = ref<{ xPercent: string; yPercent: string; timestamp: number }[]>([])

/** Load heatmap data from `/api/heatmap` */
async function loadData() {
  if (props.mode === 'session' && props.sessionId && props.userId) {
    const res = await axios.get('/api/heatmap', {
      params: {
        sessionId: props.sessionId,
        userId:    props.userId,
      }
    })
    clicks.value = res.data.clicks || []
    drawHeatmap()
  } else {
    // TODO: handle aggregate mode if you implement it
    clicks.value = []
    drawHeatmap()
  }
}

/** Draw the radial gradients at each click point */
function drawHeatmap() {
  nextTick(() => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return

    // match canvas size to its container
    canvas.value.width  = canvas.value.clientWidth
    canvas.value.height = canvas.value.clientHeight

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    const w = canvas.value.width
    const h = canvas.value.height
    const radius = 60

    for (const c of clicks.value) {
      const x = parseFloat(c.xPercent) * w
      const y = parseFloat(c.yPercent) * h

      // radial gradient fading out
      const grd = ctx.createRadialGradient(x, y, 0, x, y, radius)
      grd.addColorStop(0, 'rgba(99,102,241,0.35)')  // indigo-500 at 35%
      grd.addColorStop(1, 'rgba(99,102,241,0)')     // transparent

      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

// reload whenever sessionId, userId or mode changes
watch([() => props.sessionId, () => props.userId, () => props.mode], loadData)

onMounted(loadData)
</script>

<style scoped>
canvas { display: block; }
</style>
