import {
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import MedicalCard from "../../components/MedicalCard/MedicalCard";
import ClientInfoPanel from "../../components/ClientInfoPanel/ClientInfoPanel";
import CreateClientLogin from "../../components/CreateClientLogin/CreateClientLogin";

import { useClients } from "../../context/ClientContext";
import {
  useAppointments,
} from "../../../appointments/context/AppointmentContext";

import AppointmentPhotos from "../../../appointments/components/AppointmentPhotos/AppointmentPhotos";

import "./ClientProfilePage.css";

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function formatDate(isoDate: string) {
  const [
    year,
    month,
    day,
  ] = isoDate.split("-").map(Number);

  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function ClientProfilePage() {
  const navigate = useNavigate();

  const [
    isHistoryOpen,
    setIsHistoryOpen,
  ] = useState(false);

  const [
    isHistoryFormOpen,
    setIsHistoryFormOpen,
  ] = useState(false);

  const [
    historyDate,
    setHistoryDate,
  ] = useState("");

  const [
    historyProcedure,
    setHistoryProcedure,
  ] = useState("");

  const [
    historyDuration,
    setHistoryDuration,
  ] = useState("");

  const [
    historyComment,
    setHistoryComment,
  ] = useState("");

  const [
    historySaving,
    setHistorySaving,
  ] = useState(false);

  const {
    selectedClient,
    deleteClient,
  } = useClients();

  const {
    appointments,
    addAppointment,
    deleteAppointment,
    setSelectedAppointment,
  } = useAppointments();

  if (!selectedClient) {
    return (
      <MainLayout>
        <div className="client-profile">
          <h2>Клиент не выбран</h2>
        </div>
      </MainLayout>
    );
  }

  const clientId =
    selectedClient.id;

  const clientHistory =
    appointments
      .filter(
        (appointment) =>
          appointment.clientId ===
          clientId
      )
      .sort((a, b) =>
        `${b.date}T${b.time ?? "00:00"}`.localeCompare(
          `${a.date}T${a.time ?? "00:00"}`
        )
      );

  function handleEditAppointment(
    appointmentId: string
  ) {
    const appointment =
      clientHistory.find(
        (item) =>
          item.id === appointmentId
      );

    if (!appointment) {
      return;
    }

    setSelectedAppointment(
      appointment
    );

    navigate("/appointment");
  }

  function handleDeleteAppointment(
    appointmentId: string
  ) {
    if (
      !window.confirm(
        "Удалить эту запись?"
      )
    ) {
      return;
    }

    deleteAppointment(
      appointmentId
    );
  }

  async function handleAddHistory(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !historyDate ||
      !historyProcedure.trim()
    ) {
      return;
    }

    setHistorySaving(true);

    try {
      const historyEntry = {
        clientId: clientId,
        procedure:
          historyProcedure.trim(),
        duration:
          Number(historyDuration) || 0,
        date: historyDate,
        time: "",
        source: "history" as const,
      };

      const comment =
        historyComment.trim();

      if (comment) {
        await addAppointment({
          ...historyEntry,
          comment,
        });
      } else {
        await addAppointment(
          historyEntry
        );
      }

      setHistoryDate("");
      setHistoryProcedure("");
      setHistoryDuration("");
      setHistoryComment("");

      setIsHistoryFormOpen(false);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error(
        "Failed to add history entry:",
        error
      );

      alert(
        "Не удалось сохранить историю."
      );
    } finally {
      setHistorySaving(false);
    }
  }

  function handleDelete() {
    if (!selectedClient) {
      return;
    }

    if (
      !window.confirm(
        "Удалить клиента?"
      )
    ) {
      return;
    }

    deleteClient(
      selectedClient.id
    );

    navigate("/clients");
  }

  return (
    <MainLayout>
      <div className="client-profile">
        <ClientInfoPanel
          client={selectedClient}
        />

        <MedicalCard
          client={selectedClient}
        />

        <SectionCard title="Личный кабинет клиента">
          <CreateClientLogin
            client={selectedClient}
          />
        </SectionCard>

        <PrimaryButton
          onClick={handleDelete}
        >
          🗑 Удалить клиента
        </PrimaryButton>

        <SectionCard title="">
          <button
            type="button"
            className="client-history__toggle"
            onClick={() =>
              setIsHistoryOpen(
                (current) => !current
              )
            }
            aria-expanded={
              isHistoryOpen
            }
          >
            <span>
              История процедур
            </span>

            <span
              className={`client-history__arrow ${
                isHistoryOpen
                  ? "client-history__arrow--open"
                  : ""
              }`}
            >
              ▾
            </span>
          </button>

          {isHistoryOpen && (
            <div className="client-history">
              <button
                type="button"
                className="client-history__add-button"
                onClick={() =>
                  setIsHistoryFormOpen(
                    (current) =>
                      !current
                  )
                }
              >
                {isHistoryFormOpen
                  ? "Отменить добавление"
                  : "+ Добавить в историю"}
              </button>

              {isHistoryFormOpen && (
                <form
                  className="client-history__form"
                  onSubmit={
                    handleAddHistory
                  }
                >
                  <label className="client-history__field">
                    <span>Дата</span>

                    <input
                      type="date"
                      value={
                        historyDate
                      }
                      onChange={(event) =>
                        setHistoryDate(
                          event.target
                            .value
                        )
                      }
                      required
                    />

                    <small>
                      Дата может быть
                      приблизительной.
                    </small>
                  </label>

                  <label className="client-history__field">
                    <span>
                      Процедура
                    </span>

                    <input
                      type="text"
                      value={
                        historyProcedure
                      }
                      onChange={(event) =>
                        setHistoryProcedure(
                          event.target
                            .value
                        )
                      }
                      placeholder="Например, чистка лица"
                      required
                    />
                  </label>

                  <label className="client-history__field">
                    <span>
                      Длительность
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={
                        historyDuration
                      }
                      onChange={(event) =>
                        setHistoryDuration(
                          event.target
                            .value
                        )
                      }
                      placeholder="Необязательно"
                    />
                  </label>

                  <label className="client-history__field">
                    <span>
                      Комментарий
                    </span>

                    <textarea
                      value={
                        historyComment
                      }
                      onChange={(event) =>
                        setHistoryComment(
                          event.target
                            .value
                        )
                      }
                      placeholder="Необязательно"
                      rows={3}
                    />
                  </label>

                  <button
                    type="submit"
                    className="client-history__save-button"
                    disabled={
                      historySaving
                    }
                  >
                    {historySaving
                      ? "Сохранение..."
                      : "Сохранить"}
                  </button>
                </form>
              )}

              {clientHistory.length ===
              0 ? (
                <p>
                  История пока
                  отсутствует.
                </p>
              ) : (
                clientHistory.map(
                  (appointment) => (
                    <div
                      className="client-history__row"
                      key={
                        appointment.id
                      }
                    >
                      <div className="client-history__item">
                        <div>
                          <span className="client-history__date">
                            {formatDate(
                              appointment.date
                            )}
                            {appointment.time
                              ? ` · ${appointment.time}`
                              : ""}
                          </span>

                          <span className="client-history__procedure">
                            {
                              appointment.procedure
                            }

                            {appointment.duration >
                            0
                              ? ` · ${appointment.duration} мин`
                              : ""}
                          </span>

                          {appointment.source ===
                            "history" && (
                            <span className="client-history__history-label">
                              Историческая
                              запись
                            </span>
                          )}

                          <AppointmentPhotos
                            photos={
                              appointment.photos
                            }
                          />
                        </div>

                        <div className="client-history__actions">
                          {appointment.source !==
                            "history" && (
                            <button
                              type="button"
                              className="client-history__icon"
                              onClick={() =>
                                handleEditAppointment(
                                  appointment.id
                                )
                              }
                            >
                              ✎
                            </button>
                          )}

                          <button
                            type="button"
                            className="client-history__icon"
                            onClick={() =>
                              handleDeleteAppointment(
                                appointment.id
                              )
                            }
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientProfilePage;