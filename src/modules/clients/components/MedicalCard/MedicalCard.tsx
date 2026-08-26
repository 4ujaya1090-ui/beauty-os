import { useEffect, useState } from "react";

import GlassCard from "../../../shared/components/GlassCard/GlassCard";
import TextArea from "../../../shared/components/TextArea/TextArea";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";
import Modal from "../../../shared/components/Modal/Modal";

import type {
  Client,
  SkinDiagnosis,
} from "../../context/ClientContext";
import { useClients } from "../../context/ClientContext";
import { useSkinDiagnoses } from "../../context/SkinDiagnosisContext";
import {
  useProfile,
  DEFAULT_MEDICAL_CARD_LABELS,
} from "../../../auth/context/ProfileContext";

import "./MedicalCard.css";

type MedicalCardProps = {
  client: Client;
};

const DEFAULT_DIAGNOSIS: SkinDiagnosis = {
  visual: {
    blackheads: false,
    openComedones: false,
    milia: false,
    rosacea: false,
    hyperemia: false,
    damagedCapillaries: false,
    largePores: false,
    acneScars: false,
    ageSpots: false,
    nevi: false,
    papules: false,
    pustules: false,
    cysticAcne: false,
    dryness: false,
    dehydration: false,
    fineLines: false,
    freckles: false,
    hyperpigmentation: false,
    mimicWrinkles: false,
  },

  wrinkles: {
    fine: "",
    deep: "",
  },

  skinType: "",
  tone: "",
  hydration: "",
  circulation: "",
  phototype: "",
};

const VISUAL_OPTIONS: Array<{
  key: keyof SkinDiagnosis["visual"];
  label: string;
}> = [
  { key: "blackheads", label: "Чёрные точки" },
  { key: "openComedones", label: "Открытые комедоны" },
  { key: "milia", label: "Милиумы" },
  { key: "rosacea", label: "Розацеа" },
  { key: "hyperemia", label: "Гиперемия" },
  { key: "damagedCapillaries", label: "Повреждённые капилляры" },
  { key: "largePores", label: "Расширенные поры" },
  { key: "acneScars", label: "Рубцы постакне" },
  { key: "ageSpots", label: "Возрастные пятна" },
  { key: "nevi", label: "Невусы" },
  { key: "papules", label: "Папулы" },
  { key: "pustules", label: "Пустулы" },
  { key: "cysticAcne", label: "Кистозные угри" },
  { key: "dryness", label: "Сухость" },
  { key: "dehydration", label: "Обезвоженность" },
  { key: "fineLines", label: "Мелкие линии" },
  { key: "freckles", label: "Веснушки" },
  { key: "hyperpigmentation", label: "Гиперпигментация" },
  { key: "mimicWrinkles", label: "Мимические морщины" },
];

const SKIN_TYPE_LABELS: Record<string, string> = {
  normal: "Нормальная",
  dry: "Сухая",
  oily: "Жирная",
  combination: "Комбинированная",
  sensitive: "Чувствительная",
};

const TONE_LABELS: Record<string, string> = {
  excellent: "Отличный",
  good: "Хороший",
  reduced: "Сниженный",
  poor: "Плохой",
};

const HYDRATION_LABELS: Record<string, string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
};

const CIRCULATION_LABELS: Record<string, string> = {
  reduced: "Сниженная",
  medium: "Средняя",
  good: "Хорошая",
};

function formatSummaryLine1(diagnosis: SkinDiagnosis) {
  const parts: string[] = [];

  if (diagnosis.skinType) {
    parts.push(SKIN_TYPE_LABELS[diagnosis.skinType]);
  }

  if (diagnosis.phototype) {
    parts.push(`Фототип ${diagnosis.phototype}`);
  }

  return parts.length > 0 ? parts.join(" · ") : "Диагностика ещё не проводилась";
}

function formatSummaryLine2(diagnosis: SkinDiagnosis) {
  const parts: string[] = [];

  if (diagnosis.tone) {
    parts.push(`Тонус: ${TONE_LABELS[diagnosis.tone].toLowerCase()}`);
  }

  if (diagnosis.hydration) {
    parts.push(
      `Влажность: ${HYDRATION_LABELS[diagnosis.hydration].toLowerCase()}`
    );
  }

  return parts.join(" · ");
}

function formatHistoryDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MedicalCard({ client }: MedicalCardProps) {
  const { updateClient } = useClients();
    const { getClientDiagnoses, addDiagnosis, deleteDiagnosis } = useSkinDiagnoses();
  const { profile } = useProfile();

  const diagnosisHistory = getClientDiagnoses(client.id);

  const labels = profile?.medicalCardLabels ?? DEFAULT_MEDICAL_CARD_LABELS;

  const [allergies, setAllergies] = useState(client.allergies);
  const [contraindications, setContraindications] = useState(
    client.contraindications
  );
  const [skin, setSkin] = useState(client.skin);

  const [diagnosis, setDiagnosis] = useState<SkinDiagnosis>(
    client.skinDiagnosis ?? DEFAULT_DIAGNOSIS
  );

  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setAllergies(client.allergies);
    setContraindications(client.contraindications);
    setSkin(client.skin);
    setDiagnosis(client.skinDiagnosis ?? DEFAULT_DIAGNOSIS);
  }, [client]);

  function updateVisual(key: keyof SkinDiagnosis["visual"], value: boolean) {
    setDiagnosis((current) => ({
      ...current,
      visual: {
        ...current.visual,
        [key]: value,
      },
    }));
  }

  async function handleSaveCard() {
    try {
      await updateClient({
        ...client,
        allergies,
        contraindications,
        skin,
      });

      alert("Карта сохранена");
    } catch (error) {
      console.error("Не удалось сохранить карту:", error);
      alert("Не получилось сохранить карту. Проверьте интернет-соединение.");
    }
  }

  async function handleSaveDiagnosis() {
    try {
      await updateClient({
        ...client,
        skinDiagnosis: diagnosis,
      });

      await addDiagnosis(client.id, diagnosis);

      setIsDiagnosisOpen(false);
      alert("Диагностика сохранена");
    } catch (error) {
      console.error("Не удалось сохранить диагностику:", error);
      alert(
        "Не получилось сохранить диагностику. Проверьте интернет-соединение."
      );
    }
  }

  function toggleHistoryItem(id: string) {
    setExpandedHistoryId((current) => (current === id ? null : id));
  }
  function handleDeleteDiagnosis(id: string) {
    if (!window.confirm("Удалить эту запись диагностики?")) {
      return;
    }

    deleteDiagnosis(id);
  }
  return (
    <GlassCard>
      <h2 className="medical-title">Карта клиента</h2>

      <div className="medical-content">
        <TextArea
          label={labels.field1}
          value={allergies}
          onChange={setAllergies}
        />

        <TextArea
          label={labels.field2}
          value={contraindications}
          onChange={setContraindications}
        />

        <TextArea label={labels.field3} value={skin} onChange={setSkin} />

        <PrimaryButton onClick={handleSaveCard}>
          Сохранить карту
        </PrimaryButton>

        <div className="diagnosis-summary">
          <div className="diagnosis-summary__header">
            <h3>Диагностика кожи</h3>
          </div>

          <p className="diagnosis-summary__line">
            {formatSummaryLine1(diagnosis)}
          </p>

          {formatSummaryLine2(diagnosis) && (
            <p className="diagnosis-summary__line diagnosis-summary__line--muted">
              {formatSummaryLine2(diagnosis)}
            </p>
          )}

          <button
            className="diagnosis-summary__open"
            onClick={() => setIsDiagnosisOpen(true)}
          >
            Открыть диагностику
          </button>
        </div>

        {diagnosisHistory.length > 0 && (
          <div className="diagnosis-history">
            <h3>История диагностик</h3>

            <div className="diagnosis-history__list">
              {diagnosisHistory.map((record) => {
                const isExpanded = expandedHistoryId === record.id;

                return (
                  <div
                    className="diagnosis-history__item"
                    key={record.id}
                  >
                                        <div className="diagnosis-history__row">
                      <button
                        className="diagnosis-history__row-toggle"
                        onClick={() => toggleHistoryItem(record.id)}
                      >
                        <div>
                          <strong>{formatHistoryDate(record.date)}</strong>

                          <span>{formatSummaryLine1(record.diagnosis)}</span>
                        </div>

                        <span className="diagnosis-history__chevron">
                          {isExpanded ? "︿" : "﹀"}
                        </span>
                      </button>

                      <button
                        className="diagnosis-history__delete"
                        onClick={() => handleDeleteDiagnosis(record.id)}
                      >
                        ✕
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="diagnosis-history__details">
                        <p>
                          <strong>Визуальная оценка: </strong>
                          {VISUAL_OPTIONS.filter(
                            (option) => record.diagnosis.visual[option.key]
                          )
                            .map((option) => option.label)
                            .join(", ") || "не отмечено"}
                        </p>

                        {(record.diagnosis.wrinkles.fine ||
                          record.diagnosis.wrinkles.deep) && (
                          <p>
                            <strong>Морщины: </strong>
                            {[
                              record.diagnosis.wrinkles.fine &&
                                `мелкие — ${record.diagnosis.wrinkles.fine}`,
                              record.diagnosis.wrinkles.deep &&
                                `глубокие — ${record.diagnosis.wrinkles.deep}`,
                            ]
                              .filter(Boolean)
                              .join("; ")}
                          </p>
                        )}

                        <p>
                          <strong>Тип кожи: </strong>
                          {record.diagnosis.skinType
                            ? SKIN_TYPE_LABELS[record.diagnosis.skinType]
                            : "не указан"}
                        </p>

                        <p>
                          <strong>Тонус: </strong>
                          {record.diagnosis.tone
                            ? TONE_LABELS[record.diagnosis.tone]
                            : "не указан"}
                        </p>

                        <p>
                          <strong>Влажность: </strong>
                          {record.diagnosis.hydration
                            ? HYDRATION_LABELS[record.diagnosis.hydration]
                            : "не указана"}
                        </p>

                        <p>
                          <strong>Циркуляция: </strong>
                          {record.diagnosis.circulation
                            ? CIRCULATION_LABELS[record.diagnosis.circulation]
                            : "не указана"}
                        </p>

                        <p>
                          <strong>Фототип: </strong>
                          {record.diagnosis.phototype || "не указан"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isDiagnosisOpen && (
        <Modal
          title="Диагностика кожи"
          onClose={() => setIsDiagnosisOpen(false)}
        >
          <div className="diagnosis">
            <p className="diagnosis__hint">
              Отметьте особенности, которые наблюдаются при осмотре.
            </p>

            <div className="diagnosis__section">
              <h4>Визуальная оценка</h4>

              <div className="diagnosis__checks">
                {VISUAL_OPTIONS.map((option) => (
                  <label className="diagnosis__check" key={option.key}>
                    <input
                      type="checkbox"
                      checked={diagnosis.visual[option.key]}
                      onChange={(event) =>
                        updateVisual(option.key, event.target.checked)
                      }
                    />

                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="diagnosis__section">
              <h4>Морщины</h4>

              <div className="diagnosis__fields">
                <TextArea
                  label="Мелкие / поверхностные"
                  value={diagnosis.wrinkles.fine}
                  onChange={(value) =>
                    setDiagnosis((current) => ({
                      ...current,
                      wrinkles: { ...current.wrinkles, fine: value },
                    }))
                  }
                />

                <TextArea
                  label="Глубокие"
                  value={diagnosis.wrinkles.deep}
                  onChange={(value) =>
                    setDiagnosis((current) => ({
                      ...current,
                      wrinkles: { ...current.wrinkles, deep: value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="diagnosis__section">
              <h4>Тип кожи</h4>

              <div className="diagnosis__options">
                {(
                  [
                    ["normal", "Нормальная"],
                    ["dry", "Сухая"],
                    ["oily", "Жирная"],
                    ["combination", "Комбинированная"],
                    ["sensitive", "Чувствительная"],
                  ] as const
                ).map(([value, label]) => (
                  <label className="diagnosis__option" key={value}>
                    <input
                      type="radio"
                      name="skinType"
                      checked={diagnosis.skinType === value}
                      onChange={() =>
                        setDiagnosis((current) => ({
                          ...current,
                          skinType: value,
                        }))
                      }
                    />

                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="diagnosis__grid">
              <div className="diagnosis__section">
                <h4>Тонус</h4>

                <select
                  value={diagnosis.tone}
                  onChange={(event) =>
                    setDiagnosis((current) => ({
                      ...current,
                      tone: event.target.value as SkinDiagnosis["tone"],
                    }))
                  }
                >
                  <option value="">Не указано</option>
                  <option value="excellent">Отличный</option>
                  <option value="good">Хороший</option>
                  <option value="reduced">Сниженный</option>
                  <option value="poor">Плохой</option>
                </select>
              </div>

              <div className="diagnosis__section">
                <h4>Влажность</h4>

                <select
                  value={diagnosis.hydration}
                  onChange={(event) =>
                    setDiagnosis((current) => ({
                      ...current,
                      hydration: event.target
                        .value as SkinDiagnosis["hydration"],
                    }))
                  }
                >
                  <option value="">Не указано</option>
                  <option value="low">Низкая</option>
                  <option value="medium">Средняя</option>
                  <option value="high">Высокая</option>
                </select>
              </div>

              <div className="diagnosis__section">
                <h4>Циркуляция</h4>

                <select
                  value={diagnosis.circulation}
                  onChange={(event) =>
                    setDiagnosis((current) => ({
                      ...current,
                      circulation: event.target
                        .value as SkinDiagnosis["circulation"],
                    }))
                  }
                >
                  <option value="">Не указано</option>
                  <option value="reduced">Сниженная</option>
                  <option value="medium">Средняя</option>
                  <option value="good">Хорошая</option>
                </select>
              </div>

              <div className="diagnosis__section">
                <h4>Фототип</h4>

                <select
                  value={diagnosis.phototype}
                  onChange={(event) =>
                    setDiagnosis((current) => ({
                      ...current,
                      phototype: event.target
                        .value as SkinDiagnosis["phototype"],
                    }))
                  }
                >
                  <option value="">Не указан</option>
                  <option value="I">I</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                </select>
              </div>
            </div>

            <PrimaryButton onClick={handleSaveDiagnosis}>
              Сохранить
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </GlassCard>
  );
}

export default MedicalCard;
