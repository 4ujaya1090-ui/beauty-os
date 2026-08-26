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
  arrayUnion,
  arrayRemove,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

import { useProfile } from "../../auth/context/ProfileContext";
import { useRole } from "../../auth/context/RoleContext";

export type Appointment = {
  id: string;
  clientId: string;

  procedure: string;
  duration: number;

  date: string;
  time: string;

  comment?: string;
  photos?: string[];
};

type NewAppointment = Omit<Appointment, "id">;

type AppointmentContextType = {
  appointments: Appointment[];
  loading: boolean;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  addAppointment: (appointment: NewAppointment) => Promise<void>;
  updateAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addPhoto: (appointmentId: string, url: string) => Promise<void>;
  removePhoto: (appointmentId: string, url: string) => Promise<void>;
  getConflict: (
    candidate: { date: string; time: string; duration: number },
    excludeId?: string
  ) => Appointment | undefined;
};

const AppointmentContext = createContext<
  AppointmentContextType | undefined
>(undefined);

type AppointmentProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "appointments";

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function AppointmentProvider({
  children,
}: AppointmentProviderProps) {
  const { profile, loading: profileLoading } = useProfile();
  const { clientRecord, loading: roleLoading } = useRole();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (profileLoading || roleLoading) {
      setLoading(true);
      return;
    }

    // Специалист:
    // профиль существует, клиентской записи нет.
    if (profile && !clientRecord) {
      const unsubscribe = onSnapshot(
        collection(db, COLLECTION_NAME),
        (snapshot) => {
          const items = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Appointment, "id">),
          }));

          setAppointments(items);
          setLoading(false);
        },
        (error) => {
          console.error("Appointments listener error:", error);
          setAppointments([]);
          setLoading(false);
        }
      );

      return unsubscribe;
    }

    // Клиент:
    // читаем только его собственные записи.
    if (clientRecord) {
      const clientAppointmentsQuery = query(
        collection(db, COLLECTION_NAME),
        where("clientId", "==", clientRecord.id)
      );

      const unsubscribe = onSnapshot(
        clientAppointmentsQuery,
        (snapshot) => {
          const items = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Appointment, "id">),
          }));

          setAppointments(items);
          setLoading(false);
        },
        (error) => {
          console.error("Client appointments listener error:", error);
          setAppointments([]);
          setLoading(false);
        }
      );

      return unsubscribe;
    }

    // Посторонний аккаунт:
    // не специалист и не клиент.
    setAppointments([]);
    setLoading(false);

    return undefined;
  }, [
    profile,
    profileLoading,
    clientRecord,
    roleLoading,
  ]);

  async function addAppointment(appointment: NewAppointment) {
    await addDoc(collection(db, COLLECTION_NAME), appointment);
  }

  async function updateAppointment(updatedAppointment: Appointment) {
    const { id, ...rest } = updatedAppointment;

    await updateDoc(doc(db, COLLECTION_NAME, id), rest);
  }

  async function deleteAppointment(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }

  async function addPhoto(appointmentId: string, url: string) {
    await updateDoc(doc(db, COLLECTION_NAME, appointmentId), {
      photos: arrayUnion(url),
    });
  }

  async function removePhoto(appointmentId: string, url: string) {
    await updateDoc(doc(db, COLLECTION_NAME, appointmentId), {
      photos: arrayRemove(url),
    });
  }

  function getConflict(
    candidate: {
      date: string;
      time: string;
      duration: number;
    },
    excludeId?: string
  ) {
    const candidateStart = toMinutes(candidate.time);
    const candidateEnd = candidateStart + candidate.duration;

    return appointments.find((appointment) => {
      if (appointment.id === excludeId) {
        return false;
      }

      if (appointment.date !== candidate.date) {
        return false;
      }

      const start = toMinutes(appointment.time);
      const end = start + appointment.duration;

      return candidateStart < end && start < candidateEnd;
    });
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        selectedAppointment,
        setSelectedAppointment,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addPhoto,
        removePhoto,
        getConflict,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error(
      "useAppointments must be used inside AppointmentProvider"
    );
  }

  return context;
}