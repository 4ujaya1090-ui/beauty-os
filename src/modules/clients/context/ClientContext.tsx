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

  // История
  lastVisit: string;

  // Программа лояльности
  bonus: number;
  photo: string;

  // Связь с логином клиента в Firebase Auth (если создан)
  authUid?: string;
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
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
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
  }, []);

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
