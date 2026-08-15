import {
  getBotUsername,
  getTelegramBotToken,
  getTelegramAdminChatId,
  publicAppBaseUrl,
} from '@/server/telegram';

export function tmaEntryUrl(baseUrl = publicAppBaseUrl()): string {
  return `${baseUrl.replace(/\/$/, '')}/tma`;
}

export function tmaDeepLink(
  invitationId?: string,
  guestName?: string,
  botUsername = getBotUsername()
): string {
  const user = botUsername.replace(/^@/, '');
  if (!invitationId) {
    return `https://t.me/${user}/app`;
  }
  const id = invitationId.replace(/^#/, '').toUpperCase().replace(/-/g, '_');
  const guest = guestName?.trim().replace(/\s+/g, '_') || '';
  const startapp = guest ? `${id}_${guest}` : id;
  return `https://t.me/${user}/app?startapp=${encodeURIComponent(startapp)}`;
}

export function botFatherMainAppHint(botUsername = getBotUsername()): string[] {
  const user = botUsername.replace(/^@/, '');
  const url = tmaEntryUrl();
  return [
    'BotFather → Mini Apps → Main App → Enable',
    `URL: ${url}`,
    `Short name: app`,
    `Natija: https://t.me/${user}/app`,
  ];
}

type TgApiResult = { ok?: boolean; description?: string; result?: unknown };

async function botApi(method: string, body: Record<string, unknown>): Promise<TgApiResult> {
  const token = getTelegramBotToken();
  if (!token) return { ok: false, description: 'TELEGRAM_BOT_TOKEN yo‘q' };

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await res.json()) as TgApiResult;
}

export interface TelegramSetupResult {
  success: boolean;
  steps: { name: string; ok: boolean; detail?: string }[];
  links: {
    appUrl: string;
    tmaUrl: string;
    miniAppOpen: string;
    botChat: string;
    webhook: string;
    botFatherHints: string[];
  };
  bot?: { username?: string; id?: number; firstName?: string };
  configured: {
    token: boolean;
    adminChat: boolean;
    httpsAppUrl: boolean;
  };
}

