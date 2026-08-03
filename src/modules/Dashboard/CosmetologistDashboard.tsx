import { useNavigate } from "react-router-dom";
import Header from "../shared/components/Header/Header";
import GlassCard from "../shared/components/GlassCard/GlassCard";
import StatCard from "../shared/components/StatCard/StatCard";
import QuickActions from "../shared/components/QuickActions/QuickActions";

import { useAppointments } from "../appointments/context/AppointmentContext";
import { useClients } from "../clients/context/ClientContext";

import "./CosmetologistDashboard.css";

function CosmetologistDashboard() {
  const navigate = useNavigate();

  const { appointments } = useAppointments();
  const { clients } = useClients();

  const now = new Date();

  const nextAppointment = [...appointments]
    .filter((a) => new Date(`${a.date}T${a.time}`) >= now)
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
    )[0];

  const nextClient = nextAppointment
    ? clients.find((c) => c.id === nextAppointment.clientId)
    : null;

function toLocalIsoDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const todayIso = toLocalIsoDate(now);
const todayCount = appointments.filter((a) => a.date === todayIso).length;

  return (
    <>
      <Header />

      <GlassCard>
        <h2 className="next-title">Следующая запись</h2>

        {nextAppointment ? (
          <p className="next-empty">
            {nextClient?.name ?? "Клиент"} · {nextAppointment.procedure} ·{" "}
            {nextAppointment.time}
          </p>
        ) : (
          <p className="next-empty">Свободно.</p>
        )}
      </GlassCard>

      <section className="stats">
        <StatCard title="Сегодня" value={String(todayCount)} />
        <StatCard
          title="Клиенты"
          value={String(clients.length)}
          onClick={() => navigate("/clients")}
        />
        <StatCard title="Бонусы" value="1250" />
        <StatCard title="Статьи" value="25" />
      </section>
      <QuickActions />
    </>
  );
}

export default CosmetologistDashboard;
