# 🧠 IntentMesh SDK

A lightweight JavaScript SDK + Node backend that tracks user behavior on e-commerce sites to infer **intent** and **buyer tier** — before they buy.

---

## 🔍 Features

### Tracks:

- Scroll depth  
- Time on page  
- Price ranges viewed  
- Clicked elements  

### Calculates:

- **Intent Level**: `low`, `medium`, `high`  
- **Buyer Tier**: `budget`, `mid`, `premium`  
- Can be customized via config  

### Other:

- Works with anonymous or custom user IDs  
- Configurable via `init(config)`  
- Sends data to a secure API endpoint  
- Demo store with 100+ products for testing  

---

## 🚀 Getting Started

## 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/intentmesh-sdk.git
cd intentmesh-sdk
npm install

```
## 2. Start the API Server
```bash

node server/index.js
```


## 3. Run the Demo Store
```bash
npx serve public
```
## 🚀 HTML Integration


```bash
<script type="module">
  import { init } from './intentmesh.min.js';

  init({
    apiKey: "sk_test_...", // Required
    priceSelectors: [".price"],
    clickSelectors: [".add-to-cart", ".btn-cta"],
    setBuyerTierFromPrices: (prices) => {
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      return avg > 200 ? "luxury" : "mid";
    }
  });
</script>
```
## 📦 Captured Data Format

```bash
{
  "userId": "abc123",
  "sessionId": "xyz789",
  "userIntent": {
    "scrollDepth": 80,
    "timeOnPage": 120,
    "productPricesViewed": [39.99, 89.0],
    "clickedElements": ["Add to Cart", "Proceed to Checkout"]
  },
  "intentLevel": "high",
  "buyerTier": "mid",
  "timestamp": "2025-06-18T10:00:00Z"
}
```



