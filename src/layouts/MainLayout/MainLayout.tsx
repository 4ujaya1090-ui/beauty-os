import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./MainLayout.css";

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <main className="layout">
      {!isHome && (
        <button className="layout__home" onClick={() => navigate("/")}>
          ← На главную
        </button>
      )}

      {children}
    </main>
  );
}

export default MainLayout;
