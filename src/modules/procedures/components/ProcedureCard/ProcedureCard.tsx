import { useState } from "react";

import GlassCard from "../../../shared/components/GlassCard/GlassCard";

import type { Procedure } from "../../context/ProcedureContext";

import "./ProcedureCard.css";

type ProcedureCardProps = {
  procedure: Procedure;
  onUpdate: (procedure: Procedure) => void;
  onDelete: (id: string) => void;
};

function ProcedureCard({
  procedure,
  onUpdate,
  onDelete,
}: ProcedureCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(procedure.name);
  const [duration, setDuration] = useState(String(procedure.duration));
  const [price, setPrice] = useState(String(procedure.price));

  function handleSave() {
    if (!name.trim() || !duration || !price) {
      window.alert("Заполните все поля");
      return;
    }

    onUpdate({
      ...procedure,
      name: name.trim(),
      duration: Number(duration),
      price: Number(price),
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setName(procedure.name);
    setDuration(String(procedure.duration));
    setPrice(String(procedure.price));
    setIsEditing(false);
  }

  function handleDelete() {
    if (!window.confirm(`Удалить процедуру «${procedure.name}»?`)) {
      return;
    }

    onDelete(procedure.id);
  }

  if (isEditing) {
    return (
      <GlassCard>
        <div className="procedure-card__edit">
          <input
            className="procedure-card__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название"
          />

          <input
            className="procedure-card__input"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Длительность, мин"
          />

          <input
            className="procedure-card__input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена, сум"
          />

          <div className="procedure-card__actions">
            <button
              className="procedure-card__action procedure-card__action--save"
              onClick={handleSave}
            >
              Сохранить
            </button>

            <button
              className="procedure-card__action"
              onClick={handleCancel}
            >
              Отмена
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="procedure-card__buttons">
        <button
          className="procedure-card__icon"
          onClick={() => setIsEditing(true)}
        >
          ✎
        </button>

        <button
          className="procedure-card__icon"
          onClick={handleDelete}
        >
          ✕
        </button>
      </div>

      <h3>{procedure.name}</h3>

      <p>{procedure.duration} мин.</p>

      <strong>{procedure.price.toLocaleString()} сум</strong>
    </GlassCard>
  );
}

export default ProcedureCard;
