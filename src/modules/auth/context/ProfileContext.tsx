import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "../../../firebase/config";
import { useAuth } from "./AuthContext";

export type WorkingDay = {
  enabled: boolean;
  start: string;
  end: string;
};

export type WorkingHours = {
  monday: WorkingDay;
  tuesday: WorkingDay;
  wednesday: WorkingDay;
  thursday: WorkingDay;
  friday: WorkingDay;
  saturday: WorkingDay;
  sunday: WorkingDay;
};

export const DEFAULT_WORKING_HOURS: WorkingHours = {
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
    start: "",
    end: "",
  },

  sunday: {
    enabled: false,
    start: "",
    end: "",
  },
};

export type MedicalCardLabels = {
  field1: string;
  field2: string;
  field3: string;
};

export const DEFAULT_MEDICAL_CARD_LABELS: MedicalCardLabels = {
  field1: "Аллергии",
  field2: "Противопоказания",
  field3: "Тип кожи",
};

export type Profile = {
  name: string;
  specialization: string;
  workingHours?: WorkingHours;
  medicalCardLabels?: MedicalCardLabels;
};

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  saveProfile: (profile: Profile) => Promise<void>;
};

const ProfileContext =
  createContext<ProfileContextType | undefined>(
    undefined
  );

type ProfileProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "profiles";

export function ProfileProvider({
  children,
}: ProfileProviderProps) {
  const { user } = useAuth();

  const [
    profile,
    setProfile,
  ] = useState<Profile | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe =
      onSnapshot(
        doc(
          db,
          COLLECTION_NAME,
          user.uid
        ),
        (snap) => {
          setProfile(
            snap.exists()
              ? (snap.data() as Profile)
              : null
          );

          setLoading(false);
        }
      );

    return unsubscribe;
  }, [user]);

  async function saveProfile(
    newProfile: Profile
  ) {
    if (!user) {
      return;
    }

    await setDoc(
      doc(
        db,
        COLLECTION_NAME,
        user.uid
      ),
      newProfile
    );
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        saveProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context =
    useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside ProfileProvider"
    );
  }

  return context;
}


/*
 * ============================================================
 * SPECIALIST PROFILE
 * ============================================================
 *
 * Клиент должен получать профиль именно нашего специалиста,
 * а не случайный первый документ из коллекции profiles.
 *
 * UID специалиста:
 * AqyIZR3J1HUmhnD3jMMW8Y7RXRj2
 *
 * ============================================================
 */

export function useSpecialistProfile() {
  const [
    specialistProfile,
    setSpecialistProfile,
  ] = useState<Profile | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const specialistRef =
      doc(
        db,
        COLLECTION_NAME,
        "AqyIZR3J1HUmhnD3jMMW8Y7RXRj2"
      );

    const unsubscribe =
      onSnapshot(
        specialistRef,
        (snapshot) => {
          setSpecialistProfile(
            snapshot.exists()
              ? (snapshot.data() as Profile)
              : null
          );

          setLoading(false);
        },
        (error) => {
          console.error(
            "Не удалось загрузить профиль специалиста:",
            error
          );

          setSpecialistProfile(null);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  return {
    specialistProfile,
    loading,
  };
}