import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";

import { useRole } from "../../../auth/context/RoleContext";
import { useAppointments } from "../../../appointments/context/AppointmentContext";

import "./ClientAppointmentsPage.css";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function ClientAppointmentsPage() {
  const { clientRecord } = useRole();
  const { appointments } = useAppointments();

  if (!clientRecord) {
    return null;
  }

  const now = new Date();

  const upcoming = appointments
    .filter((a) => a.clientId === clientRecord.id)
    .filter((a) => new Date(`${a.date}T${a.time}`) >= now)
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
    );

  return (
    <MainLayout>
      <div className="client-appointments-page">
        <SectionCard title="Мои записи">
          {upcoming.length === 0 ? (
            <p>Предстоящих записей нет.</p>
          ) : (
            <div className="client-appointments-list">
              {upcoming.map((a) => (
                <div className="client-appointments-item" key={a.id}>
                  <span className="client-appointments-item__date">
                    {formatDate(a.date)} · {a.time}
                  </span>

                  <span className="client-appointments-item__procedure">
                    {a.procedure} · {a.duration} мин
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientAppointmentsPage;
