import { init, userIntent } from "../dist/intentmesh.min.js";

init({
  priceSelectors: [".price"],
  clickSelector: ".add-to-cart, .btn-cta",
});

window.addEventListener("beforeunload", () => {
  console.log("Final intent snapshot:", userIntent);
});
