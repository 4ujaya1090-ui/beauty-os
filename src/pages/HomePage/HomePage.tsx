import MainLayout from "../../layouts/MainLayout/MainLayout";
import Header from "../../components/Header/Header";
import GlassCard from "../../components/GlassCard/GlassCard";
import "./HomePage.css";

function HomePage() {
  return (
    <MainLayout>
      <Header userName="Лина" />

      <GlassCard>
        <h2>Следующая запись</h2>

        <p>Записей пока нет</p>
      </GlassCard>
    </MainLayout>
  );
}

export default HomePage;