import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";


import SectionCard from "../../../shared/components/SectionCard/SectionCard";

import ClientForm from "../../components/ClientForm/ClientForm";
import { useClients } from "../../context/ClientContext";

function EditClientPage() {
  const navigate = useNavigate();

  const {
    selectedClient,
    updateClient,
  } = useClients();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    if (!selectedClient) return;

    setName(selectedClient.name);
    setPhone(selectedClient.phone);
    setBirthDate(selectedClient.birthDate);
  }, [selectedClient]);

  if (!selectedClient) {
    return null;
  }

  const client = selectedClient;

  function handleSave() {
    updateClient({
      ...client,
      name,
      phone,
      birthDate,
    });

    navigate("/client");
  }

  return (
    <MainLayout>
      

      <SectionCard title="Редактирование клиента">
        <ClientForm
          name={name}
          phone={phone}
          birthDate={birthDate}
          setName={setName}
          setPhone={setPhone}
          setBirthDate={setBirthDate}
          buttonText="💾 Сохранить"
          onSubmit={handleSave}
        />
      </SectionCard>
    </MainLayout>
  );
}

export default EditClientPage;