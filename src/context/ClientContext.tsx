import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { clients as initialClients, type Client } from "../data/clients";

type ClientContextType = {
  clients: Client[];
  addClient: (client: Client) => void;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

type ClientProviderProps = {
  children: ReactNode;
};

export function ClientProvider({ children }: ClientProviderProps) {
  const [clients, setClients] = useState(initialClients);

  function addClient(client: Client) {
    setClients((prev) => [...prev, client]);
  }

  return (
    <ClientContext.Provider value={{ clients, addClient }}>
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