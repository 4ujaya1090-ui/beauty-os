import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import GlassCard from "../../components/GlassCard/GlassCard";
import StatCard from "../../components/StatCard/StatCard";
import QuickActions from "../../components/QuickActions/QuickActions";
import "./CosmetologistDashboard.css";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
function CosmetologistDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <Header userName="Лина" />

      <GlassCard>
  <h2 className="next-title">Следующая запись</h2>

  <p className="next-empty">
    Сегодня свободно.
  </p>

  <PrimaryButton>
  Открыть запись
</PrimaryButton>
</GlassCard>


      <section className="stats">
        <StatCard title="Сегодня" value="6" />
        <StatCard
  title="Клиенты"
  value="384"
  onClick={() => navigate("/clients")}
/>
        <StatCard title="Бонусы" value="1250" />
        <StatCard title="Статьи" value="25" />
    
      </section>
      <QuickActions />
    </>
  );
}

export default CosmetologistDashboard;