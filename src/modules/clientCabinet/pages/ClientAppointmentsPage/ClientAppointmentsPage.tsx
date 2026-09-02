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
  const { appointments, deleteAppointment } = useAppointments();

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

  async function handleCancel(
  appointmentId: string
) {
  if (!window.confirm("Отменить эту запись?")) {
    return;
  }

  try {
    await deleteAppointment(appointmentId);
  } catch (error) {
    console.error(
      "Не удалось отменить запись:",
      error
    );

    window.alert(
      "Не удалось отменить запись. Возможно, нет доступа или произошла ошибка соединения."
    );
  }
}

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
                  <div>
                    <span className="client-appointments-item__date">
                      {formatDate(a.date)} · {a.time}
                    </span>

                    <span className="client-appointments-item__procedure">
                      {a.procedure} · {a.duration} мин
                    </span>
                  </div>

                  <button
                    className="client-appointments-item__cancel"
                    onClick={() => handleCancel(a.id)}
                  >
                    Отменить
                  </button>
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