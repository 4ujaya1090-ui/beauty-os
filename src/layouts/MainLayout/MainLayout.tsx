import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./MainLayout.css";

type MainLayoutProps = {
  children: ReactNode;
  topAction?: ReactNode;
};

function MainLayout({ children, topAction }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <main className="layout">
      {!isHome && (
        <div className="layout__top">
          <button
            className="layout__home"
            onClick={() => navigate("/")}
          >
            ← На главную
          </button>

          {topAction && (
            <div className="layout__action">
              {topAction}
            </div>
          )}
        </div>
      )}

      {children}
    </main>
  );
}

export default MainLayout;