import "./StatCard.css";

type StatCardProps = {
  title: string;
  value: string;
  onClick?: () => void;
};

function StatCard({ title, value, onClick }: StatCardProps) {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <p className="stat-card__title">{title}</p>

      <h2 className="stat-card__value">{value}</h2>
    </div>
  );
}

export default StatCard;