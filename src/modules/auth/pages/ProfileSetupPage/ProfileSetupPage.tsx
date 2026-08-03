import { useState } from "react";

import GlassCard from "../../../shared/components/GlassCard/GlassCard";
import TextField from "../../../shared/components/TextField/TextField";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useProfile } from "../../context/ProfileContext";

import "./ProfileSetupPage.css";

function ProfileSetupPage() {
  const { saveProfile } = useProfile();

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!name.trim() || !specialization.trim()) {
      window.alert("Заполните оба поля");
      return;
    }

    setIsSaving(true);

    try {
      await saveProfile({
        name: name.trim(),
        specialization: specialization.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="profile-setup-page">
      <GlassCard>
        <div className="profile-setup-card">
          <h1 className="profile-setup-title">Beauty OS</h1>
          <p className="profile-setup-subtitle">
            Расскажите немного о себе — это увидят ваши клиенты
          </p>

          <TextField
            label="Как вас зовут"
            value={name}
            onChange={setName}
          />

          <TextField
            label="Направление деятельности"
            placeholder="Например: косметолог, массажист, барбер"
            value={specialization}
            onChange={setSpecialization}
          />

          <PrimaryButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Сохраняем..." : "Продолжить"}
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}

export default ProfileSetupPage;