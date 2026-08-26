import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { db } from "../../../firebase/config";
import { useAuth } from "./AuthContext";

export type DaySchedule = {
  enabled: boolean;
  start: string;
  end: string;
};

export type WorkingHours = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

type ProfessionalSettings = {
  workingHours: WorkingHours;
};

type ProfessionalSettingsContextType = {
  settings: ProfessionalSettings | null;
  loading: boolean;
  saveWorkingHours: (workingHours: WorkingHours) => Promise<void>;
};

const ProfessionalSettingsContext = createContext<
  ProfessionalSettingsContextType | undefined
>(undefined);

type ProfessionalSettingsProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "professionalSettings";

const defaultWorkingHours: WorkingHours = {
  monday: {
    enabled: true,
    start: "09:00",
    end: "18:00",
  },
  tuesday: {
    enabled: true,
    start: "09:00",
    end: "18:00",
  },
  wednesday: {
    enabled: true,
    start: "09:00",
    end: "18:00",
  },
  thursday: {
    enabled: true,
    start: "09:00",
    end: "18:00",
  },
  friday: {
    enabled: true,
    start: "09:00",
    end: "18:00",
  },
  saturday: {
    enabled: false,
    start: "09:00",
    end: "18:00",
  },
  sunday: {
    enabled: false,
    start: "09:00",
    end: "18:00",
  },
};

export function ProfessionalSettingsProvider({
  children,
}: ProfessionalSettingsProviderProps) {
  const { user } = useAuth();

  const [settings, setSettings] =
    useState<ProfessionalSettings | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(db, COLLECTION_NAME, user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as ProfessionalSettings;

          setSettings({
            workingHours: {
              ...defaultWorkingHours,
              ...data.workingHours,
            },
          });
        } else {
          setSettings({
            workingHours: defaultWorkingHours,
          });
        }

        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  async function saveWorkingHours(workingHours: WorkingHours) {
    if (!user) {
      return;
    }

    await setDoc(
      doc(db, COLLECTION_NAME, user.uid),
      {
        workingHours,
      },
      { merge: true }
    );
  }

  return (
    <ProfessionalSettingsContext.Provider
      value={{
        settings,
        loading,
        saveWorkingHours,
      }}
    >
      {children}
    </ProfessionalSettingsContext.Provider>
  );
}

export function useProfessionalSettings() {
  const context = useContext(ProfessionalSettingsContext);

  if (!context) {
    throw new Error(
      "useProfessionalSettings must be used inside ProfessionalSettingsProvider"
    );
  }

  return context;
}