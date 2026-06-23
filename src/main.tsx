import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./app/App";
import "./shared/styles/tokens.css";
import "./shared/styles/base.css";
import "./shared/styles/layout.css";
import "./shared/styles/components.css";
import { removeTrackingParametersFromAddressBar } from "./shared/utils/trackingParameters";

removeTrackingParametersFromAddressBar();
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
