import { doc, setDoc, Timestamp } from "firebase/firestore";

import { db } from "../../../firebase/config";

const TELEGRAM_BOT_USERNAME = "beauty_os_korolina_bot";

const TOKEN_LIFETIME_MS = 10 * 60 * 1000;

export async function createTelegramLink(
  clientId: string
) {
  const token = crypto.randomUUID();

  const expiresAt = Timestamp.fromDate(
    new Date(Date.now() + TOKEN_LIFETIME_MS)
  );

  await setDoc(
    doc(db, "telegramLinkTokens", token),
    {
      clientId,
      expiresAt,
      used: false,
    }
  );

  return `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${token}`;
}