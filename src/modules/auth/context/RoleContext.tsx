import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { collection, query, where, onSnapshot } from "firebase/firestore";

import { db } from "../../../firebase/config";
import { useAuth } from "./AuthContext";

import type { Client } from "../../clients/context/ClientContext";

type RoleContextType = {
  loading: boolean;
  clientRecord: Client | null;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

type RoleProviderProps = {
  children: ReactNode;
};

export function RoleProvider({ children }: RoleProviderProps) {
  const { user } = useAuth();

  const [clientRecord, setClientRecord] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setClientRecord(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const clientsQuery = query(
      collection(db, "clients"),
      where("authUid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(clientsQuery, (snapshot) => {
      if (snapshot.empty) {
        setClientRecord(null);
      } else {
        const docSnap = snapshot.docs[0];
        setClientRecord({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Client, "id">),
        });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <RoleContext.Provider value={{ loading, clientRecord }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used inside RoleProvider");
  }

  return context;
}
