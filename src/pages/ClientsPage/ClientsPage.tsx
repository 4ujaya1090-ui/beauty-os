import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import Header from "../../components/Header/Header";
import SectionCard from "../../components/SectionCard/SectionCard";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useClients } from "../../context/ClientContext";
import "./ClientsPage.css";

function ClientsPage() {
  const navigate = useNavigate();
const { clients } = useClients();
  return (
    <MainLayout>
      <Header userName="Лина" />

      <div className="clients-page">

        <SectionCard title="Поиск клиентов">
          <input
            className="client-search"
            placeholder="Поиск по имени или телефону..."
          />
        </SectionCard>

       <PrimaryButton
  onClick={() => navigate("/new-client")}
>
  + Новый клиент
</PrimaryButton>

        <SectionCard title="База клиентов">

         {clients.map((client) => (

  <div
    key={client.id}
    className="client-item"
    onClick={() => navigate("/client")}
  >

    <div>

      <h3>{client.name}</h3>

      <p>{client.phone}</p>

      <small>
        Последний визит: {client.lastVisit}
      </small>

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