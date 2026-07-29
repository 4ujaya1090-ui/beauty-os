export type Procedure = {
  id: number;
  name: string;
  duration: number;
  price: number;
};

export const procedures: Procedure[] = [
  {
    id: 1,
    name: "Ультразвуковая чистка",
    duration: 60,
    price: 250000,
  },
  {
    id: 2,
    name: "PRX-пилинг",
    duration: 45,
    price: 400000,
  },
  {
    id: 3,
    name: "HydraFacial",
    duration: 90,
    price: 600000,
  },
];