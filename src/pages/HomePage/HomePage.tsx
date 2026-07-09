import MainLayout from "../../layouts/MainLayout/MainLayout";
import CosmetologistDashboard from "../../modules/Dashboard/CosmetologistDashboard";

function HomePage() {
  return (
    <MainLayout>
      <CosmetologistDashboard />
    </MainLayout>
  );
}

export default HomePage;