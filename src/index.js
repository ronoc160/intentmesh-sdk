let state = {
  buyer_tier: "unknown",
  intent: "browsing",
  confidence: 0.5,
};

function startIntentMesh() {
  console.log("IntentMesh SDK started");
  // Simulated behavior
  setTimeout(() => {
    state = { buyer_tier: "mid-high", intent: "considering", confidence: 0.82 };
    window.dispatchEvent(new CustomEvent("IntentMeshUpdate", { detail: state }));
  }, 3000);
}

function onUpdate(callback) {
  window.addEventListener("IntentMeshUpdate", (e) => callback(e.detail));
}

export { startIntentMesh, onUpdate };
