export type Article = {
  id: string;

  specialistId: string;

  title: string;

  content: string;

  category: string;

  image?: string;

  createdAt: string;

  updatedAt: string;

  published: boolean;

  source?: "beauty-os" | "telegram";

  telegramChatId?: string;

  telegramMessageId?: number;
};