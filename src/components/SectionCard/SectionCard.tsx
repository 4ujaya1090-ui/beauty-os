import "./SectionCard.css";
import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <h2 className="section-card__title">{title}</h2>

      <div className="section-card__content">
        {children}
      </div>
    </section>
  );
}

export default SectionCard;