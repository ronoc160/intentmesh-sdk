# 🧠 IntentMesh SDK

A lightweight JavaScript SDK that tracks user behavior on e-commerce sites to infer intent and buyer tier — before they buy.

## 🔍 Features

- Tracks:
  - Scroll depth
  - Time on page
  - Price ranges viewed
  - Clicked elements
- Calculates:
  - Intent level (`low`, `medium`, `high`)
  - Buyer tier (`budget`, `mid`, `premium`)
- Configurable via `init(config)`
- Sends signals to an external API (optional)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/intentmesh-sdk.git
cd intentmesh-sdk
npm install
npm run build

## Usage
<script src="dist/intentmesh.min.js"></script>
<script>
  IntentMesh.init({
    priceSelectors: [".product-price"],
    clickSelectors: ["button", ".add-to-cart"],
    setBuyerTierFromPrices: (prices) => {
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      return avg > 200 ? "luxury" : "mid";
    },
  });
</script>


## API coming soon
We'll be capturing session intent data via a Node/Express backend for later analysis and personalization.