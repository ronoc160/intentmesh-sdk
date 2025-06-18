import { init, userIntent, buyerTier, intentLevel } from "./intentmesh.min.js";

// 1. Start the SDK
init({
  priceSelectors: [".price"],
  clickSelectors: [".add-to-cart", ".btn-cta"],
  apiKey: window.ENV?.API_KEY,
});

// 2. Rule-based UI behavior
const engagementRules = [
  {
    conditions: { intentLevel: "high", buyerTier: "budget" },
    action: () => showPromoBanner("🔥 15% off for savvy shoppers!"),
  },
  {
    conditions: { intentLevel: "medium", buyerTier: "mid" },
    action: () => showPromoBanner("⚡ Limited stock — grab it now!"),
  },
  {
    conditions: { intentLevel: "high" },
    action: () => highlightCheckoutButton(),
  },
];

function evaluateRules() {
  engagementRules.forEach((rule) => {
    const matches = Object.entries(rule.conditions).every(([key, value]) => {
      if (key === "intentLevel") return intentLevel === value;
      if (key === "buyerTier") return buyerTier === value;
      return false;
    });

    if (matches) rule.action();
  });
}

// 3. Periodically evaluate based on live updates
setInterval(() => {
  console.log("🎯 Checking engagement rules...");
  evaluateRules();
}, 3000);

// 4. UI helpers
function showPromoBanner(message) {
  if (document.querySelector(".promo-banner")) return;
  const banner = document.createElement("div");
  banner.className = "promo-banner";
  banner.innerText = message;
  banner.style.cssText = `
    position: fixed; bottom: 0; left: 0; width: 100%;
    background: #ffd60a; color: black; text-align: center;
    padding: 1rem; font-weight: bold; z-index: 1000;
  `;
  document.body.appendChild(banner);
}

function highlightCheckoutButton() {
  const btn = document.querySelector(".btn-cta");
  if (btn && !btn.classList.contains("highlighted")) {
    btn.classList.add("highlighted");
    btn.style.background = "#e63946";
    btn.style.transform = "scale(1.05)";
  }
}
