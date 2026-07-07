import type { ReactNode } from "react";
import "./MainLayout.css";

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return <main className="layout">{children}</main>;
}

export default MainLayout;