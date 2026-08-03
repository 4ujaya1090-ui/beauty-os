import "./AppointmentCard.css";

type AppointmentCardProps = {
  time: string;
  title: string;
  subtitle: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

function AppointmentCard({
  time,
  title,
  subtitle,
  onEdit,
  onDelete,
}: AppointmentCardProps) {
  return (
    <div className="appointment-card">

      <div className="appointment-time">
        {time}
      </div>

      <div className="appointment-info">

        <strong>{title}</strong>

        <span>{subtitle}</span>

      </div>

      <div className="appointment-card__actions">
        {onEdit && (
          <button className="appointment-card__icon" onClick={onEdit}>
            ✎
          </button>
        )}

        {onDelete && (
          <button className="appointment-card__icon" onClick={onDelete}>
            ✕
          </button>
        )}
      </div>

    </div>
  );
}

export default AppointmentCard;
