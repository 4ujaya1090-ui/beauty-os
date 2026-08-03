import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import App from "./App";

import { ClientProvider } from "./modules/clients/context/ClientContext";
import { AppointmentProvider } from "./modules/appointments/context/AppointmentContext";
import { ProcedureProvider } from "./modules/procedures/context/ProcedureContext";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { ProfileProvider } from "./modules/auth/context/ProfileContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AuthProvider>
      <ProfileProvider>
        <ClientProvider>
          <ProcedureProvider>
            <AppointmentProvider>

              <App />

            </AppointmentProvider>
          </ProcedureProvider>
        </ClientProvider>
      </ProfileProvider>
    </AuthProvider>

  </StrictMode>
);