/** Bir martalik sozlash: webhook + buyruqlar + Menu Button (Mini App) + tavsif */
export async function setupTelegramBot(): Promise<TelegramSetupResult> {
  const appUrl = publicAppBaseUrl();
  const tmaUrl = tmaEntryUrl(appUrl);
  const botUser = getBotUsername().replace(/^@/, '');
  const webhook = `${appUrl}/api/telegram/webhook`;
  const steps: TelegramSetupResult['steps'] = [];
  const configured = {
    token: Boolean(getTelegramBotToken()),
    adminChat: Boolean(getTelegramAdminChatId()),
    httpsAppUrl: /^https:\/\//i.test(appUrl) && !/localhost|127\.0\.0\.1/i.test(appUrl),
  };

  const links = {
    appUrl,
    tmaUrl,
    miniAppOpen: tmaDeepLink(),
    botChat: `https://t.me/${botUser}`,
    webhook,
    botFatherHints: botFatherMainAppHint(botUser),
  };

  if (!configured.token) {
    return {
      success: false,
      steps: [{ name: 'token', ok: false, detail: 'TELEGRAM_BOT_TOKEN sozlanmagan' }],
      links,
      configured,
    };
  }

  if (!configured.httpsAppUrl) {
    steps.push({
      name: 'app_url',
      ok: false,
      detail: `APP_URL https bo‘lishi kerak. Hozir: ${appUrl}`,
    });
  }

  // 1) getMe
  const me = await botApi('getMe', {});
  let bot: TelegramSetupResult['bot'];
  if (me.ok && me.result && typeof me.result === 'object') {
    const r = me.result as { username?: string; id?: number; first_name?: string };
    bot = { username: r.username, id: r.id, firstName: r.first_name };
    steps.push({ name: 'getMe', ok: true, detail: `@${r.username}` });
  } else {
    steps.push({ name: 'getMe', ok: false, detail: me.description || 'Bot token noto‘g‘ri' });
    return { success: false, steps, links, bot, configured };
  }

  // 2) webhook
  if (configured.httpsAppUrl) {
    const wh = await botApi('setWebhook', {
      url: webhook,
      allowed_updates: ['message'],
      drop_pending_updates: false,
    });
    steps.push({
      name: 'setWebhook',
      ok: Boolean(wh.ok),
      detail: wh.ok ? webhook : wh.description,
    });
  }

  // 3) commands
  const cmds = await botApi('setMyCommands', {
    commands: [
      { command: 'start', description: 'Botni boshlash / taklifnomani ulash' },
      { command: 'id', description: 'Telegram Chat ID olish' },
      { command: 'activate', description: 'Admin: OT-XXXXX ni faollashtirish' },
    ],
  });
  steps.push({
    name: 'setMyCommands',
    ok: Boolean(cmds.ok),
    detail: cmds.ok ? '/start, /id, /activate' : cmds.description,
  });

  // 4) Menu Button → Mini App
  const menu = await botApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: 'Taklifnoma',
      web_app: { url: tmaUrl },
    },
  });
  steps.push({
    name: 'setChatMenuButton',
    ok: Boolean(menu.ok),
    detail: menu.ok ? tmaUrl : menu.description,
  });

  // 5) short description
  const short = await botApi('setMyShortDescription', {
    short_description: 'Onlayn taklifnoma yaratish va RSVP — Mini App orqali.',
  });
  steps.push({
    name: 'setMyShortDescription',
    ok: Boolean(short.ok),
    detail: short.ok ? 'OK' : short.description,
  });

  const long = await botApi('setMyDescription', {
    description:
      'Onlayn Taklifnoma — to‘y va tadbirlar uchun chiroyli onlayn taklifnoma.\n\n' +
      '• Mini App: pastdagi «Taklifnoma» tugmasi\n' +
      '• Mezbon: /start OT_XXXXX — Telegramga ulash\n' +
      '• Chat ID: /id\n' +
      '• Admin: /activate OT-XXXXX',
  });
  steps.push({
    name: 'setMyDescription',
    ok: Boolean(long.ok),
    detail: long.ok ? 'OK' : long.description,
  });

  const success =
    configured.httpsAppUrl && steps.filter((s) => s.name !== 'app_url').every((s) => s.ok);
  return {
    success,
    steps,
    links,
    bot,
    configured,
  };
}

export async function getTelegramSetupStatus(): Promise<{
  configured: TelegramSetupResult['configured'];
  links: TelegramSetupResult['links'];
  webhookInfo?: unknown;
  bot?: TelegramSetupResult['bot'];
}> {
  const appUrl = publicAppBaseUrl();
  const botUser = getBotUsername().replace(/^@/, '');
  const links = {
    appUrl,
    tmaUrl: tmaEntryUrl(appUrl),
    miniAppOpen: tmaDeepLink(),
    botChat: `https://t.me/${botUser}`,
    webhook: `${appUrl}/api/telegram/webhook`,
    botFatherHints: botFatherMainAppHint(botUser),
  };
  const configured = {
    token: Boolean(getTelegramBotToken()),
    adminChat: Boolean(getTelegramAdminChatId()),
    httpsAppUrl: /^https:\/\//i.test(appUrl) && !/localhost|127\.0\.0\.1/i.test(appUrl),
  };

  let bot: TelegramSetupResult['bot'];
  let webhookInfo: unknown;
  if (configured.token) {
    const me = await botApi('getMe', {});
    if (me.ok && me.result && typeof me.result === 'object') {
      const r = me.result as { username?: string; id?: number; first_name?: string };
      bot = { username: r.username, id: r.id, firstName: r.first_name };
    }
    const info = await botApi('getWebhookInfo', {});
    webhookInfo = info.result;
  }

  return { configured, links, webhookInfo, bot };
}
