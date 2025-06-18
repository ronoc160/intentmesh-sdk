let userIntent = {
  scrollDepth: 0,
  timeOnPage: 0,
  productPricesViewed: [],
  clickedElements: [],
};
let buyerTier = "unknown";
let customTierFn = null; // Custom function to determine buyer tier
let intentLevel = "unknown";
let sdkApiKey = null;
let userIdentity = {
  id: null,
  isCustom: false,
};
let intentChangeCallbacks = [];

function onIntentChange(callback) {
  if (typeof callback === "function") {
    intentChangeCallbacks.push(callback);
  }
}
function calculateIntentScore() {
  let score = 0;

  // Add points for scroll depth
  if (userIntent.scrollDepth >= 75) score += 2;
  else if (userIntent.scrollDepth >= 40) score += 1;

  // Add points for time on page
  if (userIntent.timeOnPage >= 60) score += 2;
  else if (userIntent.timeOnPage >= 30) score += 1;

  // Add points for meaningful clicks
  if (userIntent.clickedElements.length >= 3) score += 2;
  else if (userIntent.clickedElements.length >= 1) score += 1;

  // Final classification
  if (score >= 5) intentLevel = "high";
  else if (score >= 3) intentLevel = "medium";

  fetch("http://localhost:3001/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": sdkApiKey,
    },
    body: JSON.stringify({
      userId: userIdentity.id, // ← this is required
      sessionId: userIntent.sessionId, // optional
      isCustom: userIdentity.isCustom,
      userIntent,
      buyerTier,
      intentLevel,
      timestamp: new Date().toISOString(),
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log("✅ Sent to API:", data))
    .catch((err) => console.error("❌ API error:", err));

  if (intentLevel !== previousIntent) {
    const payload = {
      intentLevel,
      buyerTier,
      userIntent,
    };
    intentChangeCallbacks.forEach((cb) => cb(payload));
  }
}

function trackScrollDepth() {
  console.log("🚀 trackScrollDepth() a attached");
  function calculateScrollDepth() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(
      100,
      Math.round((scrollTop / docHeight) * 100)
    );

    userIntent.scrollDepth = scrollPercent;
    console.log(`📊 Scroll Depth: ${scrollPercent}%`);
  }

  window.addEventListener("scroll", calculateScrollDepth);
}

function trackClicks(config = {}) {
  const selectors = config.clickSelectors || ["a", "button"];

  document.addEventListener("click", (e) => {
    for (const selector of selectors) {
      const target = e.target.closest(selector);
      if (target) {
        const label =
          target.innerText?.trim() ||
          target.getAttribute("aria-label")?.trim() ||
          "unknown";
        userIntent.clickedElements.push(label);
        break; // Stop after first match
      }
    }
  });
}

function trackTimeOnPage() {
  console.log("⏳ trackTimeOnPage() started");
  // Continuously tracks how long a user stays on the page
  // Updates userIntent.timeOnPage in a non-blocking way
  // Only logs/sends updates every 5s (you can change this)
  // Sends one last snapshot when the user leaves
  let startTime = Date.now();
  let lastLogged = 0;

  const updateTime = () => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    userIntent.timeOnPage = elapsed;

    // Optional batching every 5s
    if (elapsed - lastLogged >= 5) {
      lastLogged = elapsed;
      // example: store or send to API
      // sendIntentUpdate({ timeOnPage: elapsed });
    }

    // Schedule next update
    if ("requestIdleCallback" in window) {
      requestIdleCallback(updateTime, { timeout: 1000 });
    } else {
      setTimeout(updateTime, 1000);
    }
  };

  updateTime();

  window.addEventListener("beforeunload", () => {
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    userIntent.timeOnPage = finalTime;
    calculateIntentScore();
  });
}

let priceSelectors = []; // ← override via config

function trackPriceView() {
  const priceRegex = /(?:€|\$|£)\s?(\d{1,5}(?:[.,]\d{2})?)/g;
  const prices = new Set();

  function scanPrices() {
    let textToScan = "";

    if (priceSelectors.length > 0) {
      priceSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          textToScan += " " + el.innerText;
        });
      });
    } else {
      textToScan = document.body.innerText; // fallback
    }

    let match;
    while ((match = priceRegex.exec(textToScan)) !== null) {
      const raw = match[1].replace(",", ".");
      const value = parseFloat(raw);
      if (!isNaN(value)) prices.add(value);
    }

    userIntent.productPricesViewed = [...prices].sort((a, b) => a - b);

    if (customTierFn) {
      buyerTier = customTierFn([...prices]);
    } else {
      const avg = [...prices].reduce((a, b) => a + b, 0) / prices.size;
      if (avg < 50) buyerTier = "budget";
      else if (avg < 200) buyerTier = "mid";
      else buyerTier = "premium";
    }
  }

  if ("requestIdleCallback" in window) {
    requestIdleCallback(scanPrices);
  } else {
    setTimeout(scanPrices, 1000);
  }
}
function getOrCreateAnonymousId() {
  let id = localStorage.getItem("intentmesh-anon-id");
  if (!id) {
    id = generateUUID();
    localStorage.setItem("intentmesh-anon-id", id);
  }
  return id;
}
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
function init(config = {}) {
  console.log("✅ IntentMesh SDK initialized");
  sdkApiKey = config.apiKey || null;
  if (config.userId) {
    userIdentity.id = config.userId;
    userIdentity.isCustom = true;
  } else {
    userIdentity.id = getOrCreateAnonymousId();
    userIdentity.isCustom = false;
  }

  userIntent.sessionId = generateUUID();

  if (
    config.setBuyerTierFromPrices &&
    typeof config.setBuyerTierFromPrices === "function"
  ) {
    customTierFn = config.setBuyerTierFromPrices;
  }

  if (config.priceSelectors) {
    priceSelectors = config.priceSelectors;
  }

  trackScrollDepth();
  trackPriceView(); // uses selectors (if any)
  trackTimeOnPage();
  trackClicks(config);
}
setInterval(() => {
  calculateIntentScore();
  console.log("Live:", userIntent, buyerTier, intentLevel);
}, 3000);

// 🔁 Exports
export { init, userIntent, buyerTier, intentLevel };
