import MainLayout from "../../layouts/MainLayout/MainLayout";
import Header from "../../components/Header/Header";
import SectionCard from "../../components/SectionCard/SectionCard";
import MedicalCard from "../../components/MedicalCard/MedicalCard";
import "./ClientProfilePage.css";
import ClientInfoPanel from "../../components/ClientInfoPanel/ClientInfoPanel";
function ClientProfilePage() {
  return (
    <MainLayout>

      <Header userName="Лина" />

      <div className="client-profile">
<ClientInfoPanel />
       

        <MedicalCard />

        <SectionCard title="История процедур">

          <p>История пока отсутствует.</p>

        </SectionCard>

      </div>

    </MainLayout>
  );
}

export default ClientProfilePage;