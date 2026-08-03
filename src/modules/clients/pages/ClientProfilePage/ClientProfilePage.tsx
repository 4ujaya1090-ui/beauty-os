import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import MedicalCard from "../../components/MedicalCard/MedicalCard";
import ClientInfoPanel from "../../components/ClientInfoPanel/ClientInfoPanel";

import PhotoGallery from "../../../appointments/components/PhotoGallery/PhotoGallery";

import { useClients } from "../../context/ClientContext";
import { useAppointments } from "../../../appointments/context/AppointmentContext";

import "./ClientProfilePage.css";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function ClientProfilePage() {
  const navigate = useNavigate();

  const {
    selectedClient,
    deleteClient,
  } = useClients();

  const {
    appointments,
    deleteAppointment,
    setSelectedAppointment,
  } = useAppointments();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!selectedClient) {
    return (
      <MainLayout>
        <div className="client-profile">
          <h2>Клиент не выбран</h2>
        </div>
      </MainLayout>
    );
  }

  const clientHistory = appointments
    .filter((appointment) => appointment.clientId === selectedClient.id)
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  function handleEditAppointment(appointmentId: string) {
    const appointment = clientHistory.find((a) => a.id === appointmentId);

    if (!appointment) {
      return;
    }

    setSelectedAppointment(appointment);
    navigate("/appointment");
  }

  function handleDeleteAppointment(appointmentId: string) {
    if (!window.confirm("Удалить эту запись?")) {
      return;
    }

    deleteAppointment(appointmentId);
  }

  function handleDelete() {
    if (!selectedClient) {
      return;
    }

    if (!window.confirm("Удалить клиента?")) {
      return;
    }

    deleteClient(selectedClient.id);

    navigate("/clients");
  }

  function toggleExpanded(appointmentId: string) {
    setExpandedId((current) =>
      current === appointmentId ? null : appointmentId
    );
  }

  return (
    <MainLayout>

      <div className="client-profile">
        <ClientInfoPanel client={selectedClient} />

        <MedicalCard client={selectedClient} />

        <PrimaryButton onClick={handleDelete}>
          🗑 Удалить клиента
        </PrimaryButton>

        <SectionCard title="История процедур">
          {clientHistory.length === 0 ? (
            <p>История пока отсутствует.</p>
          ) : (
            <div className="client-history">
              {clientHistory.map((appointment) => (
                <div className="client-history__row" key={appointment.id}>
                  <div className="client-history__item">
                    <div>
                      <span className="client-history__date">
                        {formatDate(appointment.date)} · {appointment.time}
                      </span>

                      <span className="client-history__procedure">
                        {appointment.procedure} · {appointment.duration} мин
                      </span>
                    </div>

                    <div className="client-history__actions">
                      <button
                        className="client-history__icon"
                        onClick={() => toggleExpanded(appointment.id)}
                      >
                        📷 {appointment.photos?.length ?? 0}
                      </button>

                      <button
                        className="client-history__icon"
                        onClick={() => handleEditAppointment(appointment.id)}
                      >
                        ✎
                      </button>

                      <button
                        className="client-history__icon"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {expandedId === appointment.id && (
                    <PhotoGallery
                      appointmentId={appointment.id}
                      photos={appointment.photos ?? []}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientProfilePage;