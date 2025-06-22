// heatmap.js
let clickMap = {};

function trackClicksForHeatmap(userId, sessionId, apiKey) {
  document.addEventListener("click", (e) => {
    const x = Math.round(e.clientX);
    const y = Math.round(e.clientY);
    const key = `${x},${y}`;
    clickMap[key] = (clickMap[key] || 0) + 1;
  });

  // Flush data every 10 seconds (or when the user leaves)
  setInterval(() => flushClicks(userId, sessionId, apiKey), 10000);

  window.addEventListener("beforeunload", () => {
    flushClicks(userId, sessionId, apiKey);
  });
}

function flushClicks(userId, sessionId, apiKey) {
  const heatmapData = Object.entries(clickMap).map(([position, count]) => {
    const [x, y] = position.split(",").map(Number);
    return { x, y, count };
  });

  if (heatmapData.length === 0) return;

  fetch("http://localhost:3001/api/heatmap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      userId,
      sessionId,
      heatmap: heatmapData,
      timestamp: new Date().toISOString(),
    }),
  }).then(() => {
    clickMap = {}; // reset
  });
}

export function initHeatmap(userId, sessionId, apiKey) {
  if (!userId || !sessionId || !apiKey) {
    console.warn("❗ Heatmap init missing required params");
    return;
  }
  console.log("🔥 Heatmap tracking enabled");
  trackClicksForHeatmap(userId, sessionId, apiKey);
}
