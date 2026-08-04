import express from "express";
import path from "path";
import crypto from "crypto";
import { config as loadEnv } from "dotenv";
import { createServer as createViteServer } from "vite";
import { TEMPLATES } from "./src/data/templates";
import { Invitation, Rsvp } from "./src/types";

loadEnv({ path: ".env.local" });
loadEnv(); // fallback .env

const app = express();
const PORT = 3000;

app.use(express.json());

/** Admin credentials — override via .env.local */
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "taklifnoma2026";

/** Active admin session tokens (in-memory) */
const adminTokens = new Set<string>();

function extractBearer(req: express.Request): string | null {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7).trim() || null;
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = extractBearer(req);
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({
      success: false,
      message: "Admin avtorizatsiyasi talab qilinadi",
    });
  }
  next();
}

// In-Memory Database initialized with sample data for instant testing
const invitationsDb: Map<string, Invitation> = new Map();

// Helper to seed sample demo invitations
function seedDemoData() {
  const sample1: Invitation = {
    id: "OT-84920",
    templateId: "blooming_white_rose",
    status: "PENDING", // Pending activation demo
    hostName: "Alisher va Nigora",
    brideName: "Nigora",
    groomName: "Alisher",
    eventTitle: "Nikoh To'yi Marosimi",
    eventType: "Nikoh To'yi",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    venueName: "Versal Tantanalar Saroyi",
    locationAddress: "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 102",
    yandexUrl: "https://yandex.uz/maps/10335/tashkent/?ll=69.281111%2C41.332222&z=16",
    googleUrl: "https://maps.google.com/?q=Tashkent",
    twoGisUrl: "https://2gis.uz/tashkent",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_10822601ff.mp3?filename=wedding-piano-10103.mp3",
    audioTitle: "Klassik Piano & Karnay Sadosi",
    telegramChatId: "@alisher_wedding_bot",
    agenda: [
      { time: "17:00", title: "Mehmonlarni Kutib Olish", description: "Lobi zalida tantanali kutib olish va milliy musiqa", iconName: "Users" },
      { time: "18:00", title: "Nikoh Marosimi & Fotiha", description: "FHDYo va shar'iy nikoh marosimi", iconName: "Heart" },
      { time: "19:00", title: "Tantanali Shou Dasturi", description: "Estrada yulduzlari ishtirokidagi konsert va kechki taom", iconName: "Music" },
      { time: "21:30", title: "To'y Tortini Kesish Marosimi", description: "Chiroqlar va feyerverk shousi", iconName: "Sparkles" }
    ],
    dressCode: {
      title: "Black Tie / Rasmiy Kostyum & Kechki Libos",
      description: "Bizning tantanamiz fil suyagi va qum-oltin bezaklarda o'tkaziladi.",
      colors: [
        { name: "Qum Oltin", hex: "#D4A373" },
        { name: "Slate", hex: "#1E293B" },
        { name: "Marvarid Oq", hex: "#FAF6F0" },
        { name: "Klassik Qora", hex: "#1A1A1A" }
      ]
    },
    rsvps: [
      { id: "r-1", invitationId: "OT-84920", guestName: "Sardor Azimov", role: "Yaqin Do'st", status: "ATTENDING", plusOne: 2, wishes: "Baxtiyor bo'linglar!", createdAt: new Date().toISOString() },
      { id: "r-2", invitationId: "OT-84920", guestName: "Jasur va Umida", role: "VIP Mehmon", status: "ATTENDING", plusOne: 1, wishes: "Qo'sha qaringlar!", createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const sample2: Invitation = {
    id: "OT-12945",
    templateId: "blooming_white_rose",
    status: "ACTIVE",
    hostName: "Sardor va Malika",
    brideName: "Malika",
    groomName: "Sardor",
    eventTitle: "Nikoh To'yi Marosimi",
    eventType: "Nikoh To'yi",
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    venueName: "Hyatt Regency Tashkent",
    locationAddress: "Toshkent shahri, Mirzo Ulug'bek tumani",
    yandexUrl: "https://yandex.uz/maps",
    googleUrl: "https://maps.google.com",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=romantic-love-story-14138.mp3",
    audioTitle: "Nafis Ishq Navosi",
    telegramChatId: "@sardor_wedding_bot",
    agenda: [
      { time: "17:00", title: "Mehmonlarni Kutib Olish", description: "Tantanali kutib olish", iconName: "Users" },
      { time: "18:00", title: "Nikoh Marosimi", description: "Uzuklar va fotiha", iconName: "Heart" },
      { time: "20:00", title: "Bayram Dasturxoni", description: "Konsert va tort", iconName: "Music" }
    ],
    dressCode: {
      title: "Elegant Formal",
      description: "Nafis kechki liboslar va rasmiy kostyumlar.",
      colors: [
        { name: "Qum Oltin", hex: "#D4A373" },
        { name: "Slate", hex: "#1E293B" }
      ]
    },
    rsvps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  invitationsDb.set(sample1.id, sample1);
  invitationsDb.set(sample2.id, sample2);
}

seedDemoData();

// REST API ROUTES
app.get("/api/templates", (req, res) => {
  res.json({ success: true, data: TEMPLATES });
});

/** Admin login */
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.trim() !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Login yoki parol noto‘g‘ri",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  adminTokens.add(token);
  console.log(`[Admin] Login success`);
  res.json({ success: true, token });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const token = extractBearer(req);
  if (token) adminTokens.delete(token);
  res.json({ success: true });
});

app.get("/api/admin/me", requireAdmin, (_req, res) => {
  res.json({ success: true, username: ADMIN_USERNAME });
});

/** Admin list — protected */
app.get("/api/invitations", requireAdmin, (req, res) => {
  const items = Array.from(invitationsDb.values());
  res.json({ success: true, data: items });
});

/**
 * Public invitation fetch
 * - preview=1 → host preview (PENDING allowed)
 * - guest / default without preview → only ACTIVE (shareable guest link)
 */
app.get("/api/invitations/:id", (req, res) => {
  const id = req.params.id.toUpperCase();
  const invitation = invitationsDb.get(id);
  if (!invitation) {
    return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
  }

  const isPreview = req.query.preview === "1" || req.query.preview === "true";
  const adminToken = extractBearer(req);
  const isAdmin = !!(adminToken && adminTokens.has(adminToken));

  if (invitation.status === "PENDING" && !isPreview && !isAdmin) {
    return res.status(403).json({
      success: false,
      code: "NOT_ACTIVATED",
      message:
        "Bu taklifnoma hali aktivlashtirilmagan. Mehmon havolasi ishlamaydi.",
    });
  }

  res.json({ success: true, data: invitation });
});

// Create Invitation (Defaults to PENDING)
app.post("/api/invitations", (req, res) => {
  try {
    const body = req.body;
    // Generate unique random ID like OT-XXXXX
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `OT-${randomNum}`;

    const newInvitation: Invitation = {
      id: newId,
      templateId: body.templateId || "blooming_white_rose",
      status: "PENDING", // Requires Admin Activation via Telegram
      hostName: body.hostName || "Mezbonlar",
      brideName: body.brideName || "",
      groomName: body.groomName || "",
      eventTitle: body.eventTitle || "Nikoh To'yi Marosimi",
      eventType: body.eventType || "Nikoh To'yi",
      eventDate: body.eventDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      venueName: body.venueName || "Tantanalar Saroyi",
      locationAddress: body.locationAddress || "Toshkent shahri",
      yandexUrl: body.yandexUrl || "https://yandex.uz/maps",
      googleUrl: body.googleUrl || "https://maps.google.com",
      twoGisUrl: body.twoGisUrl || "",
      audioUrl: body.audioUrl || "https://cdn.pixabay.com/download/audio/2022/03/15/audio_10822601ff.mp3?filename=wedding-piano-10103.mp3",
      audioTitle: body.audioTitle || "Fon Musiqasi",
      telegramChatId: body.telegramChatId || "@onlayntaklifnomaadmin",
      agenda: body.agenda || [],
      dressCode: body.dressCode || undefined,
      rsvps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    invitationsDb.set(newId, newInvitation);

    console.log(`[API] Created pending invitation: ${newId}`);
    res.status(201).json({ success: true, data: newInvitation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/** Activate — admin only */
app.post("/api/invitations/:id/activate", requireAdmin, (req, res) => {
  const id = req.params.id.toUpperCase();
  const invitation = invitationsDb.get(id);
  if (!invitation) {
    return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
  }

  invitation.status = "ACTIVE";
  invitation.updatedAt = new Date().toISOString();
  invitationsDb.set(id, invitation);

  console.log(`[API] Activated invitation: ${id}`);
  res.json({
    success: true,
    message: `Taklifnoma #${id} muvaffaqiyatli faollashtirildi!`,
    data: invitation,
    guestLink: `/v/${id}`,
  });
});

// Submit RSVP — only when ACTIVE
app.post("/api/invitations/:id/rsvp", (req, res) => {
  const id = req.params.id.toUpperCase();
  const invitation = invitationsDb.get(id);
  if (!invitation) {
    return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
  }

  if (invitation.status !== "ACTIVE") {
    return res.status(403).json({
      success: false,
      code: "NOT_ACTIVATED",
      message: "Taklifnoma hali aktiv emas. RSVP qabul qilinmaydi.",
    });
  }

  const { guestName, role, status, plusOne, wishes } = req.body;

  const newRsvp: Rsvp = {
    id: `r-${Date.now()}`,
    invitationId: id,
    guestName: guestName || "Mehmon",
    role: role || "Mehmon",
    status: status || "ATTENDING",
    plusOne: Number(plusOne) || 0,
    wishes: wishes || "",
    createdAt: new Date().toISOString()
  };

  if (!invitation.rsvps) {
    invitation.rsvps = [];
  }
  invitation.rsvps.push(newRsvp);
  invitationsDb.set(id, invitation);

  console.log(`[RSVP Alert] Event '${invitation.eventTitle}' ID ${id}: ${guestName} submitted status ${status}`);

  res.json({
    success: true,
    message: "Tashrifingiz muvaffaqiyatli qabul qilindi!",
    data: newRsvp,
    telegramSimulatedLog: `🔔 [${invitation.eventTitle}]: ${guestName} (${role || 'Mehmon'}) tashrifini ${status === 'ATTENDING' ? 'TASDIQLADI' : 'rad etdi'}!`
  });
});

// Admin Stats — protected
app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const items = Array.from(invitationsDb.values());
  const pending = items.filter(i => i.status === "PENDING").length;
  const active = items.filter(i => i.status === "ACTIVE").length;
  const totalRsvps = items.reduce((acc, curr) => acc + (curr.rsvps?.length || 0), 0);

  res.json({
    success: true,
    stats: {
      totalInvitations: items.length,
      pendingInvitations: pending,
      activeInvitations: active,
      totalRsvps
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Onlayn Taklifnoma Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Admin] login: ${ADMIN_USERNAME} (parol .env.local da)`);
  });
}

startServer();
