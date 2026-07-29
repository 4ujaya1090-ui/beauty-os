import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";
import GlassCard from "../../../shared/components/GlassCard/GlassCard";

import { useClients } from "../../context/ClientContext";
import { useAppointments } from "../../../appointments/context/AppointmentContext";

import type { Client } from "../../context/ClientContext";

import "./ClientInfoPanel.css";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function getAge(birthDate: string) {
  const [day, month, year] = birthDate.split(".");

  const birth = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

function formatNextAppointment(isoDate: string, time: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year} • ${time}`;
}

type ClientInfoPanelProps = {
  client: Client;
};

function ClientInfoPanel({
  client,
}: ClientInfoPanelProps) {
  const navigate = useNavigate();

  const { updateClient } = useClients();
  const { appointments } = useAppointments();

  const [bonusAmount, setBonusAmount] = useState("");

  const now = new Date();

  const nextAppointment = appointments
    .filter(
      (appointment) =>
        appointment.clientId === client.id &&
        new Date(`${appointment.date}T${appointment.time}`) >= now
    )
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime()
    )[0];

  function handleBonusChange(sign: 1 | -1) {
    const amount = Number(bonusAmount);

    if (!amount || amount <= 0) {
      window.alert("Введите сумму бонусов");
      return;
    }

    const newBonus = Math.max(0, client.bonus + sign * amount);

    updateClient({ ...client, bonus: newBonus });
    setBonusAmount("");
  }

  return (
    <GlassCard>
      <div className="client-info">
        <div className="client-avatar">
          <img
            src={client.photo}
            alt={client.name}
            className="client-avatar__image"
          />
        </div>

        <h2 className="client-name">
          {client.name}
        </h2>

        <span className="client-vip">
          ★ VIP
        </span>

        <p className="client-phone">
          {client.phone}
        </p>

        <div className="client-stats">
          <div className="client-stat">
            <span>Возраст</span>
            <strong>{getAge(client.birthDate)} лет</strong>
          </div>

          <div className="client-stat">
            <span>Бонусы</span>
            <strong>{client.bonus}</strong>
          </div>
        </div>

        <div className="bonus-editor">
          <input
            type="number"
            className="bonus-editor__input"
            placeholder="Сумма"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(e.target.value)}
          />

          <button
            className="bonus-editor__button bonus-editor__button--add"
            onClick={() => handleBonusChange(1)}
          >
            + Начислить
          </button>

          <button
            className="bonus-editor__button bonus-editor__button--remove"
            onClick={() => handleBonusChange(-1)}
          >
            − Списать
          </button>
        </div>

        <div className="client-last">
          <span>Последняя процедура</span>
          <strong>{client.lastVisit}</strong>
        </div>

        <div className="client-next">
          <span>Следующая запись</span>
          <strong>
            {nextAppointment
              ? formatNextAppointment(nextAppointment.date, nextAppointment.time)
              : "Не назначена"}
          </strong>
        </div>

        <PrimaryButton
          onClick={() => navigate("/edit-client")}
        >
          ✏️ Редактировать клиента
        </PrimaryButton>
      </div>
    </GlassCard>
  );
}

export default ClientInfoPanel;