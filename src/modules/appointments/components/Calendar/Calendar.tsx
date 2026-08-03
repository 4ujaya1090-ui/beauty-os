import { useNavigate } from "react-router-dom";

import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import AppointmentCard from "../AppointmentCard/AppointmentCard";

import { useAppointments } from "../../context/AppointmentContext";
import { useClients } from "../../../clients/context/ClientContext";

import "./Calendar.css";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function Calendar() {
  const navigate = useNavigate();

  const { appointments, deleteAppointment, setSelectedAppointment } =
    useAppointments();
  const { clients } = useClients();

  const sorted = [...appointments].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );

  const dates = Array.from(new Set(sorted.map((a) => a.date)));

  function handleEdit(appointmentId: string) {
    const appointment = appointments.find((a) => a.id === appointmentId);

    if (!appointment) {
      return;
    }

    setSelectedAppointment(appointment);
    navigate("/appointment");
  }

  function handleDelete(appointmentId: string) {
    if (!window.confirm("Удалить эту запись?")) {
      return;
    }

    deleteAppointment(appointmentId);
  }

  if (dates.length === 0) {
    return (
      <SectionCard title="Записи">
        <p className="calendar-empty">Пока нет ни одной записи.</p>
      </SectionCard>
    );
  }

  return (
    <>
      {dates.map((date) => (
        <SectionCard key={date} title={formatDate(date)}>
          <div className="calendar-grid">
            {sorted
              .filter((appointment) => appointment.date === date)
              .map((appointment) => {
                const client = clients.find(
                  (c) => c.id === appointment.clientId
                );

                return (
                  <AppointmentCard
                    key={appointment.id}
                    time={appointment.time}
                    title={client?.name ?? "Неизвестный клиент"}
                    subtitle={`${appointment.procedure} · ${appointment.duration} мин`}
                    onEdit={() => handleEdit(appointment.id)}
                    onDelete={() => handleDelete(appointment.id)}
                  />
                );
              })}
          </div>
        </SectionCard>
      ))}
    </>
  );
}

export default Calendar;
