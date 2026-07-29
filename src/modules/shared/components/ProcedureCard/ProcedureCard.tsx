import GlassCard from "../GlassCard/GlassCard";

import "./ProcedureCard.css";

type ProcedureCardProps = {
  name: string;
  duration: number;
  price: number;
};

function ProcedureCard({
  name,
  duration,
  price,
}: ProcedureCardProps) {
  return (
    <GlassCard>

      <h3>{name}</h3>

      <p>{duration} мин.</p>

      <strong>{price.toLocaleString()} сум</strong>

    </GlassCard>
  );
}

export default ProcedureCard;