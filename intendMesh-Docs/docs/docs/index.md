# IntentMesh

Welcome to the **IntentMesh** documentation—the home for everything you need to integrate our JavaScript SDK and explore the powerful Dashboard for monitoring user purchase intent on your e-commerce site.

::: tip What is IntentMesh?
**IntentMesh** is a lightweight JS library that captures key user behaviors—scroll depth, time on page, price views, clicks—and classifies visitors by **Intent Level** (`low`/`medium`/`high`) and **Buyer Tier** (`budget`/`mid`/`premium`). Our companion Dashboard offers secure API endpoints, rich session analytics, charts, and heatmaps to help you turn insights into action.
:::

---

## 🏁 Get Started

1. **Install the SDK**
   ```bash
   npm install intentmesh-sdk
   # or
   yarn add intentmesh-sdk
   ```
   ```bash
    import { init, onIntentChange } from 'intentmesh-sdk';

    init({
    apiKey: 'sk_your_public_key_here',       // 🔑 Your public SDK key
    priceSelectors: ['.product-price'],       // 🏷️ CSS selectors for prices
    clickSelectors: ['.btn-add-to-cart'],    // 🖱️ CSS selectors for clicks
    setBuyerTierFromPrices: prices => {
        const avg = prices.reduce((a,b) => a+b, 0) / prices.length
        return avg < 50 ? 'budget' : avg < 200 ? 'mid' : 'premium'
    }
    })

    // react to intent changes in real time:
    onIntentChange(({ intentLevel, buyerTier, userIntent }) => {
    if (intentLevel === 'high') {
        showPromoModal()
    }
    })
    ```
2. **Initialize via ```<script>```Tag**
    ```bash
    <script src="https://cdn.jsdelivr.net/npm/intentmesh-sdk/dist/intentmesh.min.js"></script>
    <script>
    // available as window.IntentMesh
    IntentMesh.init({
        apiKey: 'sk_your_public_key_here',
        priceSelectors: ['.price'],
        clickSelectors: ['a','button'],
    })
    </script>
    ```
## ⚙️ Configuration Options

| Option                   | Type                         | Description                                                       |
|--------------------------|------------------------------|-------------------------------------------------------------------|
| `apiKey`                 | `string` **required**        | Your public SDK key (issued via your Dashboard).                  |
| `priceSelectors`         | `string[]`                   | CSS selectors used to scrape on-page prices.                      |
| `clickSelectors`         | `string[]`                   | CSS selectors for “meaningful” click tracking.                    |
| `setBuyerTierFromPrices` | `(prices: number[]) => string` | Optional custom function to bucket users by price picks.          |
| `userId`                 | `string`                     | Optional custom identifier; if omitted, SDK generates an anon-ID. |

---

## 📊 What It Tracks

- **Scroll Depth** — how far down the page (%)
- **Time on Page** — seconds elapsed
- **Price Ranges Viewed** — unique price values detected
- **Clicked Elements** — labels of buttons/links tapped

Every ~3 s (and on unload) it computes an **intent score** (`low` | `medium` | `high`) and infers a **buyer tier** (`budget` | `mid` | `premium`), then POSTs a snapshot to your `/api/track` endpoint.

---

## 📡 Sending Data

By default the SDK sends to:
```bash
curl -X POST http://your-domain.com/api/track \
  -H "x-api-key: <your apiKey>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<uid>",
    "sessionId": "<sid>",
    "isCustom": false,
    "userIntent": { /* scrollDepth, timeOnPage, ... */ },
    "buyerTier": "mid",
    "intentLevel": "high",
    "timestamp": "2025-06-18T10:00:00Z"
  }'
```

## 🚀 Next Steps
Once you're up and running, head over to the Dashboard Overview to learn how to manage API keys, view session lists, filter by intent, and unlock heatmap visualizations of user clicks.