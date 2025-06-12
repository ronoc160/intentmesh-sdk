import { startIntentMesh, onUpdate } from './index.js';


startIntentMesh();

onUpdate((state) => {
  document.getElementById("status").textContent = 
    `Detected: ${state.intent} (${state.buyer_tier}) – Confidence: ${state.confidence}`;
});
