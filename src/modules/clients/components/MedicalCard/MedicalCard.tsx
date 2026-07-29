import { useEffect, useState } from "react";

import GlassCard from "../../../shared/components/GlassCard/GlassCard";
import TextArea from "../../../shared/components/TextArea/TextArea";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import type { Client } from "../../context/ClientContext";
import { useClients } from "../../context/ClientContext";

import "./MedicalCard.css";

type MedicalCardProps = {
  client: Client;
};

function MedicalCard({
  client,
}: MedicalCardProps) {
  const { updateClient } = useClients();

  const [allergies, setAllergies] = useState(client.allergies);
  const [contraindications, setContraindications] = useState(
    client.contraindications
  );
  const [skin, setSkin] = useState(client.skin);

  useEffect(() => {
    setAllergies(client.allergies);
    setContraindications(client.contraindications);
    setSkin(client.skin);
  }, [client]);

  function handleSave() {
    updateClient({
      ...client,
      allergies,
      contraindications,
      skin,
    });

    alert("Медицинская карта сохранена");
  }

  return (
    <GlassCard>
      <h2 className="medical-title">
        Медицинская карта
      </h2>

      <div className="medical-content">
        <TextArea
          label="Аллергии"
          value={allergies}
          onChange={setAllergies}
        />

        <TextArea
          label="Противопоказания"
          value={contraindications}
          onChange={setContraindications}
        />

        <TextArea
          label="Тип кожи"
          value={skin}
          onChange={setSkin}
        />

        <PrimaryButton onClick={handleSave}>
          💾 Сохранить
        </PrimaryButton>
      </div>
    </GlassCard>
  );
}

export default MedicalCard;