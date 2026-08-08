import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";

import SectionCard from "../../../shared/components/SectionCard/SectionCard";
import PrimaryButton from "../../../shared/components/PrimaryButton/PrimaryButton";

import { useClients } from "../../context/ClientContext";
import { useAppointments } from "../../../appointments/context/AppointmentContext";

import "./ClientsPage.css";

type FilterType =
  | "all"
  | "new"
  | "appointments"
  | "without"
  | "birthday";

function ClientsPage() {
  const navigate = useNavigate();

  const {
    clients,
    setSelectedClient,
  } = useClients();

  const { appointments } = useAppointments();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions: {
    value: FilterType;
    label: string;
  }[] = [
    { value: "all", label: "Все клиенты" },
    { value: "new", label: "Новые" },
    { value: "appointments", label: "С записью" },
    { value: "without", label: "Без записи" },
    { value: "birthday", label: "День рождения сегодня" },
  ];

  const selectedFilter = filterOptions.find(
    (option) => option.value === filter
  );

  const now = new Date();

  const filteredClients = clients.filter((client) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      client.name.toLowerCase().includes(searchValue) ||
      client.phone.includes(search);

    if (!matchesSearch) {
      return false;
    }

    if (filter === "all") {
      return true;
    }

    const clientAppointments = appointments.filter(
      (appointment) => appointment.clientId === client.id
    );

    const hasUpcomingAppointment = clientAppointments.some((appointment) => {
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.time}`
      );

      return appointmentDate >= now;
    });

    switch (filter) {
      case "new":
        return !client.lastVisit || client.lastVisit === "Новый клиент";

      case "appointments":
        return hasUpcomingAppointment;

      case "without":
        return !hasUpcomingAppointment;
case "birthday": {
  if (!client.birthDate) {
    return false;
  }

  const [day, month] = client.birthDate.split(".").map(Number);
  const today = new Date();

  return (
    day === today.getDate() &&
    month === today.getMonth() + 1
  );
}
      default:
        return true;
    }
  });

  function handleFilterSelect(value: FilterType) {
    setFilter(value);
    setIsFilterOpen(false);
  }

  return (
    <MainLayout
      topAction={
        <div className="clients-filter">
          <button
            type="button"
            className="clients-filter__button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <span>{selectedFilter?.label}</span>

            <span
              className={`clients-filter__arrow ${
                isFilterOpen ? "clients-filter__arrow--open" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {isFilterOpen && (
            <div className="clients-filter__menu">
              {filterOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={`clients-filter__option ${
                    option.value === filter
                      ? "clients-filter__option--active"
                      : ""
                  }`}
                  onClick={() => handleFilterSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      }
    >
      <div className="clients-page">
        <SectionCard title="Поиск клиентов">
          <input
            className="client-search"
            placeholder="Поиск по имени или телефону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SectionCard>

        <PrimaryButton onClick={() => navigate("/new-client")}>
          + Новый клиент
        </PrimaryButton>

        <SectionCard title="База клиентов">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="client-item"
              onClick={() => {
                setSelectedClient(client);
                navigate("/client");
              }}
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