import MainLayout from "../../layouts/MainLayout/MainLayout";
import Header from "../../components/Header/Header";
import SectionCard from "../../components/SectionCard/SectionCard";
import TextField from "../../components/TextField/TextField";
import TextArea from "../../components/TextArea/TextArea";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

import "./NewClientPage.css";

function NewClientPage() {
  return (
    <MainLayout>

      <Header userName="Лина" />

      <div className="new-client-page">

        <SectionCard title="Новый клиент">

          <TextField
            label="Имя"
            placeholder="Введите имя"
          />

          <TextField
            label="Телефон"
            placeholder="+998"
          />

          <TextField
            label="Дата рождения"
            placeholder="10.07.1990"
          />

          <TextArea
            label="Особенности"
            placeholder="Аллергии, противопоказания..."
          />

          <PrimaryButton>
            Сохранить клиента
          </PrimaryButton>

        </SectionCard>

      </div>

    </MainLayout>
  );
}

export default NewClientPage;
