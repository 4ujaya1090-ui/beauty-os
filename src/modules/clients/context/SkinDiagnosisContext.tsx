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
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../../../firebase/config";
import { useProfile } from "../../auth/context/ProfileContext";

import type { SkinDiagnosis } from "./ClientContext";

export type SkinDiagnosisRecord = {
  id: string;
  clientId: string;
  date: string;
  diagnosis: SkinDiagnosis;
};

type SkinDiagnosisContextType = {
  loading: boolean;
  getClientDiagnoses: (clientId: string) => SkinDiagnosisRecord[];
  addDiagnosis: (clientId: string, diagnosis: SkinDiagnosis) => Promise<void>;
  deleteDiagnosis: (id: string) => Promise<void>;
};

const SkinDiagnosisContext = createContext<
  SkinDiagnosisContextType | undefined
>(undefined);

type SkinDiagnosisProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "skinDiagnoses";

function toLocalIsoDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function SkinDiagnosisProvider({
  children,
}: SkinDiagnosisProviderProps) {
  const { profile, loading: profileLoading } = useProfile();

  const [diagnoses, setDiagnoses] = useState<SkinDiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    // Диагностика кожи — только для специалиста. Клиенту эти данные
    // не показываются нигде в интерфейсе, поэтому и не читаем их для него.
    if (!profile) {
      setDiagnoses([]);
      setLoading(false);
      return;
    }

    const diagnosesQuery = query(
      collection(db, COLLECTION_NAME),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      diagnosesQuery,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<SkinDiagnosisRecord, "id">),
        }));

        setDiagnoses(items);
        setLoading(false);
      },
      (error) => {
        console.error("Не удалось загрузить историю диагностик:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [profile, profileLoading]);

  function getClientDiagnoses(clientId: string) {
    return diagnoses.filter((diagnosis) => diagnosis.clientId === clientId);
  }

  async function addDiagnosis(clientId: string, diagnosis: SkinDiagnosis) {
    await addDoc(collection(db, COLLECTION_NAME), {
      clientId,
      date: toLocalIsoDate(new Date()),
      diagnosis,
    });
  }
    async function deleteDiagnosis(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }

  return (
    <SkinDiagnosisContext.Provider
           value={{
        loading,
        getClientDiagnoses,
        addDiagnosis,
        deleteDiagnosis,
      }}
    >
      {children}
    </SkinDiagnosisContext.Provider>
  );
}

export function useSkinDiagnoses() {
  const context = useContext(SkinDiagnosisContext);

  if (!context) {
    throw new Error(
      "useSkinDiagnoses must be used inside SkinDiagnosisProvider"
    );
  }

  return context;
}
