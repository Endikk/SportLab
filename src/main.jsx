import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/redesign.css";

// Détection du "vrai" liquid glass (réfraction SVG via backdrop-filter: url()).
// Chromium le supporte → réfraction réelle ; iOS Safari / Firefox → fallback flou.
try {
  const supportsRefraction =
    typeof CSS !== "undefined" &&
    CSS.supports &&
    CSS.supports("backdrop-filter", 'url("#lg-distortion")');
  document.documentElement.dataset.lg = supportsRefraction ? "on" : "off";
} catch {
  document.documentElement.dataset.lg = "off";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW registration failed:", err);
    });
  });
}
