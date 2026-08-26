import { useState } from "react";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import TextField from "../../../shared/components/TextField/TextField";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import {
  useProfile,
  DEFAULT_WORKING_HOURS,
  DEFAULT_MEDICAL_CARD_LABELS,
  type WorkingHours,
  type WorkingDay,
} from "../../context/ProfileContext";

import "./ScheduleSettingsPage.css";

const DAYS: { key: keyof WorkingHours; label: string }[] = [
  { key: "monday", label: "Понедельник" },
  { key: "tuesday", label: "Вторник" },
  { key: "wednesday", label: "Среда" },
  { key: "thursday", label: "Четверг" },
  { key: "friday", label: "Пятница" },
  { key: "saturday", label: "Суббота" },
  { key: "sunday", label: "Воскресенье" },
];

function ScheduleSettingsPage() {
  const { profile, saveProfile } = useProfile();

  const [workingHours, setWorkingHours] = useState<WorkingHours>(
    profile?.workingHours ?? DEFAULT_WORKING_HOURS
  );

  const [labels, setLabels] = useState(
    profile?.medicalCardLabels ?? DEFAULT_MEDICAL_CARD_LABELS
  );

  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [isSavingLabels, setIsSavingLabels] = useState(false);

  function updateDay(key: keyof WorkingHours, patch: Partial<WorkingDay>) {
    setWorkingHours((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  }

  async function handleSaveSchedule() {
    if (!profile) {
      return;
    }

    setIsSavingSchedule(true);

    try {
      await saveProfile({ ...profile, workingHours });
      window.alert("График сохранён");
    } finally {
      setIsSavingSchedule(false);
    }
  }

  async function handleSaveLabels() {
    if (!profile) {
      return;
    }

    setIsSavingLabels(true);

    try {
      await saveProfile({ ...profile, medicalCardLabels: labels });
      window.alert("Подписи сохранены");
    } finally {
      setIsSavingLabels(false);
    }
  }

  if (!profile) {
    return null;
  }

  return (
    <MainLayout>
      <div className="schedule-settings-page">
        <SectionCard title="Рабочий график">
          <div className="schedule-settings__days">
            {DAYS.map(({ key, label }) => {
              const day = workingHours[key];

              return (
                <div className="schedule-settings__day" key={key}>
                  <label className="schedule-settings__checkbox">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(e) =>
                        updateDay(key, { enabled: e.target.checked })
                      }
                    />
                    {label}
                  </label>

                  {day.enabled ? (
                    <div className="schedule-settings__time">
                      <input
                        type="time"
                        value={day.start}
                        onChange={(e) =>
                          updateDay(key, { start: e.target.value })
                        }
                      />
                      <span>—</span>
                      <input
                        type="time"
                        value={day.end}
                        onChange={(e) =>
                          updateDay(key, { end: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <span className="schedule-settings__day-off">
                      Выходной
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <PrimaryButton
            onClick={handleSaveSchedule}
            disabled={isSavingSchedule}
          >
            {isSavingSchedule ? "Сохраняем..." : "Сохранить график"}
          </PrimaryButton>
        </SectionCard>

        <SectionCard title="Подписи карты клиента">
          <p className="schedule-settings__hint">
            Эти три поля есть в карточке каждого клиента — назовите их так,
            как удобно для вашей специализации.
          </p>

          <TextField
            label="Поле 1"
            value={labels.field1}
            onChange={(value) =>
              setLabels((prev) => ({ ...prev, field1: value }))
            }
          />

          <TextField
            label="Поле 2"
            value={labels.field2}
            onChange={(value) =>
              setLabels((prev) => ({ ...prev, field2: value }))
            }
          />

          <TextField
            label="Поле 3"
            value={labels.field3}
            onChange={(value) =>
              setLabels((prev) => ({ ...prev, field3: value }))
            }
          />

          <PrimaryButton
            onClick={handleSaveLabels}
            disabled={isSavingLabels}
          >
            {isSavingLabels ? "Сохраняем..." : "Сохранить подписи"}
          </PrimaryButton>
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ScheduleSettingsPage;
