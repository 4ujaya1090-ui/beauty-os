import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import App from "./App";

import { ClientProvider } from "./context/ClientContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <ClientProvider>

      <App />

    </ClientProvider>

  </StrictMode>
);