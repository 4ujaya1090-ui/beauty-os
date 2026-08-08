import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import App from "./App";

import { ClientProvider } from "./modules/clients/context/ClientContext";
import { AppointmentProvider } from "./modules/appointments/context/AppointmentContext";
import { ProcedureProvider } from "./modules/procedures/context/ProcedureContext";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { ProfileProvider } from "./modules/auth/context/ProfileContext";
import { RoleProvider } from "./modules/auth/context/RoleContext";
import { ArticleProvider } from "./modules/articles/context/ArticleContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AuthProvider>
      <ProfileProvider>
        <RoleProvider>
          <ClientProvider>
            <ProcedureProvider>
              <AppointmentProvider>
                <ArticleProvider>

                  <App />

                </ArticleProvider>
              </AppointmentProvider>
            </ProcedureProvider>
          </ClientProvider>
        </RoleProvider>
      </ProfileProvider>
    </AuthProvider>

  </StrictMode>
);
