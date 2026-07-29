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
} from "firebase/firestore";

import { db } from "../../../firebase/config";

export type Procedure = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

type NewProcedure = Omit<Procedure, "id">;

type ProcedureContextType = {
  procedures: Procedure[];
  loading: boolean;
  addProcedure: (procedure: NewProcedure) => Promise<void>;
  updateProcedure: (procedure: Procedure) => Promise<void>;
  deleteProcedure: (id: string) => Promise<void>;
};

const ProcedureContext = createContext<ProcedureContextType | undefined>(
  undefined
);

type ProcedureProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "procedures";

export function ProcedureProvider({ children }: ProcedureProviderProps) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Procedure, "id">),
        }));

        setProcedures(items);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function addProcedure(procedure: NewProcedure) {
    await addDoc(collection(db, COLLECTION_NAME), procedure);
  }

  async function updateProcedure(procedure: Procedure) {
    const { id, ...rest } = procedure;
    await updateDoc(doc(db, COLLECTION_NAME, id), rest);
  }

  async function deleteProcedure(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }

  return (
    <ProcedureContext.Provider
      value={{
        procedures,
        loading,
        addProcedure,
        updateProcedure,
        deleteProcedure,
      }}
    >
      {children}
    </ProcedureContext.Provider>
  );
}

export function useProcedures() {
  const context = useContext(ProcedureContext);

  if (!context) {
    throw new Error("useProcedures must be used inside ProcedureProvider");
  }

  return context;
}
