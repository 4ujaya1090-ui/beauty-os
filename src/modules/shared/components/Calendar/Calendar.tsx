import SectionCard from "../SectionCard/SectionCard";
import AppointmentCard from "../AppointmentCard/AppointmentCard";

import { appointments } from "../../data/appointments";
import { clients } from "../../../clients/data/clients";

import "./Calendar.css";

function Calendar() {
  return (
    <SectionCard title="Сегодня • 13 июля">

      <div className="calendar-grid">

        {appointments.map((appointment) => {
          const client = clients.find(
            (c) => c.id === appointment.clientId
          );

          return (
            <AppointmentCard
              key={appointment.id}
              time={appointment.time}
              title={client?.name ?? "Неизвестный клиент"}
              subtitle={appointment.procedure}
            />
          );
        })}

      </div>

    </SectionCard>
  );
}

export default Calendar;