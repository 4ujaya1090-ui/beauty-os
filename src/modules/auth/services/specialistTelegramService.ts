import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

const TELEGRAM_BOT_USERNAME = "beauty_os_korolina_bot";

const TOKEN_LIFETIME_MS = 10 * 60 * 1000;

export async function createSpecialistTelegramLink(
  specialistId: string
) {
  const token = crypto.randomUUID();

  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + TOKEN_LIFETIME_MS)
  );

  await setDoc(
    doc(db, "telegramSpecialistLinkTokens", token),
    {
      specialistId,
      expiresAt,
      used: false,
    }
  );

  return `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${token}`;
}

export async function getSpecialistTelegramStatus(
  specialistId: string
) {
  const snapshot = await getDoc(
    doc(db, "specialistTelegram", specialistId)
  );

  if (!snapshot.exists()) {
    return {
      connected: false,
      notificationsEnabled: false,
    };
  }

  const data = snapshot.data();

  return {
    connected: data.connected === true,
    notificationsEnabled: data.notificationsEnabled !== false,
    chatId: data.chatId ?? null,
  };
}

export async function setSpecialistTelegramNotifications(
  specialistId: string,
  enabled: boolean
) {
  const existing = await getDoc(
    doc(db, "specialistTelegram", specialistId)
  );

  if (!existing.exists()) {
    throw new Error("Telegram ещё не подключён");
  }

  await setDoc(
    doc(db, "specialistTelegram", specialistId),
    {
      connected: true,
      notificationsEnabled: enabled,
    },
    {
      merge: true,
    }
  );
}