import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";

import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import ClientForm from "../../components/ClientForm/ClientForm";

import { useClients } from "../../context/ClientContext";

import "./NewClientPage.css";

import BackButton from "../../../shared/components/BackButton/BackButton";
function NewClientPage() {
  const navigate = useNavigate();

  const { addClient } = useClients();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  function handleSave() {
    addClient({
      name,
      phone,
      birthDate,

      allergies: "Нет",
      contraindications: "Нет",
      skin: "Не указано",

      lastVisit: "Новый клиент",
      bonus: 0,
      photo: "/images/default.jpg",
    });

    navigate("/clients");
  }

  return (
    <MainLayout>

    

      <div className="new-client-page">
<BackButton />
        <SectionCard title="Новый клиент">

          <ClientForm
            name={name}
            phone={phone}
            birthDate={birthDate}
            setName={setName}
            setPhone={setPhone}
            setBirthDate={setBirthDate}
            buttonText="Сохранить клиента"
            onSubmit={handleSave}
          />

        </SectionCard>

      </div>

    </MainLayout>
  );
}

export default NewClientPage;