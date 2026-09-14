import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getAuth,
  getIdToken,
} from "firebase/auth";

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

  source?: "booking" | "history";

  createdByUid?: string;
  specialistNotificationSent?: boolean;
};

type NewAppointment = Omit<Appointment, "id">;

type AppointmentContextType = {
  appointments: Appointment[];
  loading: boolean;
  selectedAppointment: Appointment | null;

  setSelectedAppointment: (
    appointment: Appointment | null
  ) => void;

  addAppointment: (
    appointment: NewAppointment
  ) => Promise<void>;

  updateAppointment: (
    appointment: Appointment
  ) => Promise<void>;

  deleteAppointment: (
    id: string
  ) => Promise<void>;

  addPhoto: (
    appointmentId: string,
    url: string
  ) => Promise<void>;

  removePhoto: (
    appointmentId: string,
    url: string
  ) => Promise<void>;

  getConflict: (
    candidate: {
      date: string;
      time: string;
      duration: number;
    },
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
  const [hours, minutes] =
    time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function AppointmentProvider({
  children,
}: AppointmentProviderProps) {
  const {
    profile,
    loading: profileLoading,
  } = useProfile();

  const {
    clientRecord,
    loading: roleLoading,
  } = useRole();

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState<Appointment | null>(null);

  useEffect(() => {
    if (
      profileLoading ||
      roleLoading
    ) {
      setLoading(true);
      return;
    }

    /*
     * ============================================================
     * SPECIALIST
     * ============================================================
     */

    if (
      profile &&
      !clientRecord
    ) {
      const unsubscribe =
        onSnapshot(
          collection(
            db,
            COLLECTION_NAME
          ),
          (snapshot) => {
            const items =
              snapshot.docs.map(
                (docSnap) => ({
                  id: docSnap.id,
                  ...(docSnap.data() as Omit<
                    Appointment,
                    "id"
                  >),
                })
              );

            setAppointments(items);
            setLoading(false);
          },
          (error) => {
            console.error(
              "Appointments listener error:",
              error
            );

            setAppointments([]);
            setLoading(false);
          }
        );

      return unsubscribe;
    }

    /*
     * ============================================================
     * CLIENT
     * ============================================================
     */

    if (clientRecord) {
      const clientAppointmentsQuery =
        query(
          collection(
            db,
            COLLECTION_NAME
          ),
          where(
            "clientId",
            "==",
            clientRecord.id
          )
        );

      const unsubscribe =
        onSnapshot(
          clientAppointmentsQuery,
          (snapshot) => {
            const items =
              snapshot.docs.map(
                (docSnap) => ({
                  id: docSnap.id,
                  ...(docSnap.data() as Omit<
                    Appointment,
                    "id"
                  >),
                })
              );

            setAppointments(items);
            setLoading(false);
          },
          (error) => {
            console.error(
              "Client appointments listener error:",
              error
            );

            setAppointments([]);
            setLoading(false);
          }
        );

      return unsubscribe;
    }

    /*
     * ============================================================
     * UNKNOWN ACCOUNT
     * ============================================================
     */

    setAppointments([]);
    setLoading(false);

    return undefined;
  }, [
    profile,
    profileLoading,
    clientRecord,
    roleLoading,
  ]);

  /*
   * ============================================================
   * ADD APPOINTMENT
   * ============================================================
   */

  async function addAppointment(
    appointment: NewAppointment
  ) {
    const auth = getAuth();
    const currentUser =
      auth.currentUser;

    /*
     * Клиент создаёт обычную запись.
     *
     * Даже если страница бронирования не передала
     * source, мы сами считаем её booking.
     *
     * История source === "history" не трогаем.
     */

    const isClientBooking =
      currentUser !== null &&
      clientRecord !== null &&
      appointment.source !== "history";

    const appointmentData =
      isClientBooking
        ? {
            ...appointment,

            source: "booking" as const,

            createdByUid:
              currentUser.uid,

            specialistNotificationSent:
              false,
          }
        : appointment;

    /*
     * Сначала обязательно сохраняем запись.
     */

    const appointmentRef =
      await addDoc(
        collection(
          db,
          COLLECTION_NAME
        ),
        appointmentData
      );

    /*
     * Исторические записи и записи,
     * созданные специалистом, уведомление
     * косметологу не отправляют.
     */

    if (
      !isClientBooking ||
      !currentUser ||
      !clientRecord
    ) {
      return;
    }

    /*
     * ============================================================
     * SPECIALIST TELEGRAM NOTIFICATION
     * ============================================================
     */

    try {
      const idToken =
        await getIdToken(
          currentUser
        );

      const response =
        await fetch(
          "https://beauty-os-telegram.4ujaya1090.workers.dev/notify-specialist",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${idToken}`,
            },

            body: JSON.stringify({
              appointmentId:
                appointmentRef.id,

              clientName:
                clientRecord.name,
            }),
          }
        );

      /*
       * Теперь мы НЕ прячем HTTP-ошибки.
       * Если Worker ответит 404/401/500,
       * это будет видно в Console.
       */

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Specialist Telegram notification failed:",
          response.status,
          errorText
        );

        return;
      }

      console.log(
        "Specialist Telegram notification request sent:",
        appointmentRef.id
      );
    } catch (error) {
      /*
       * Ошибка Telegram не должна
       * отменять уже созданную запись.
       */

      console.error(
        "Specialist Telegram notification error:",
        error
      );
    }
  }

  /*
   * ============================================================
   * UPDATE APPOINTMENT
   * ============================================================
   */

  async function updateAppointment(
    updatedAppointment: Appointment
  ) {
    const {
      id,
      ...rest
    } = updatedAppointment;

    await updateDoc(
      doc(
        db,
        COLLECTION_NAME,
        id
      ),
      rest
    );
  }

  /*
   * ============================================================
   * DELETE APPOINTMENT
   * ============================================================
   */

  async function deleteAppointment(
    id: string
  ) {
    await deleteDoc(
      doc(
        db,
        COLLECTION_NAME,
        id
      )
    );
  }

  /*
   * ============================================================
   * ADD PHOTO
   * ============================================================
   */

  async function addPhoto(
    appointmentId: string,
    url: string
  ) {
    await updateDoc(
      doc(
        db,
        COLLECTION_NAME,
        appointmentId
      ),
      {
        photos:
          arrayUnion(url),
      }
    );
  }

  /*
   * ============================================================
   * REMOVE PHOTO
   * ============================================================
   */

  async function removePhoto(
    appointmentId: string,
    url: string
  ) {
    await updateDoc(
      doc(
        db,
        COLLECTION_NAME,
        appointmentId
      ),
      {
        photos:
          arrayRemove(url),
      }
    );
  }

  /*
   * ============================================================
   * CONFLICT CHECK
   * ============================================================
   */

  function getConflict(
    candidate: {
      date: string;
      time: string;
      duration: number;
    },
    excludeId?: string
  ) {
    const candidateStart =
      toMinutes(
        candidate.time
      );

    const candidateEnd =
      candidateStart +
      candidate.duration;

    return appointments.find(
      (appointment) => {
        if (
          appointment.id ===
          excludeId
        ) {
          return false;
        }

        /*
         * Исторические записи
         * не занимают время.
         */

        if (
          appointment.source ===
          "history"
        ) {
          return false;
        }

        if (!appointment.time) {
          return false;
        }

        if (
          appointment.date !==
          candidate.date
        ) {
          return false;
        }

        const start =
          toMinutes(
            appointment.time
          );

        const end =
          start +
          appointment.duration;

        return (
          candidateStart < end &&
          start < candidateEnd
        );
      }
    );
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
  const context =
    useContext(
      AppointmentContext
    );

  if (!context) {
    throw new Error(
      "useAppointments must be used inside AppointmentProvider"
    );
  }

  return context;
}