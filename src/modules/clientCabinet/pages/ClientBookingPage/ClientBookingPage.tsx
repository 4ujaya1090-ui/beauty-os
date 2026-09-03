import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useRole } from "../../../auth/context/RoleContext";
import {
  useSpecialistProfile,
  DEFAULT_WORKING_HOURS,
  type WorkingHours,
} from "../../../auth/context/ProfileContext";

import { useProcedures } from "../../../procedures/context/ProcedureContext";
import { useAppointments } from "../../../appointments/context/AppointmentContext";

import "./ClientBookingPage.css";

const DAY_KEYS: (keyof WorkingHours)[] = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
];

const SLOT_STEP_MINUTES = 30;

function toLocalIsoDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTimeString(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function ClientBookingPage() {
  const navigate = useNavigate();

  const { clientRecord } = useRole();
  const { specialistProfile, loading: specialistLoading } =
    useSpecialistProfile();
  const { procedures } = useProcedures();
  const { addAppointment, getConflict } = useAppointments();

  const [procedureId, setProcedureId] = useState("");
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedProcedure = procedures.find((p) => p.id === procedureId);

  const workingHours =
    specialistProfile?.workingHours ?? DEFAULT_WORKING_HOURS;

  const today = toLocalIsoDate(new Date());

  const daySchedule = date
    ? workingHours[DAY_KEYS[new Date(`${date}T00:00:00`).getDay()]]
    : null;

  function getAvailableSlots(): string[] {
    if (!date || !daySchedule || !daySchedule.enabled || !selectedProcedure) {
      return [];
    }

    const startMinutes = toMinutes(daySchedule.start);
    const endMinutes = toMinutes(daySchedule.end);
    const duration = selectedProcedure.duration;

    const now = new Date();
    const isToday = date === today;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const slots: string[] = [];

    for (
      let t = startMinutes;
      t + duration <= endMinutes;
      t += SLOT_STEP_MINUTES
    ) {
      if (isToday && t <= nowMinutes) {
        continue;
      }

      const timeStr = toTimeString(t);

      const conflict = getConflict({ date, time: timeStr, duration });

      if (conflict) {
        continue;
      }

      slots.push(timeStr);
    }

    return slots;
  }

  const availableSlots = getAvailableSlots();

  async function handleBook() {
    if (!clientRecord || !selectedProcedure || !date || !selectedTime) {
      window.alert("Выберите процедуру, дату и время");
      return;
    }

    setIsSaving(true);

    try {
      // Проверяем ещё раз прямо перед сохранением — вдруг
      // это время заняли, пока клиент выбирал.
      const conflict = getConflict({
        date,
        time: selectedTime,
        duration: selectedProcedure.duration,
      });

      if (conflict) {
        window.alert(
          "Это время только что заняли. Пожалуйста, выберите другое."
        );
        setSelectedTime("");
        return;
      }

      await addAppointment({
        clientId: clientRecord.id,
        procedure: selectedProcedure.name,
        duration: selectedProcedure.duration,
        date,
        time: selectedTime,
        comment: "",
      });

      navigate("/my/appointments");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MainLayout>
      <div className="client-booking-page">
        <SectionCard title="Записаться на приём">
          <div className="client-booking__field">
            <label className="client-booking__label">Процедура</label>

            <select
              className="client-booking__select"
              value={procedureId}
              onChange={(e) => {
                setProcedureId(e.target.value);
                setSelectedTime("");
              }}
            >
              <option value="" disabled>
                Выберите процедуру
              </option>

              {procedures.map((procedure) => (
                <option key={procedure.id} value={procedure.id}>
                  {procedure.name} · {procedure.duration} мин
                </option>
              ))}
            </select>
          </div>

          <div className="client-booking__field">
            <label className="client-booking__label">Дата</label>

            <input
              className="client-booking__date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedTime("");
              }}
            />
          </div>

          {date && !selectedProcedure && (
            <p className="client-booking__hint">Сначала выберите процедуру.</p>
          )}

          {date && selectedProcedure && specialistLoading && (
            <p className="client-booking__hint">Загрузка расписания...</p>
          )}

          {date &&
            selectedProcedure &&
            !specialistLoading &&
            daySchedule &&
            !daySchedule.enabled && (
              <p className="client-booking__hint">
                В этот день нет свободных окон.
              </p>
            )}

          {date &&
            selectedProcedure &&
            !specialistLoading &&
            daySchedule?.enabled && (
              <div className="client-booking__field">
                <label className="client-booking__label">Время</label>

                {availableSlots.length === 0 ? (
                  <p className="client-booking__hint">
                    На эту дату свободного времени не осталось.
                  </p>
                ) : (
                  <div className="client-booking__slots">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        className={
                          slot === selectedTime
                            ? "client-booking__slot client-booking__slot--active"
                            : "client-booking__slot"
                        }
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
        </SectionCard>

        <PrimaryButton
          onClick={handleBook}
          disabled={isSaving || !selectedTime}
        >
          {isSaving ? "Записываем..." : "Записаться"}
        </PrimaryButton>
      </div>
    </MainLayout>
  );
}

export default ClientBookingPage;
