import {
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

export type TelegramSubscription = {
  chatId: string;
  connected: boolean;
};

export async function getTelegramSubscription(
  clientId: string
): Promise<TelegramSubscription | null> {
  const subscriptionRef = doc(
    db,
    "telegramSubscriptions",
    clientId
  );

  const snapshot = await getDoc(subscriptionRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    chatId: String(data.chatId ?? ""),
    connected: data.connected === true,
  };
}

export async function disconnectTelegram(
  clientId: string
): Promise<void> {
  const subscriptionRef = doc(
    db,
    "telegramSubscriptions",
    clientId
  );

  await deleteDoc(subscriptionRef);
}