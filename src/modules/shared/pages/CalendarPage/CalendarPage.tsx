import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import Header from "../../components/Header/Header";
import Calendar from "../../components/Calendar/Calendar";

import "./CalendarPage.css";

function CalendarPage() {
  return (
    <MainLayout>

      <Header userName="Лина" />

      <div className="calendar-page">

        <Calendar />

      </div>

    </MainLayout>
  );
}

export default CalendarPage;