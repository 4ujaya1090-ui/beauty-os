import LoginPage from "./modules/auth/pages/LoginPage/LoginPage";
import ProfileSetupPage from "./modules/auth/pages/ProfileSetupPage/ProfileSetupPage";
import { useAuth } from "./modules/auth/context/AuthContext";
import { useProfile } from "./modules/auth/context/ProfileContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./modules/shared/pages/HomePage/HomePage";
import AppointmentPage from "./modules/appointments/pages/AppointmentPage/AppointmentPage";
import CalendarPage from "./modules/appointments/pages/CalendarPage/CalendarPage";
import ProceduresPage from "./modules/procedures/pages/ProceduresPage/ProceduresPage";

import ClientsPage from "./modules/clients/pages/ClientsPage/ClientsPage";
import ClientProfilePage from "./modules/clients/pages/ClientProfilePage/ClientProfilePage";
import NewClientPage from "./modules/clients/pages/NewClientPage/NewClientPage";
import EditClientPage from "./modules/clients/pages/EditClientPage/EditClientPage";

import ArticlesPage from "./modules/articles/pages/ArticlesPage/ArticlesPage";
import NewArticlePage from "./modules/articles/pages/NewArticlePage/NewArticlePage";
import ArticlePage from "./modules/articles/pages/ArticlePage/ArticlePage";
import EditArticlePage from "./modules/articles/pages/EditArticlePage/EditArticlePage";

function App() {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (loading) {
    return null;
  }

  if (!user) {
    return <LoginPage />;
  }

  if (profileLoading) {
    return null;
  }

  if (!profile) {
    return <ProfileSetupPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/appointment"
          element={<AppointmentPage />}
        />

        <Route
          path="/calendar"
          element={<CalendarPage />}
        />

        <Route
          path="/procedures"
          element={<ProceduresPage />}
        />

        <Route
          path="/clients"
          element={<ClientsPage />}
        />

        <Route
          path="/client"
          element={<ClientProfilePage />}
        />

        <Route
          path="/new-client"
          element={<NewClientPage />}
        />

        <Route
          path="/edit-client"
          element={<EditClientPage />}
        />

        <Route
          path="/articles"
          element={<ArticlesPage />}
        />

        <Route
          path="/articles/new"
          element={<NewArticlePage />}
        />

        <Route
          path="/article"
          element={<ArticlePage />}
        />

        <Route
          path="/edit-article"
          element={<EditArticlePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;