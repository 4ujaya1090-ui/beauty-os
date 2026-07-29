import { useState } from "react";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";
import ProcedureCard from "../../components/ProcedureCard/ProcedureCard";

import { useProcedures } from "../../context/ProcedureContext";

import "./ProceduresPage.css";

function ProceduresPage() {
  const { procedures, loading, addProcedure, updateProcedure, deleteProcedure } =
    useProcedures();

  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  function handleAdd() {
    if (!name.trim() || !duration || !price) {
      window.alert("Заполните все поля");
      return;
    }

    addProcedure({
      name: name.trim(),
      duration: Number(duration),
      price: Number(price),
    });

    setName("");
    setDuration("");
    setPrice("");
    setIsAdding(false);
  }

  return (
    <MainLayout>
      <div className="procedures-page">
        {isAdding ? (
          <SectionCard title="Новая процедура">
            <div className="procedures-page__form">
              <input
                className="procedures-page__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название"
              />

              <input
                className="procedures-page__input"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Длительность, мин"
              />

              <input
                className="procedures-page__input"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Цена, сум"
              />

              <div className="procedures-page__form-actions">
                <PrimaryButton onClick={handleAdd}>Сохранить</PrimaryButton>

                <button
                  className="procedures-page__cancel"
                  onClick={() => setIsAdding(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </SectionCard>
        ) : (
          <PrimaryButton onClick={() => setIsAdding(true)}>
            + Новая процедура
          </PrimaryButton>
        )}

        {loading && <p>Загрузка...</p>}

        {!loading && procedures.length === 0 && (
          <p>Процедур пока нет — добавьте первую.</p>
        )}

        {procedures.map((procedure) => (
          <ProcedureCard
            key={procedure.id}
            procedure={procedure}
            onUpdate={updateProcedure}
            onDelete={deleteProcedure}
          />
        ))}
      </div>
    </MainLayout>
  );
}

export default ProceduresPage;
