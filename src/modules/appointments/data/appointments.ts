export type Appointment = {
  id: number;
  clientId: number;

  procedure: string;
  duration: number;

  date: string;
  time: string;

  comment?: string;
};

export const appointments: Appointment[] = [
  {
    id: 1,
    clientId: 1,
    procedure: "Ультразвуковая чистка",
    duration: 60,
    date: "2026-07-20",
    time: "10:00",
  },

  {
    id: 2,
    clientId: 2,
    procedure: "Пилинг",
    duration: 90,
    date: "2026-07-20",
    time: "14:00",
  },
];
