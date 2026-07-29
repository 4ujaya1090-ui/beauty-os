import type { ReactNode } from "react";
import "./GlassCard.css";

type GlassCardProps = {
  children: ReactNode;
};

function GlassCard({ children }: GlassCardProps) {
  return <section className="glass-card">{children}</section>;
}

export default GlassCard;