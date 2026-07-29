import { useState } from "react";
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

function AppointmentPage() {
  const navigate = useNavigate();

  const { clients, addClient } = useClients();
  const { addAppointment } = useAppointments();
  const { procedures } = useProcedures();

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

  const isNewClient = clientId === NEW_CLIENT_OPTION;
  const selectedProcedure = procedures.find(
    (procedure) => procedure.id === procedureId
  );

  async function handleSave() {
   if (isSaving) return;
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

    setIsSaving(true);

    try {
      let finalClientId: string;
  
      if (isNewClient) {
        finalClientId = await addClient({
          name: newClientName,
          phone: newClientPhone,
          birthDate: "",

          allergies: "Нет",
          contraindications: "Нет",
          skin: "Не указано",

          lastVisit: "Новый клиент",

          bonus: 0,
          photo: "/images/default.jpg",
        });
      } else {
        finalClientId = clientId;
      }

      await addAppointment({
        clientId: finalClientId,

        procedure: selectedProcedure.name,
        duration: selectedProcedure.duration,

        date,
        time,

        comment: comment.trim() || undefined,
      });

      navigate("/calendar");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MainLayout>
      <div className="appointment-page">
        <SectionCard title="Основная информация">
          <div className="appointment-field">
            <label className="appointment-field__label">Клиент</label>

            <select
              className="appointment-field__select"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="" disabled>
                Выберите клиента
              </option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} · {client.phone}
                </option>
              ))}

              <option value={NEW_CLIENT_OPTION}>+ Новый клиент</option>
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

        <PrimaryButton
  onClick={handleSave}
  disabled={isSaving}
>
  {isSaving ? "Сохраняем..." : "Сохранить"}
</PrimaryButton>
      </div>
    </MainLayout>
  );
}

export default AppointmentPage;
