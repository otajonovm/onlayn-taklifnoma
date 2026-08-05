import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import crypto from 'crypto';
import { WEDDING_TEMPLATES } from '../config/weddingTemplates';
import type { Invitation, Rsvp } from '../types';
import {
  loadInvitationsFromDisk,
  persistInvitationsToDisk,
  describePersistence,
} from './invitationStore';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'taklifnoma2026';

type GlobalStore = {
  __otInvitations?: Map<string, Invitation>;
  __otAdminTokens?: Set<string>;
  __otSeeded?: boolean;
};

function store(): GlobalStore {
  return globalThis as unknown as GlobalStore;
}

function invitationsDb(): Map<string, Invitation> {
  const g = store();
  if (!g.__otInvitations) {
    g.__otInvitations = loadInvitationsFromDisk();
  }
  return g.__otInvitations;
}

function saveInvitations(): void {
  persistInvitationsToDisk(invitationsDb());
}

function adminTokens(): Set<string> {
  const g = store();
  if (!g.__otAdminTokens) g.__otAdminTokens = new Set();
  return g.__otAdminTokens;
}

function seedDemoData() {
  const g = store();
  if (g.__otSeeded) return;
  g.__otSeeded = true;
  const db = invitationsDb();

  // Keep previously saved invitations; only seed when empty
  if (db.size > 0) return;

  const sample1: Invitation = {
    id: 'OT-84920',
    templateId: 'WD-101',
    status: 'PENDING',
    hostName: 'Alisher va Nigora',
    brideName: 'Nigora',
    groomName: 'Alisher',
    eventTitle: "Nikoh To'yi Marosimi",
    eventType: "Nikoh To'yi",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    venueName: 'Versal Tantanalar Saroyi',
    locationAddress: "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 102",
    yandexUrl: 'https://yandex.uz/maps/10335/tashkent/?ll=69.281111%2C41.332222&z=16',
    googleUrl: 'https://maps.google.com/?q=Tashkent',
    twoGisUrl: 'https://2gis.uz/tashkent',
    audioUrl:
      WEDDING_TEMPLATES['WD-101'].media.audioUrl,
    audioTitle: WEDDING_TEMPLATES['WD-101'].media.audioTitle,
    telegramChatId: '@alisher_wedding_bot',
    agenda: [
      { time: '17:00', title: "Mehmonlarni Kutib Olish", description: 'Lobi zalida tantanali kutib olish va milliy musiqa', iconName: 'Users' },
      { time: '18:00', title: 'Nikoh Marosimi & Fotiha', description: "FHDYo va shar'iy nikoh marosimi", iconName: 'Heart' },
      { time: '19:00', title: 'Tantanali Shou Dasturi', description: 'Estrada yulduzlari ishtirokidagi konsert va kechki taom', iconName: 'Music' },
      { time: '21:30', title: "To'y Tortini Kesish Marosimi", description: 'Chiroqlar va feyerverk shousi', iconName: 'Sparkles' },
    ],
    dressCode: {
      title: 'Black Tie / Rasmiy Kostyum & Kechki Libos',
      description: "Bizning tantanamiz fil suyagi va qum-oltin bezaklarda o'tkaziladi.",
      colors: [
        { name: 'Qum Oltin', hex: '#D4A373' },
        { name: 'Slate', hex: '#1E293B' },
        { name: 'Marvarid Oq', hex: '#FAF6F0' },
        { name: 'Klassik Qora', hex: '#1A1A1A' },
      ],
    },
    rsvps: [
      { id: 'r-1', invitationId: 'OT-84920', guestName: 'Sardor Azimov', role: "Yaqin Do'st", status: 'ATTENDING', plusOne: 2, wishes: "Baxtiyor bo'linglar!", createdAt: new Date().toISOString() },
      { id: 'r-2', invitationId: 'OT-84920', guestName: 'Jasur va Umida', role: 'VIP Mehmon', status: 'ATTENDING', plusOne: 1, wishes: "Qo'sha qaringlar!", createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sample2: Invitation = {
    id: 'OT-12945',
    templateId: 'WD-102',
    status: 'ACTIVE',
    hostName: 'Sardor va Malika',
    brideName: 'Malika',
    groomName: 'Sardor',
    eventTitle: "Nikoh To'yi Marosimi",
    eventType: "Nikoh To'yi",
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    venueName: 'Hyatt Regency Tashkent',
    locationAddress: "Toshkent shahri, Mirzo Ulug'bek tumani",
    yandexUrl: 'https://yandex.uz/maps',
    googleUrl: 'https://maps.google.com',
    audioUrl:
      WEDDING_TEMPLATES['WD-102'].media.audioUrl,
    audioTitle: WEDDING_TEMPLATES['WD-102'].media.audioTitle,
    telegramChatId: '@sardor_wedding_bot',
    agenda: [
      { time: '17:00', title: "Mehmonlarni Kutib Olish", description: 'Tantanali kutib olish', iconName: 'Users' },
      { time: '18:00', title: 'Nikoh Marosimi', description: 'Uzuklar va fotiha', iconName: 'Heart' },
      { time: '20:00', title: 'Bayram Dasturxoni', description: 'Konsert va tort', iconName: 'Music' },
    ],
    dressCode: {
      title: 'Elegant Formal',
      description: 'Nafis kechki liboslar va rasmiy kostyumlar.',
      colors: [
        { name: 'Qum Oltin', hex: '#D4A373' },
        { name: 'Slate', hex: '#1E293B' },
      ],
    },
    rsvps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.set(sample1.id, sample1);
  db.set(sample2.id, sample2);
  saveInvitations();
}

function extractBearer(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return null;
  return h.slice(7).trim() || null;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractBearer(req);
  if (!token || !adminTokens().has(token)) {
    return res.status(401).json({
      success: false,
      message: 'Admin avtorizatsiyasi talab qilinadi',
    });
  }
  next();
}

/** Express app with /api/* routes only — shared by local server and Vercel */
export function createApiApp(): Express {
  seedDemoData();

  const app = express();

  // Security headers (tsparticles / Vite may need 'unsafe-eval' under script-src)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https: http:",
        "media-src 'self' blob:",
        "connect-src 'self' https:",
        "worker-src 'self' blob:",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ].join('; ')
    );
    next();
  });

  // Serverless runtimes may consume the request stream and hand us a parsed
  // body; re-parsing would then silently yield an empty object.
  app.use((req, _res, next) => {
    const anyReq = req as Request & { _body?: boolean };
    if (req.body && typeof req.body === 'object') anyReq._body = true;
    next();
  });

  // Base64 rasmlar uchun yetarli limit
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      invitations: invitationsDb().size,
      persistence: describePersistence(),
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  app.get('/api/templates', (_req, res) => {
    res.json({ success: true, data: Object.values(WEDDING_TEMPLATES) });
  });

  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body || {};
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      username.trim() !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: 'Login yoki parol noto‘g‘ri',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    adminTokens().add(token);
    res.json({ success: true, token });
  });

  app.post('/api/admin/logout', requireAdmin, (req, res) => {
    const token = extractBearer(req);
    if (token) adminTokens().delete(token);
    res.json({ success: true });
  });

  app.get('/api/admin/me', requireAdmin, (_req, res) => {
    res.json({ success: true, username: ADMIN_USERNAME });
  });

  app.get('/api/invitations', requireAdmin, (_req, res) => {
    const items = Array.from(invitationsDb().values());
    res.json({ success: true, data: items });
  });

  app.get('/api/invitations/:id', (req, res) => {
    const id = req.params.id.toUpperCase();
    const invitation = invitationsDb().get(id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Taklifnoma topilmadi' });
    }

    const isPreview = req.query.preview === '1' || req.query.preview === 'true';
    const adminToken = extractBearer(req);
    const isAdmin = !!(adminToken && adminTokens().has(adminToken));

    if (invitation.status === 'PENDING' && !isPreview && !isAdmin) {
      return res.status(403).json({
        success: false,
        code: 'NOT_ACTIVATED',
        message: 'Bu taklifnoma hali aktivlashtirilmagan. Mehmon havolasi ishlamaydi.',
      });
    }

    res.json({ success: true, data: invitation });
  });

  app.post('/api/invitations', (req, res) => {
    try {
      const body = req.body;
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newId = `OT-${randomNum}`;

      const requestedTemplateId = typeof body?.templateId === 'string' ? body.templateId : 'WD-101';
      const safeTemplateId = WEDDING_TEMPLATES[requestedTemplateId] ? requestedTemplateId : 'WD-101';
      const template = WEDDING_TEMPLATES[safeTemplateId];

      const newInvitation: Invitation = {
        id: newId,
        templateId: safeTemplateId,
        status: 'PENDING',
        hostName: body.hostName || 'Mezbonlar',
        brideName: body.brideName || '',
        groomName: body.groomName || '',
        eventTitle: body.eventTitle || "Nikoh To'yi Marosimi",
        eventType: body.eventType || "Nikoh To'yi",
        eventDate: body.eventDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        venueName: body.venueName || 'Tantanalar Saroyi',
        locationAddress: body.locationAddress || 'Toshkent shahri',
        yandexUrl: body.yandexUrl || 'https://yandex.uz/maps',
        googleUrl: body.googleUrl || 'https://maps.google.com',
        twoGisUrl: body.twoGisUrl || '',
        audioUrl:
          body.audioUrl || template.media.audioUrl,
        audioTitle: body.audioTitle || template.media.audioTitle,
        telegramChatId: body.telegramChatId || '@onlayntaklifnomaadmin',
        agenda: body.agenda || [],
        dressCode: body.dressCode || undefined,
        customStyles:
          body.customStyles && typeof body.customStyles === 'object'
            ? body.customStyles
            : undefined,
        coverImage: typeof body.coverImage === 'string' ? body.coverImage : undefined,
        venueImage: typeof body.venueImage === 'string' ? body.venueImage : undefined,
        rsvps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      invitationsDb().set(newId, newInvitation);
      saveInvitations();
      res.status(201).json({ success: true, data: newInvitation });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Server xatosi';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.post('/api/invitations/:id/activate', requireAdmin, (req, res) => {
    const id = req.params.id.toUpperCase();
    const invitation = invitationsDb().get(id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Taklifnoma topilmadi' });
    }

    invitation.status = 'ACTIVE';
    invitation.updatedAt = new Date().toISOString();
    invitationsDb().set(id, invitation);
    saveInvitations();

    res.json({
      success: true,
      message: `Taklifnoma #${id} muvaffaqiyatli faollashtirildi!`,
      data: invitation,
      guestLink: `/v/${id}`,
    });
  });

  app.put('/api/invitations/:id', requireAdmin, (req, res) => {
    try {
      const id = req.params.id.toUpperCase();
      const existing = invitationsDb().get(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Taklifnoma topilmadi' });
      }

      const body = req.body || {};
      const next: Invitation = {
        ...existing,
        hostName: typeof body.hostName === 'string' ? body.hostName : existing.hostName,
        brideName: typeof body.brideName === 'string' ? body.brideName : existing.brideName,
        groomName: typeof body.groomName === 'string' ? body.groomName : existing.groomName,
        eventTitle: typeof body.eventTitle === 'string' ? body.eventTitle : existing.eventTitle,
        eventType: typeof body.eventType === 'string' ? body.eventType : existing.eventType,
        eventDate: typeof body.eventDate === 'string' ? body.eventDate : existing.eventDate,
        venueName: typeof body.venueName === 'string' ? body.venueName : existing.venueName,
        locationAddress:
          typeof body.locationAddress === 'string'
            ? body.locationAddress
            : existing.locationAddress,
        yandexUrl: typeof body.yandexUrl === 'string' ? body.yandexUrl : existing.yandexUrl,
        googleUrl: typeof body.googleUrl === 'string' ? body.googleUrl : existing.googleUrl,
        twoGisUrl: typeof body.twoGisUrl === 'string' ? body.twoGisUrl : existing.twoGisUrl,
        audioUrl: typeof body.audioUrl === 'string' ? body.audioUrl : existing.audioUrl,
        audioTitle: typeof body.audioTitle === 'string' ? body.audioTitle : existing.audioTitle,
        telegramChatId:
          typeof body.telegramChatId === 'string'
            ? body.telegramChatId
            : existing.telegramChatId,
        agenda: Array.isArray(body.agenda) ? body.agenda : existing.agenda,
        dressCode: body.dressCode && typeof body.dressCode === 'object' ? body.dressCode : existing.dressCode,
        customStyles:
          body.customStyles && typeof body.customStyles === 'object'
            ? body.customStyles
            : existing.customStyles,
        coverImage: typeof body.coverImage === 'string' ? body.coverImage : existing.coverImage,
        venueImage: typeof body.venueImage === 'string' ? body.venueImage : existing.venueImage,
        templateId:
          typeof body.templateId === 'string' && WEDDING_TEMPLATES[body.templateId]
            ? body.templateId
            : existing.templateId,
        updatedAt: new Date().toISOString(),
      };

      invitationsDb().set(id, next);
      saveInvitations();
      res.json({ success: true, data: next });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Server xatosi';
      res.status(500).json({ success: false, error: message });
    }
  });

  app.post('/api/invitations/:id/rsvp', (req, res) => {
    const id = req.params.id.toUpperCase();
    const invitation = invitationsDb().get(id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Taklifnoma topilmadi' });
    }

    if (invitation.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        code: 'NOT_ACTIVATED',
        message: 'Taklifnoma hali aktiv emas. RSVP qabul qilinmaydi.',
      });
    }

    const { guestName, role, status, plusOne, wishes } = req.body;

    const newRsvp: Rsvp = {
      id: `r-${Date.now()}`,
      invitationId: id,
      guestName: guestName || 'Mehmon',
      role: role || 'Mehmon',
      status: status || 'ATTENDING',
      plusOne: Number(plusOne) || 0,
      wishes: wishes || '',
      createdAt: new Date().toISOString(),
    };

    if (!invitation.rsvps) invitation.rsvps = [];
    invitation.rsvps.push(newRsvp);
    invitationsDb().set(id, invitation);
    saveInvitations();

    res.json({
      success: true,
      message: 'Tashrifingiz muvaffaqiyatli qabul qilindi!',
      data: newRsvp,
      telegramSimulatedLog: `🔔 [${invitation.eventTitle}]: ${guestName} (${role || 'Mehmon'}) tashrifini ${status === 'ATTENDING' ? 'TASDIQLADI' : 'rad etdi'}!`,
    });
  });

  app.get('/api/admin/stats', requireAdmin, (_req, res) => {
    const items = Array.from(invitationsDb().values());
    const pending = items.filter((i) => i.status === 'PENDING').length;
    const active = items.filter((i) => i.status === 'ACTIVE').length;
    const totalRsvps = items.reduce((acc, curr) => acc + (curr.rsvps?.length || 0), 0);

    res.json({
      success: true,
      stats: {
        totalInvitations: items.length,
        pendingInvitations: pending,
        activeInvitations: active,
        totalRsvps,
      },
    });
  });

  // Always answer /api/* with JSON so the client never has to parse an HTML error page
  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'API yo‘li topilmadi' });
  });

  app.use(
    '/api',
    (err: Error & { status?: number; type?: string }, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status && err.status >= 400 ? err.status : 500;
      const message =
        err.type === 'entity.too.large'
          ? 'Yuborilgan ma’lumot juda katta. Rasmni kichikroq qiling.'
          : err.message || 'Server xatosi';

      console.error('[api error]', status, err.stack || message);
      res.status(status).json({ success: false, message });
    }
  );

  return app;
}
