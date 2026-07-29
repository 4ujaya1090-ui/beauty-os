import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";

import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";
import Calendar from "../../components/Calendar/Calendar";

import "./CalendarPage.css";

function CalendarPage() {
  const navigate = useNavigate();

  return (
    <MainLayout>

      

      <div className="calendar-page">

        <PrimaryButton onClick={() => navigate("/appointment")}>
          + Новая запись
        </PrimaryButton>

        <Calendar />

      </div>

    </MainLayout>
  );
}

export default CalendarPage;