import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

export type Appointment = {
  id: string;
  clientId: string;

  procedure: string;
  duration: number;

  date: string;
  time: string;

  comment?: string;
};

type NewAppointment = Omit<Appointment, "id">;

type AppointmentContextType = {
  appointments: Appointment[];
  loading: boolean;
  addAppointment: (appointment: NewAppointment) => Promise<void>;
  updateAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

type AppointmentProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "appointments";

export function AppointmentProvider({ children }: AppointmentProviderProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Appointment, "id">),
        }));

        setAppointments(items);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function addAppointment(appointment: NewAppointment) {
  const appointmentsRef = collection(db, COLLECTION_NAME);

  const q = query(
    appointmentsRef,
    where("date", "==", appointment.date),
    where("time", "==", appointment.time)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error("На это время уже есть запись.");
  }

  await addDoc(appointmentsRef, appointment);
}
  async function updateAppointment(updatedAppointment: Appointment) {
    const { id, ...rest } = updatedAppointment;
    await updateDoc(doc(db, COLLECTION_NAME, id), rest);
  }

  async function deleteAppointment(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error("useAppointments must be used inside AppointmentProvider");
  }

  return context;
}
