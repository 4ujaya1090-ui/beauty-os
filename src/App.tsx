import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import AppointmentPage from "./pages/AppointmentPage/AppointmentPage";
import ClientsPage from "./pages/ClientsPage/ClientsPage";
import ClientProfilePage from "./pages/ClientProfilePage/ClientProfilePage";
import NewClientPage from "./pages/NewClientPage/NewClientPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/appointment" element={<AppointmentPage />} />

        <Route path="/clients" element={<ClientsPage />} />

        <Route path="/client" element={<ClientProfilePage />} />

        <Route path="/new-client" element={<NewClientPage />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;