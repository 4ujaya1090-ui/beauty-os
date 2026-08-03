import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";

import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import TextField from "../../../shared/components/TextField/TextField";
import TextArea from "../../../shared/components/TextArea/TextArea";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useProcedures } from "../../../procedures/context/ProcedureContext";

import { useClients } from "../../../clients/context/ClientContext";
import { useAppointments } from "../../context/AppointmentContext";

import "./AppointmentPage.css";

const NEW_CLIENT_OPTION = "new";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("timeout"));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function AppointmentPage() {
  const navigate = useNavigate();

  const { clients, addClient } = useClients();
  const {
    addAppointment,
    updateAppointment,
    getConflict,
    selectedAppointment,
    setSelectedAppointment,
  } = useAppointments();
  const { procedures } = useProcedures();

  const isEditing = Boolean(selectedAppointment);

  // Клиент
  const [clientId, setClientId] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");

  // Процедура
  const [procedureId, setProcedureId] = useState("");

  // Дата и время
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Комментарий
  const [comment, setComment] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Если пришли редактировать существующую запись — подставляем её данные
  useEffect(() => {
    if (!selectedAppointment) {
      return;
    }

    setClientId(selectedAppointment.clientId);
    setDate(selectedAppointment.date);
    setTime(selectedAppointment.time);
    setComment(selectedAppointment.comment ?? "");

    const matchingProcedure = procedures.find(
      (procedure) => procedure.name === selectedAppointment.procedure
    );

    if (matchingProcedure) {
      setProcedureId(matchingProcedure.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppointment]);

  // Уходя со страницы — сбрасываем режим редактирования
  useEffect(() => {
    return () => setSelectedAppointment(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNewClient = clientId === NEW_CLIENT_OPTION;
  const selectedProcedure = procedures.find(
    (procedure) => procedure.id === procedureId
  );

  async function handleSave() {
    if (isSaving) {
      return;
    }

    if (!clientId) {
      window.alert("Выберите клиента");
      return;
    }

    if (isNewClient && (!newClientName.trim() || !newClientPhone.trim())) {
      window.alert("Укажите имя и телефон нового клиента");
      return;
    }

    if (!selectedProcedure) {
      window.alert("Выберите процедуру");
      return;
    }

    if (!date || !time) {
      window.alert("Укажите дату и время записи");
      return;
    }

    const conflict = getConflict(
      { date, time, duration: selectedProcedure.duration },
      selectedAppointment?.id
    );

    if (conflict) {
      const conflictClient = clients.find((c) => c.id === conflict.clientId);

      window.alert(
        `На это время уже есть запись: ${conflictClient?.name ?? "клиент"} — ${conflict.procedure} (${conflict.time})`
      );
      return;
    }

    setIsSaving(true);

    try {
      let finalClientId: string;

      if (isNewClient) {
        finalClientId = await withTimeout(
          addClient({
            name: newClientName,
            phone: newClientPhone,
            birthDate: "",

            allergies: "Нет",
            contraindications: "Нет",
            skin: "Не указано",

            lastVisit: "Новый клиент",

            bonus: 0,
            photo: "/images/default.jpg",
          }),
          15000
        );
      } else {
        finalClientId = clientId;
      }

      if (isEditing && selectedAppointment) {
        await withTimeout(
          updateAppointment({
            id: selectedAppointment.id,
            clientId: finalClientId,

            procedure: selectedProcedure.name,
            duration: selectedProcedure.duration,

            date,
            time,

            comment: comment.trim(),
          }),
          15000
        );
      } else {
        await withTimeout(
          addAppointment({
            clientId: finalClientId,

            procedure: selectedProcedure.name,
            duration: selectedProcedure.duration,

            date,
            time,

            comment: comment.trim(),
          }),
          15000
        );
      }

      navigate("/calendar");
    } catch (error) {
      console.error("Не удалось сохранить запись:", error);

      if (error instanceof Error && error.message === "timeout") {
        window.alert(
          "Сохранение затянулось дольше обычного. Возможно, запись всё же прошла — сейчас открою календарь, проверьте, появилась ли она."
        );
        navigate("/calendar");
      } else {
        window.alert(
          "Не получилось сохранить запись. Проверьте интернет-соединение и попробуйте ещё раз."
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MainLayout>
      <div className="appointment-page">
        <SectionCard title={isEditing ? "Редактирование записи" : "Основная информация"}>
          <div className="appointment-field">
            <label className="appointment-field__label">Клиент</label>

            <select
              className="appointment-field__select"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={isEditing}
            >
              <option value="" disabled>
                Выберите клиента
              </option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} · {client.phone}
                </option>
              ))}

              {!isEditing && (
                <option value={NEW_CLIENT_OPTION}>+ Новый клиент</option>
              )}
            </select>
          </div>

          {isNewClient && (
            <>
              <TextField
                label="Имя нового клиента"
                value={newClientName}
                onChange={setNewClientName}
              />

              <TextField
                label="Телефон"
                value={newClientPhone}
                onChange={setNewClientPhone}
              />
            </>
          )}

          <div className="appointment-field">
            <label className="appointment-field__label">Процедура</label>

            <select
              className="appointment-field__select"
              value={procedureId}
              onChange={(e) => setProcedureId(e.target.value)}
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

          <TextField
            label="Дата"
            type="date"
            value={date}
            onChange={setDate}
          />

          <TextField
            label="Время"
            type="time"
            value={time}
            onChange={setTime}
          />
        </SectionCard>

        <SectionCard title="Комментарий">
          <TextArea
            label="Комментарий косметолога"
            placeholder="Например: аллергия на лидокаин, уточнить перед процедурой"
            value={comment}
            onChange={setComment}
          />
        </SectionCard>

        <PrimaryButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Сохраняем..." : isEditing ? "Сохранить изменения" : "Сохранить запись"}
        </PrimaryButton>
      </div>
    </MainLayout>
  );
}

export default AppointmentPage;