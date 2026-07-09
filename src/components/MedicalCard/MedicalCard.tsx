import "./MedicalCard.css";

import GlassCard from "../GlassCard/GlassCard";
import TextArea from "../TextArea/TextArea";

function MedicalCard() {
  return (
    <GlassCard>

      <h2 className="medical-title">
        Медицинская карта
      </h2>

      <div className="medical-content">

        <TextArea
          label="Аллергии"
          placeholder="Опишите аллергические реакции..."
        />

        <TextArea
          label="Противопоказания"
          placeholder="Например: беременность, онкология..."
        />

        <TextArea
          label="Особенности кожи"
          placeholder="Чувствительность, купероз, акне..."
        />

      </div>

    </GlassCard>
  );
}

export default MedicalCard;