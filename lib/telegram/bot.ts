import { Bot } from 'grammy';
import { getTelegramBotToken } from '@/server/telegram';

let botInstance: Bot | null = null;

export function getBot(): Bot | null {
  const token = getTelegramBotToken();
  if (!token) return null;
  if (!botInstance) {
    botInstance = new Bot(token);
  }
  return botInstance;
}

export { getTelegramBotToken };
