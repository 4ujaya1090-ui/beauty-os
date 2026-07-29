export type Client = {
  id: number;

  // Основная информация
  name: string;
  phone: string;
  birthDate: string;

  // Медицинская карта
  allergies: string;
  contraindications: string;
  skin: string;

  // История
  lastVisit: string;

  // Программа лояльности
  bonus: number;
photo: string;
};

export const clients: Client[] = [
  {
    id: 1,

    name: "Анна Иванова",
    phone: "+998 90 123-45-67",
    birthDate: "15.03.1990",

    allergies: "Лидокаин",
    contraindications: "Нет",

    skin: "Комбинированная",

    lastVisit: "18 июня",

    bonus: 1240,
    photo: "/images/anna.jpg",
  },

  {
    id: 2,

    name: "Мария Петрова",
    phone: "+998 90 777-11-22",
    birthDate: "22.08.1988",

    allergies: "Нет",
    contraindications: "Беременность",

    skin: "Сухая",

    lastVisit: "12 июня",

    bonus: 560,
    photo: "/images/maria.jpg",
  },
];