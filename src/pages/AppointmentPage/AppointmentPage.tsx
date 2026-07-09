import MainLayout from "../../layouts/MainLayout/MainLayout";
import Header from "../../components/Header/Header";
import SectionCard from "../../components/SectionCard/SectionCard";

import "./AppointmentPage.css";

function AppointmentPage() {
  return (
    <MainLayout>
      <Header userName="Лина" />

      <div className="appointment-page">

        <SectionCard title="Основная информация">
          <p>Здесь будут поля записи клиента.</p>
        </SectionCard>

        <SectionCard title="Комментарий">
          <p>Здесь будет комментарий косметолога.</p>
        </SectionCard>

      </div>

    </MainLayout>
  );
}

export default AppointmentPage;