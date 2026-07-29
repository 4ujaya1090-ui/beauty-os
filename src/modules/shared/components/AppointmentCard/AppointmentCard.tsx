import "./AppointmentCard.css";

type AppointmentCardProps = {
  time: string;
  title: string;
  subtitle: string;
};

function AppointmentCard({
  time,
  title,
  subtitle,
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

    </div>
  );
}

export default AppointmentCard;