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

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { deleteApp } from "firebase/app";

import { db, createSecondaryApp } from "../../../firebase/config";
import { useProfile } from "../../auth/context/ProfileContext";

export type SkinDiagnosis = {
  visual: {
    blackheads: boolean;
    openComedones: boolean;
    milia: boolean;
    rosacea: boolean;
    hyperemia: boolean;
    damagedCapillaries: boolean;
    largePores: boolean;
    acneScars: boolean;
    ageSpots: boolean;
    nevi: boolean;
    papules: boolean;
    pustules: boolean;
    cysticAcne: boolean;
    dryness: boolean;
    dehydration: boolean;
    fineLines: boolean;
    freckles: boolean;
    hyperpigmentation: boolean;
    mimicWrinkles: boolean;
  };

  wrinkles: {
    fine: string;
    deep: string;
  };

  skinType:
    | "normal"
    | "dry"
    | "oily"
    | "combination"
    | "sensitive"
    | "";

  tone: "excellent" | "good" | "reduced" | "poor" | "";

  hydration: "low" | "medium" | "high" | "";

  circulation: "reduced" | "medium" | "good" | "";

  phototype: "I" | "II" | "III" | "IV" | "V" | "";
};

export type Client = {
  id: string;

  // Основная информация
  name: string;
  phone: string;
  birthDate: string;

  // Медицинская карта
  allergies: string;
  contraindications: string;
  skin: string;

    // Диагностика кожи
  skinDiagnosis?: SkinDiagnosis;

  // История
  lastVisit: string;

  // Программа лояльности
  bonus: number;
  photo: string;

  // Связь с логином клиента в Firebase Auth (если создан)
  authUid?: string;

  // Telegram
telegramChatId?: string;
telegramConnected?: boolean;
};

type NewClient = Omit<Client, "id">;

type ClientContextType = {
  clients: Client[];
  loading: boolean;
  selectedClient: Client | null;
  setSelectedClient: (client: Client) => void;
  addClient: (client: NewClient) => Promise<string>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  createClientLogin: (
    clientId: string,
    email: string,
    password: string
  ) => Promise<void>;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

type ClientProviderProps = {
  children: ReactNode;
};

const COLLECTION_NAME = "clients";

export function ClientProvider({ children }: ClientProviderProps) {
  const { profile, loading: profileLoading } = useProfile();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    if (!profile) {
      setClients([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Client, "id">),
        }));

        setClients(items);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [profile, profileLoading]);

  async function addClient(client: NewClient) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), client);
    return docRef.id;
  }

  async function updateClient(updatedClient: Client) {
    const { id, ...rest } = updatedClient;
    await updateDoc(doc(db, COLLECTION_NAME, id), rest);

    setSelectedClient(updatedClient);
  }

  async function deleteClient(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    setSelectedClient(null);
  }

  async function createClientLogin(
    clientId: string,
    email: string,
    password: string
  ) {
    // Создаём пользователя через ОТДЕЛЬНОЕ подключение к Firebase,
    // чтобы не потерять собственную сессию специалиста.
    const secondaryApp = createSecondaryApp();
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );

      const newUid = credential.user.uid;

      await signOut(secondaryAuth);

      await updateDoc(doc(db, COLLECTION_NAME, clientId), {
        authUid: newUid,
      });
    } finally {
      await deleteApp(secondaryApp);
    }
  }

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        selectedClient,
        setSelectedClient,
        addClient,
        updateClient,
        deleteClient,
        createClientLogin,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error("useClients must be used inside ClientProvider");
  }

  return context;
}
