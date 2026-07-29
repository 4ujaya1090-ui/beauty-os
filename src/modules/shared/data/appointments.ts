export type Appointment = {
  id: number;
  clientId: number;

  procedure: string;

  date: string;

  time: string;

  duration: number;
};

export const appointments: Appointment[] = [
  {
    id: 1,
    clientId: 1,
    procedure: "Ультразвуковая чистка",
    date: "2026-07-13",
    time: "10:00",
    duration: 60,
  },

  {
    id: 2,
    clientId: 2,
    procedure: "Пилинг",
    date: "2026-07-13",
    time: "14:00",
    duration: 90,
  },
];