let userIntent = {
  scrollDepth: 0,
  timeOnPage: 0,
  productPricesViewed: [],
  clickedElements: [],
};
let buyerTier = "unknown";
let customTierFn = null; 
let intentLevel = "unknown";

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
  else intentLevel = "low";

  console.log(`🧠 Intent Score: ${score} → ${intentLevel}`);
}

function trackScrollDepth() {
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
  const selector = config.clickSelectors || [
    "a",
    "button",
  ];

  document.addEventListener("click", (e) => {
    const target = e.target.closest(selector);
    
    if (target) {
      const label =
        target.innerText?.trim() ||
        target.getAttribute("aria-label")?.trim() ||
        "unknown";

      userIntent.clickedElements.push(label);
    }
  });
}

function trackTimeOnPage() {
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

let priceSelectors = [];

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
      textToScan = document.body.innerText;
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

function init(config = {}) {
  console.log("✅ IntentMesh SDK initialized");

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
  trackPriceView(); 
  trackTimeOnPage();
  trackClicks(config);
}

// 🔁 Exports
export { init, userIntent, buyerTier, intentLevel };
