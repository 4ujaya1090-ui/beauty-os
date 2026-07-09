export type Client = {
  id: number;
  name: string;
  phone: string;
  birthDate: string;
  features: string;
  skin: string;
  lastVisit: string;
};

export const clients: Client[] = [
  {
    id: 1,
    name: "Анна Иванова",
    phone: "+998 90 123-45-67",
    birthDate: "15.03.1990",
    features: "Аллергия на лидокаин",
    skin: "Комбинированная",
    lastVisit: "18 июня",
  },
  {
    id: 2,
    name: "Мария Петрова",
    phone: "+998 90 777-11-22",
    birthDate: "22.08.1988",
    features: "Нет",
    skin: "Сухая",
    lastVisit: "12 июня",
  },
];