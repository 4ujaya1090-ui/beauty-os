import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

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

import { db } from "../../../../firebase/config";

import {
  createSpecialistTelegramLink,
} from "../../services/specialistTelegramService";

import "./ScheduleSettingsPage.css";

const DAYS: {
  key: keyof WorkingHours;
  label: string;
}[] = [
  {
    key: "monday",
    label: "Понедельник",
  },
  {
    key: "tuesday",
    label: "Вторник",
  },
  {
    key: "wednesday",
    label: "Среда",
  },
  {
    key: "thursday",
    label: "Четверг",
  },
  {
    key: "friday",
    label: "Пятница",
  },
  {
    key: "saturday",
    label: "Суббота",
  },
  {
    key: "sunday",
    label: "Воскресенье",
  },
];

function ScheduleSettingsPage() {
  const { profile, saveProfile } = useProfile();

  const [workingHours, setWorkingHours] =
    useState<WorkingHours>(
      profile?.workingHours ??
        DEFAULT_WORKING_HOURS
    );

  const [labels, setLabels] =
    useState(
      profile?.medicalCardLabels ??
        DEFAULT_MEDICAL_CARD_LABELS
    );

  const [isSavingSchedule, setIsSavingSchedule] =
    useState(false);

  const [isSavingLabels, setIsSavingLabels] =
    useState(false);

  const [
    telegramConnected,
    setTelegramConnected,
  ] = useState(false);

  const [
    telegramNotificationsEnabled,
    setTelegramNotificationsEnabled,
  ] = useState(false);

  const [
    isTelegramLoading,
    setIsTelegramLoading,
  ] = useState(true);

  const [
    isTelegramConnecting,
    setIsTelegramConnecting,
  ] = useState(false);

  const [
    isSavingTelegram,
    setIsSavingTelegram,
  ] = useState(false);

  /*
   * ============================================================
   * PROFILE
   * ============================================================
   */

  useEffect(() => {
    if (!profile) {
      return;
    }

    setWorkingHours(
      profile.workingHours ??
        DEFAULT_WORKING_HOURS
    );

    setLabels(
      profile.medicalCardLabels ??
        DEFAULT_MEDICAL_CARD_LABELS
    );
  }, [profile]);

  /*
   * ============================================================
   * TELEGRAM STATUS
   * ============================================================
   */

  useEffect(() => {
    if (!profile) {
      setIsTelegramLoading(false);
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setTelegramConnected(false);
      setTelegramNotificationsEnabled(false);
      setIsTelegramLoading(false);
      return;
    }

    const specialistUid = currentUser.uid;

    let isMounted = true;

    async function loadTelegramStatus() {
      try {
        const telegramRef = doc(
          db,
          "specialistTelegram",
          specialistUid
        );

        const telegramSnapshot =
          await getDoc(telegramRef);

        if (!isMounted) {
          return;
        }

        if (!telegramSnapshot.exists()) {
          setTelegramConnected(false);
          setTelegramNotificationsEnabled(false);
          return;
        }

        const data =
          telegramSnapshot.data();

        setTelegramConnected(
          data.connected === true
        );

        setTelegramNotificationsEnabled(
          data.notificationsEnabled !== false
        );
      } catch (error) {
        console.error(
          "Не удалось загрузить состояние Telegram:",
          error
        );
      } finally {
        if (isMounted) {
          setIsTelegramLoading(false);
        }
      }
    }

    loadTelegramStatus();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  /*
   * ============================================================
   * TELEGRAM POLLING
   *
   * Пока isTelegramConnecting === true,
   * раз в 3 секунды проверяем Firestore:
   * вдруг бот уже сохранил подписку.
   *
   * Через 2 минуты ожидания автоматически
   * останавливаемся.
   * ============================================================
   */

  useEffect(() => {
    if (!isTelegramConnecting || !profile) {
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setIsTelegramConnecting(false);
      return;
    }

    const specialistUid = currentUser.uid;

    let cancelled = false;

    const interval = setInterval(async () => {
      try {
        const telegramRef = doc(
          db,
          "specialistTelegram",
          specialistUid
        );

        const snapshot =
          await getDoc(telegramRef);

        if (cancelled) {
          return;
        }

        if (
          snapshot.exists() &&
          snapshot.data().connected === true
        ) {
          setTelegramConnected(true);
          setTelegramNotificationsEnabled(
            snapshot.data().notificationsEnabled !==
              false
          );
          setIsTelegramConnecting(false);
        }
      } catch (error) {
        console.error(
          "Ошибка при проверке подключения Telegram:",
          error
        );
      }
    }, 3000);

    const timeout = setTimeout(() => {
      if (!cancelled) {
        setIsTelegramConnecting(false);
      }
    }, 120000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isTelegramConnecting, profile]);

  /*
   * ============================================================
   * WORKING HOURS
   * ============================================================
   */

  function updateDay(
    key: keyof WorkingHours,
    patch: Partial<WorkingDay>
  ) {
    setWorkingHours((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...patch,
      },
    }));
  }

  async function handleSaveSchedule() {
    if (!profile) {
      return;
    }

    setIsSavingSchedule(true);

    try {
      await saveProfile({
        ...profile,
        workingHours,
      });

      window.alert("График сохранён");
    } catch (error) {
      console.error(
        "Не удалось сохранить график:",
        error
      );

      window.alert(
        "Не получилось сохранить график."
      );
    } finally {
      setIsSavingSchedule(false);
    }
  }

  /*
   * ============================================================
   * MEDICAL CARD LABELS
   * ============================================================
   */

  async function handleSaveLabels() {
    if (!profile) {
      return;
    }

    setIsSavingLabels(true);

    try {
      await saveProfile({
        ...profile,
        medicalCardLabels: labels,
      });

      window.alert("Подписи сохранены");
    } catch (error) {
      console.error(
        "Не удалось сохранить подписи:",
        error
      );

      window.alert(
        "Не получилось сохранить подписи."
      );
    } finally {
      setIsSavingLabels(false);
    }
  }

  /*
   * ============================================================
   * TELEGRAM CONNECTION
   * ============================================================
   */

  async function handleConnectTelegram() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      window.alert(
        "Не удалось определить текущего пользователя."
      );
      return;
    }

    /*
     * Открываем вкладку сразу по клику,
     * чтобы браузер не заблокировал её как popup.
     */
    const telegramWindow =
      window.open(
        "about:blank",
        "_blank"
      );

    setIsTelegramConnecting(true);

    try {
      const link =
        await createSpecialistTelegramLink(
          currentUser.uid
        );

      if (telegramWindow) {
        telegramWindow.location.href =
          link;
      } else {
        window.alert(
          "Браузер заблокировал открытие Telegram. Разрешите всплывающие окна для Beauty OS и попробуйте ещё раз."
        );

        setIsTelegramConnecting(false);
      }

      /*
       * Если вкладка открылась,
       * polling продолжит проверять подключение.
       */
    } catch (error) {
      console.error(
        "Не удалось создать Telegram-ссылку:",
        error
      );

      if (telegramWindow) {
        telegramWindow.close();
      }

      window.alert(
        "Не удалось подключить Telegram. Попробуйте ещё раз."
      );

      setIsTelegramConnecting(false);
    }
  }

  /*
   * ============================================================
   * TELEGRAM NOTIFICATIONS
   * ============================================================
   */

  async function handleToggleTelegramNotifications() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      window.alert(
        "Не удалось определить текущего пользователя."
      );
      return;
    }

    const newValue =
      !telegramNotificationsEnabled;

    setIsSavingTelegram(true);

    try {
      const telegramRef = doc(
        db,
        "specialistTelegram",
        currentUser.uid
      );

      await setDoc(
        telegramRef,
        {
          notificationsEnabled: newValue,
        },
        {
          merge: true,
        }
      );

      setTelegramNotificationsEnabled(
        newValue
      );
    } catch (error) {
      console.error(
        "Не удалось изменить настройки Telegram:",
        error
      );

      window.alert(
        "Не удалось изменить настройки Telegram."
      );
    } finally {
      setIsSavingTelegram(false);
    }
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  if (!profile) {
    return null;
  }

  return (
    <MainLayout>
      <div className="schedule-settings-page">

        {/* ======================================================
            WORKING SCHEDULE
        ====================================================== */}

        <SectionCard title="Рабочий график">
          <div className="schedule-settings__days">
            {DAYS.map(
              ({
                key,
                label,
              }) => {
                const day =
                  workingHours[key];

                return (
                  <div
                    className="schedule-settings__day"
                    key={key}
                  >
                    <label className="schedule-settings__checkbox">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(event) =>
                          updateDay(
                            key,
                            {
                              enabled:
                                event.target.checked,
                            }
                          )
                        }
                      />

                      {label}
                    </label>

                    {day.enabled ? (
                      <div className="schedule-settings__time">
                        <input
                          type="time"
                          value={day.start}
                          onChange={(event) =>
                            updateDay(
                              key,
                              {
                                start:
                                  event.target.value,
                              }
                            )
                          }
                        />

                        <span>
                          —
                        </span>

                        <input
                          type="time"
                          value={day.end}
                          onChange={(event) =>
                            updateDay(
                              key,
                              {
                                end:
                                  event.target.value,
                              }
                            )
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
              }
            )}
          </div>

          <PrimaryButton
            onClick={
              handleSaveSchedule
            }
            disabled={
              isSavingSchedule
            }
          >
            {isSavingSchedule
              ? "Сохраняем..."
              : "Сохранить график"}
          </PrimaryButton>
        </SectionCard>

        {/* ======================================================
            MEDICAL CARD LABELS
        ====================================================== */}

        <SectionCard title="Подписи карты клиента">
          <p className="schedule-settings__hint">
            Эти три поля есть в карточке
            каждого клиента. Назовите их так,
            как удобно для вашей специализации.
          </p>

          <TextField
            label="Поле 1"
            value={labels.field1}
            onChange={(value) =>
              setLabels(
                (prev) => ({
                  ...prev,
                  field1: value,
                })
              )
            }
          />

          <TextField
            label="Поле 2"
            value={labels.field2}
            onChange={(value) =>
              setLabels(
                (prev) => ({
                  ...prev,
                  field2: value,
                })
              )
            }
          />

          <TextField
            label="Поле 3"
            value={labels.field3}
            onChange={(value) =>
              setLabels(
                (prev) => ({
                  ...prev,
                  field3: value,
                })
              )
            }
          />

          <PrimaryButton
            onClick={
              handleSaveLabels
            }
            disabled={
              isSavingLabels
            }
          >
            {isSavingLabels
              ? "Сохраняем..."
              : "Сохранить подписи"}
          </PrimaryButton>
        </SectionCard>

        {/* ======================================================
            TELEGRAM
        ====================================================== */}

        <SectionCard title="Telegram">
          <div className="schedule-settings__telegram">
            <span className="schedule-settings__telegram-title">
              Уведомления с Telegram
            </span>

            {isTelegramLoading ? (
              <span className="schedule-settings__telegram-loading">
                Проверяем...
              </span>
            ) : isTelegramConnecting ? (
              <span className="schedule-settings__telegram-loading">
                Ожидаем подтверждения...
              </span>
            ) : (
              <div className="schedule-settings__telegram-actions">
                <button
                  type="button"
                  className="schedule-settings__telegram-button"
                  onClick={handleConnectTelegram}
                >
                  {telegramConnected
                    ? "Переподключить Telegram"
                    : "Подключить Telegram"}
                </button>

                {telegramConnected && (
                  <button
                    type="button"
                    className="schedule-settings__telegram-button"
                    onClick={handleToggleTelegramNotifications}
                    disabled={isSavingTelegram}
                  >
                    {telegramNotificationsEnabled
                      ? "Отключить уведомления"
                      : "Включить уведомления"}
                  </button>
                )}
              </div>
            )}
          </div>
        </SectionCard>

      </div>
    </MainLayout>
  );
}

export default ScheduleSettingsPage;