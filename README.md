# IntentMesh SDK

A lightweight JavaScript SDK to detect real-time shopper intent and spending behavior for e-commerce personalization.

## Features
- Tracks scroll, click, and time-based behavior
- Outputs buyer_tier and intent tags
- Cookie-free, privacy-first design

## Usage
```javascript
import { startIntentMesh, onUpdate } from './src/index.js';

startIntentMesh();
onUpdate((state) => {
  console.log(state); // { buyer_tier: "budget", intent: "browsing", confidence: 0.85 }
});
```
