import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";

import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useClients } from "../../context/ClientContext";

import "./ClientsPage.css";

function ClientsPage() {
  const navigate = useNavigate();

  const {
    clients,
    setSelectedClient,
  } = useClients();

  const [search, setSearch] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search)
  );

  return (
    <MainLayout>
      

      <div className="clients-page">
        <SectionCard title="Поиск клиентов">
          <input
            className="client-search"
            placeholder="Поиск по имени или телефону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SectionCard>

        <PrimaryButton onClick={() => navigate("/new-client")}>
          + Новый клиент
        </PrimaryButton>

        <SectionCard title="База клиентов">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="client-item"
              onClick={() => {
                setSelectedClient(client);
                navigate("/client");
              }}
            >
              <div>
                <h3>{client.name}</h3>

                <p>{client.phone}</p>

                <small>Последний визит: {client.lastVisit}</small>
              </div>

              <span>→</span>
            </div>
          ))}
        </SectionCard>
      </div>
    </MainLayout>
  );
}

export default ClientsPage;