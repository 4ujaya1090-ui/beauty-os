import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "../../../shared/components/Modal/Modal";

import { useAppointments } from "../../context/AppointmentContext";
import { useClients } from "../../../clients/context/ClientContext";

import "./Calendar.css";

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

const WEEKDAYS = [
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
  "Вс",
];

function toLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);

  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function Calendar() {
  const navigate = useNavigate();

  const {
    appointments,
    deleteAppointment,
    setSelectedAppointment,
  } = useAppointments();

  const { clients } = useClients();

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
  });

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(
    year,
    month,
    1
  );

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstWeekday =
    (firstDayOfMonth.getDay() + 6) % 7;

  const totalCells =
  Math.ceil(
    (firstWeekday + daysInMonth) / 7
  ) * 7;

const calendarCells = Array.from(
  {
    length: totalCells,
  },
  (_, index) => {
    if (
      index < firstWeekday ||
      index >= firstWeekday + daysInMonth
    ) {
      return null;
    }

    return index - firstWeekday + 1;
  }
);

  const selectedAppointments = selectedDate
    ? appointments
        .filter(
          (appointment) =>
            appointment.date === selectedDate
        )
        .sort((a, b) =>
          `${a.date}T${a.time}`.localeCompare(
            `${b.date}T${b.time}`
          )
        )
    : [];

  function goToPreviousMonth() {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
    setSelectedDate(null);
  }

  function goToNextMonth() {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
    setSelectedDate(null);
  }

  function handleDateClick(date: string) {
    setSelectedDate(date);
  }

  function handleEdit(appointmentId: string) {
    const appointment = appointments.find(
      (item) => item.id === appointmentId
    );

    if (!appointment) {
      return;
    }

    setSelectedAppointment(appointment);
    setSelectedDate(null);
    navigate("/appointment");
  }

  async function handleDelete(
    appointmentId: string
  ) {
    if (
      !window.confirm(
        "Удалить эту запись?"
      )
    ) {
      return;
    }

    await deleteAppointment(appointmentId);
  }

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button
          className="calendar__month-button"
          type="button"
          onClick={goToPreviousMonth}
          aria-label="Предыдущий месяц"
        >
          ‹
        </button>

        <h2 className="calendar__title">
          {MONTHS[month]} {year}
        </h2>

        <button
          className="calendar__month-button"
          type="button"
          onClick={goToNextMonth}
          aria-label="Следующий месяц"
        >
          ›
        </button>
      </div>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((weekday) => (
          <div
            className="calendar__weekday"
            key={weekday}
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {calendarCells.map((day, index) => {
          if (day === null) {
            return (
              <div
                className="calendar__day calendar__day--empty"
                key={`empty-${index}`}
              />
            );
          }

          const date = toLocalIsoDate(
            new Date(year, month, day)
          );

          const hasAppointments =
            appointments.some(
              (appointment) =>
                appointment.date === date
            );

          const today =
            toLocalIsoDate(new Date()) === date;

          return (
            <button
              className={[
                "calendar__day",
                today
                  ? "calendar__day--today"
                  : "",
                hasAppointments
                  ? "calendar__day--has-appointments"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={date}
              type="button"
              onClick={() =>
                handleDateClick(date)
              }
            >
              <span className="calendar__day-number">
                {day}
              </span>

              {hasAppointments && (
                <span
                  className="calendar__appointment-dot"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <Modal
          title={formatDate(selectedDate)}
          onClose={() =>
            setSelectedDate(null)
          }
        >
          {selectedAppointments.length ===
          0 ? (
            <p className="calendar-modal__empty">
              На этот день записей нет.
            </p>
          ) : (
            <div className="calendar-modal__list">
              {selectedAppointments.map(
                (appointment) => {
                  const client = clients.find(
                    (item) =>
                      item.id ===
                      appointment.clientId
                  );

                  return (
                    <div
                      className="calendar-modal__item"
                      key={appointment.id}
                    >
                      <button
                        className="calendar-modal__main"
                        type="button"
                        onClick={() =>
                          handleEdit(
                            appointment.id
                          )
                        }
                      >
                        <span className="calendar-modal__time">
                          {appointment.time ||
                            "Время не указано"}
                        </span>

                        <span className="calendar-modal__client">
                          {client?.name ??
                            "Неизвестный клиент"}
                        </span>

                        <span className="calendar-modal__procedure">
                          {appointment.procedure}
                          {" · "}
                          {appointment.duration} мин
                        </span>
                      </button>

                      <div className="calendar-modal__actions">
                        <button
                          className="calendar-modal__action"
                          type="button"
                          onClick={() =>
                            handleEdit(
                              appointment.id
                            )
                          }
                          aria-label="Редактировать запись"
                        >
                          ✎
                        </button>

                        <button
                          className="calendar-modal__action calendar-modal__action--delete"
                          type="button"
                          onClick={() =>
                            handleDelete(
                              appointment.id
                            )
                          }
                          aria-label="Удалить запись"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Calendar;