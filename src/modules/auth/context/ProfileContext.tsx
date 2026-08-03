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

export type Profile = {
  name: string;
  specialization: string;
};

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  saveProfile: (profile: Profile) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

type ProfileProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "profiles";

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(doc(db, COLLECTION_NAME, user.uid), (snap) => {
      setProfile(snap.exists() ? (snap.data() as Profile) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  async function saveProfile(newProfile: Profile) {
    if (!user) {
      return;
    }

    await setDoc(doc(db, COLLECTION_NAME, user.uid), newProfile);
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }

  return context;
}