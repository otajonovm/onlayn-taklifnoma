var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/vercelHandler.ts
var vercelHandler_exports = {};
__export(vercelHandler_exports, {
  default: () => handler
});
module.exports = __toCommonJS(vercelHandler_exports);

// src/server/apiApp.ts
var import_express = __toESM(require("express"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// src/data/weddingImagery.ts
var WEDDING_IMAGES = {
  /** Soft ceremony / couple atmosphere */
  ceremony: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  /** Hands with wedding rings */
  rings: "https://images.unsplash.com/photo-1515934752419-aa85c34dda0d?auto=format&fit=crop&w=900&q=80",
  /** Close-up gold wedding bands */
  ringsClose: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
  /** Floral wedding table / romantic venue */
  venue: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
  /** Soft bouquet / romantic detail */
  bouquet: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
  /** Candlelit / evening romance */
  evening: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
};

// src/config/themes.ts
var BRAND = {
  bg: "#FDFBF7",
  white: "#FFFFFF",
  text: "#1E293B",
  accent: "#D4A373",
  border: "#E5E7EB",
  borderAccent: "rgba(212, 163, 115, 0.2)",
  muted: "#64748B"
};
var PALETTES = {
  ivory_sand: {
    id: "ivory_sand",
    name: "Ivory & Soft Gold",
    nameUz: "Fil Suyagi va Mayin Oltin",
    bg: BRAND.bg,
    cardBg: BRAND.white,
    accent: BRAND.accent,
    text: BRAND.text,
    primaryColor: BRAND.white,
    envelopeColor: "#FAF6F0",
    glassBg: "bg-white/90 backdrop-blur-md",
    glassBorder: "border-[#D4A373]/20",
    isDark: false,
    fontHeader: "Playfair Display"
  }
};

// src/config/weddingTemplates.ts
var WEDDING_TEMPLATES = {
  "WD-101": {
    id: "WD-101",
    name: "Minimal Ivory Classic",
    category: "wedding",
    styles: {
      colorBg: BRAND.bg,
      colorCardBg: BRAND.white,
      colorTextPrimary: BRAND.text,
      colorTextSecondary: BRAND.muted,
      colorAccent: BRAND.accent,
      colorBorder: "rgba(212, 163, 115, 0.4)",
      borderStyle: "classic_single",
      borderRadius: "md",
      fontHeader: "Cormorant Garamond",
      fontBody: "Plus Jakarta Sans"
    },
    content: {
      hero: {
        title: "Eng baxtli kunimizga taklif etamiz",
        coupleNames: "Sardorbek & Anoraxon",
        monogram: "S & A",
        coverImage: WEDDING_IMAGES.ringsClose,
        preambleText: "Hurmat bilan taklif etamiz",
        primaryBodyTemplate: "Bizning hayotimizdagi eng baxtli kun \u2014 ${title} ga sizni mehmon qilib taklif etamiz.",
        secondaryBodyText: "Sizning ishtirokingiz, ezgu tilaklaringiz va duolaringiz biz uchun beqiyos qadrli. Shu quvonchini birga nishonlashni istaymiz.",
        closingLineText: "Kutib olishimizdan mamnun bo\u2018lamiz"
      },
      quote: {
        text: "Alloh ularning qalbini sevgi ila birlashtirdi",
        source: "Anfol surasi, 63-oyat"
      },
      calendar: {
        title: "Tantanali Kun",
        eventDate: "2026-12-26",
        eventTime: "18:00",
        badgeText: "To'y kuni",
        saveTheDateLabel: "Save the Date",
        dayTouchedLabel: "Bizning baxtli kunimiz",
        googleCalendarSync: true,
        monthNamesUz: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
        daysOfWeekUz: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]
      },
      venue: {
        name: "Hyatt Regency Tashkent",
        address: "Navoiy shoh ko'chasi, 1-uy",
        yandexNavUrl: "https://yandex.com/maps/?text=Hyatt%20Regency%20Tashkent"
      },
      agenda: {
        headerText: "Dastur",
        items: [
          { time: "17:00", title: "Mehmonlarni Kutib Olish", description: "Lobi zalida tantanali kutib olish", iconName: "Users" },
          { time: "18:00", title: "Nikoh Marosimi & Fotiha", description: "Shar'iy nikoh marosimi", iconName: "Heart" },
          { time: "19:00", title: "Tantanali Shou Dasturi", description: "Konsert va bayramona kayfiyat", iconName: "Music" },
          { time: "21:30", title: "To'y Tortini Kesish", description: "Chiroqlar va ezgu duolar", iconName: "Sparkles" }
        ]
      },
      rsvp: {
        badgeText: "RSVP",
        sectionTitle: "Tashrifingizni Bildiring",
        sectionSubtitleTemplate: "${hostName} sizni kutmoqda.",
        guestNameLabel: "Ismingiz *",
        proximityLabel: "Yaqinlik",
        statusLabel: "Tashrif *",
        roles: [
          { value: "Yaqin Do'st", label: "Yaqin Do'st" },
          { value: "Qarindosh", label: "Qarindosh / Oila" },
          { value: "Hamkasb", label: "Hamkasb" },
          { value: "Qo'shni", label: "Qo'shni" },
          { value: "Tantana sohibi", label: "Tantana sohibi" }
        ],
        status: {
          attendingValue: "ATTENDING",
          attendingLabel: "Boraman",
          declinedValue: "DECLINED",
          declinedLabel: "Bora olmayman"
        },
        plusOneLabel: "Necha kishi?",
        wishesLabel: "Tilaklar (ixtiyoriy)",
        submitButtonSubmittingLabel: "Yuborilmoqda...",
        submitButtonAttendingLabel: "Boraman \u2014 Tasdiqlash",
        submitButtonDeclinedLabel: "Javobni Yuborish",
        successTitle: "Rahmat!",
        successSubtitleTemplate: "Tashrifingiz tasdiqlandi. Mezbonlar tez orada xabar olishadi."
      },
      locationNavigator: {
        sectionLabel: "Manzil va xarita",
        maps: [
          { key: "yandex", label: "Yandex Maps", hint: "Navigator" },
          { key: "google", label: "Google Maps", hint: "Marshrut" },
          { key: "twoGis", label: "2GIS", hint: "Xarita" }
        ]
      },
      countdown: {
        sectionLabel: "\u2014 Tantanagacha \u2014",
        pendingPassedText: "Tantana marosimi bo'lib o'tdi yoki bugun bo'lib o'tmoqda!",
        units: {
          daysLabel: "Kun",
          hoursLabel: "Soat",
          minutesLabel: "Daqiqa",
          secondsLabel: "Soniya"
        }
      }
    },
    thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    description: "Minimal ivory va soft oltin aksentli nafis taklifnoma.",
    isPremium: true,
    media: {
      audioUrl: "/audio/oh-sevaman-yor.mp3",
      audioTitle: "Oh Sevaman Yor \u2014 Ibrohim Nurmatov"
    },
    envelope: {
      envelopeColor: "#FAF6F0",
      waxSealSymbol: "\u2764\uFE0F"
    }
  },
  "WD-102": {
    id: "WD-102",
    name: "Fine-Line Botanical",
    category: "wedding",
    styles: {
      colorBg: BRAND.white,
      colorCardBg: BRAND.white,
      colorTextPrimary: "#0F172A",
      colorTextSecondary: "#334155",
      colorAccent: "#C5A059",
      colorBorder: "rgba(197, 160, 89, 0.45)",
      borderStyle: "glass_panel",
      borderRadius: "lg",
      fontHeader: "Playfair Display",
      fontBody: "Inter"
    },
    content: {
      hero: {
        title: "Nikoh To'yi Taklifnomasi",
        coupleNames: "Masudbek & Malika",
        monogram: "M & M",
        coverImage: WEDDING_IMAGES.rings,
        preambleText: "Hurmat bilan taklif etamiz",
        primaryBodyTemplate: "Bizning hayotimizdagi eng baxtli kun \u2014 ${title} ga sizni mehmon qilib taklif etamiz.",
        secondaryBodyText: "Sizning ishtirokingiz, ezgu tilaklaringiz va duolaringiz biz uchun beqiyos qadrli. Shu quvonchini birga nishonlashni istaymiz.",
        closingLineText: "Kutib olishimizdan mamnun bo\u2018lamiz"
      },
      quote: {
        text: "Muhabbat ikki qalbni birlashtiradi",
        source: "Klassik hikmat"
      },
      calendar: {
        title: "Sanalarni Saqlab Qo\u2018ying",
        eventDate: "2026-09-25",
        eventTime: "17:00",
        badgeText: "Tantanali Oqshom",
        saveTheDateLabel: "Save the Date",
        dayTouchedLabel: "Bizning baxtli kunimiz",
        googleCalendarSync: true,
        monthNamesUz: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
        daysOfWeekUz: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]
      },
      venue: {
        name: "Tashkent Palace",
        address: "Toshkent shahri",
        yandexNavUrl: "https://yandex.com/maps/?text=Tashkent%20Palace"
      },
      agenda: {
        headerText: "Dastur",
        items: [
          { time: "17:00", title: "Mehmonlarni Kutib Olish", description: "Milliy kayfiyat", iconName: "Users" },
          { time: "18:00", title: "Nikoh Marosimi", description: "Uzuklar va fotiha", iconName: "Heart" },
          { time: "20:00", title: "Bayram Dasturxoni", description: "Konsert va tort", iconName: "Music" }
        ]
      },
      rsvp: {
        badgeText: "RSVP",
        sectionTitle: "Tashrifingizni Bildiring",
        sectionSubtitleTemplate: "${hostName} sizni kutmoqda.",
        guestNameLabel: "Ismingiz *",
        proximityLabel: "Yaqinlik",
        statusLabel: "Tashrif *",
        roles: [
          { value: "Yaqin Do'st", label: "Yaqin Do'st" },
          { value: "Qarindosh", label: "Qarindosh / Oila" }
        ],
        status: {
          attendingValue: "ATTENDING",
          attendingLabel: "Boraman",
          declinedValue: "DECLINED",
          declinedLabel: "Bora olmayman"
        },
        plusOneLabel: "Necha kishi?",
        wishesLabel: "Tilaklar (ixtiyoriy)",
        submitButtonSubmittingLabel: "Yuborilmoqda...",
        submitButtonAttendingLabel: "Boraman \u2014 Tasdiqlash",
        submitButtonDeclinedLabel: "Javobni Yuborish",
        successTitle: "Rahmat!",
        successSubtitleTemplate: "Tashrifingiz tasdiqlandi. Mezbonlar tez orada xabar olishadi."
      },
      locationNavigator: {
        sectionLabel: "Manzil va xarita",
        maps: [
          { key: "yandex", label: "Yandex Maps", hint: "Navigator" },
          { key: "google", label: "Google Maps", hint: "Marshrut" },
          { key: "twoGis", label: "2GIS", hint: "Xarita" }
        ]
      },
      countdown: {
        sectionLabel: "\u2014 Tantanagacha \u2014",
        pendingPassedText: "Tantana marosimi bo'lib o'tdi yoki bugun bo'lib o'tmoqda!",
        units: {
          daysLabel: "Kun",
          hoursLabel: "Soat",
          minutesLabel: "Daqiqa",
          secondsLabel: "Soniya"
        }
      }
    },
    thumbnail: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    description: "Fine-line ramkali botanical stil.",
    isPremium: true,
    media: {
      audioUrl: "/audio/oshiqman.mp3",
      audioTitle: "Oshiqman \u2014 Izzat Shukurov"
    },
    envelope: {
      envelopeColor: "#FAF6F0",
      waxSealSymbol: "\u{1F451}"
    }
  },
  "WD-103": {
    id: "WD-103",
    name: "Editorial Postcard",
    category: "wedding",
    styles: {
      colorBg: "#FDFBF7",
      colorCardBg: "#FFFFFF",
      colorTextPrimary: "#1E293B",
      colorTextSecondary: "#64748B",
      colorAccent: "#B8956C",
      colorBorder: "rgba(184, 149, 108, 0.45)",
      borderStyle: "double_fine",
      borderRadius: "sm",
      fontHeader: "Playfair Display",
      fontBody: "Plus Jakarta Sans"
    },
    content: {
      hero: {
        title: "Nikoh To'yi Marosimi",
        coupleNames: "Jasur & Madina",
        monogram: "J \xB7 M",
        coverImage: WEDDING_IMAGES.ceremony,
        preambleText: "Hurmat bilan taklif etamiz",
        primaryBodyTemplate: "Bizning hayotimizdagi eng baxtli kun \u2014 ${title} ga sizni mehmon qilib taklif etamiz.",
        secondaryBodyText: "Sizning ishtirokingiz, ezgu tilaklaringiz va duolaringiz biz uchun beqiyos qadrli.",
        closingLineText: "Kutib olishimizdan mamnun bo\u2018lamiz"
      },
      quote: {
        text: "Sevgi sabr bilan mustahkamlanadi",
        source: "Ma\u2019naviy meros"
      },
      calendar: {
        title: "Sana",
        eventDate: "2026-11-14",
        eventTime: "18:00",
        badgeText: "Tantanali kun",
        saveTheDateLabel: "Save the Date",
        dayTouchedLabel: "Bizning baxtli kunimiz",
        googleCalendarSync: true,
        monthNamesUz: [
          "Yanvar",
          "Fevral",
          "Mart",
          "Aprel",
          "May",
          "Iyun",
          "Iyul",
          "Avgust",
          "Sentabr",
          "Oktabr",
          "Noyabr",
          "Dekabr"
        ],
        daysOfWeekUz: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]
      },
      venue: {
        name: "Hilton Tashkent City",
        address: "Toshkent, Islam Karimov ko'chasi",
        yandexNavUrl: "https://yandex.com/maps/?text=Hilton%20Tashkent%20City"
      },
      agenda: {
        headerText: "Dastur",
        items: [
          { time: "17:30", title: "Mehmonlarni Kutib Olish", description: "Lobby", iconName: "Users" },
          { time: "18:30", title: "Nikoh Marosimi", description: "Uzuklar", iconName: "Heart" },
          { time: "20:00", title: "Bayram Dasturi", description: "Konsert", iconName: "Music" }
        ]
      },
      rsvp: {
        badgeText: "RSVP",
        sectionTitle: "Tashrifingizni Bildiring",
        sectionSubtitleTemplate: "${hostName} sizni kutmoqda.",
        guestNameLabel: "Ismingiz *",
        proximityLabel: "Yaqinlik",
        statusLabel: "Tashrif *",
        roles: [
          { value: "Yaqin Do'st", label: "Yaqin Do'st" },
          { value: "Qarindosh", label: "Qarindosh / Oila" },
          { value: "Hamkasb", label: "Hamkasb" }
        ],
        status: {
          attendingValue: "ATTENDING",
          attendingLabel: "Boraman",
          declinedValue: "DECLINED",
          declinedLabel: "Bora olmayman"
        },
        plusOneLabel: "Necha kishi?",
        wishesLabel: "Tilaklar (ixtiyoriy)",
        submitButtonSubmittingLabel: "Yuborilmoqda...",
        submitButtonAttendingLabel: "Boraman \u2014 Tasdiqlash",
        submitButtonDeclinedLabel: "Javobni Yuborish",
        successTitle: "Rahmat!",
        successSubtitleTemplate: "Tashrifingiz tasdiqlandi. Mezbonlar tez orada xabar olishadi."
      },
      locationNavigator: {
        sectionLabel: "Manzil va xarita",
        maps: [
          { key: "yandex", label: "Yandex Maps", hint: "Navigator" },
          { key: "google", label: "Google Maps", hint: "Marshrut" },
          { key: "twoGis", label: "2GIS", hint: "Xarita" }
        ]
      },
      countdown: {
        sectionLabel: "\u2014 Tantanagacha \u2014",
        pendingPassedText: "Tantana marosimi bo'lib o'tdi yoki bugun bo'lib o'tmoqda!",
        units: {
          daysLabel: "Kun",
          hoursLabel: "Soat",
          minutesLabel: "Daqiqa",
          secondsLabel: "Soniya"
        }
      }
    },
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    description: "Editorial jurnal / postcard stil \u2014 ikki tonli bo\u2018limlar.",
    isPremium: true,
    media: {
      audioUrl: "/audio/sev-mani.mp3",
      audioTitle: "Sev Mani \u2014 Hojiakbar Rozmetov"
    },
    envelope: {
      envelopeColor: "#F5EDE3",
      waxSealSymbol: "\u2726"
    }
  }
};

// src/server/invitationStore.ts
var import_fs = __toESM(require("fs"), 1);
var import_os = __toESM(require("os"), 1);
var import_path = __toESM(require("path"), 1);
var PRIMARY_DIR = process.env.DATA_DIR ? import_path.default.resolve(process.env.DATA_DIR) : import_path.default.join(process.cwd(), "data");
var FALLBACK_DIR = import_path.default.join(import_os.default.tmpdir(), "onlayn-taklifnoma");
var resolvedDir = null;
var resolveAttempted = false;
function dataDir() {
  if (resolveAttempted) return resolvedDir;
  resolveAttempted = true;
  for (const dir of [PRIMARY_DIR, FALLBACK_DIR]) {
    try {
      import_fs.default.mkdirSync(dir, { recursive: true });
      import_fs.default.accessSync(dir, import_fs.default.constants.W_OK);
      resolvedDir = dir;
      if (dir === FALLBACK_DIR) {
        console.warn(
          `[invitationStore] ${PRIMARY_DIR} yozib bo\u2018lmadi, vaqtinchalik papka ishlatilmoqda: ${dir}`
        );
      }
      return resolvedDir;
    } catch {
    }
  }
  console.warn("[invitationStore] yozib bo\u2018ladigan papka topilmadi \u2014 faqat xotirada ishlaydi");
  return null;
}
function dataFile() {
  const dir = dataDir();
  return dir ? import_path.default.join(dir, "invitations.json") : null;
}
function describePersistence() {
  const file = dataFile();
  return file ? `disk: ${file}` : "memory only (read-only filesystem)";
}
function loadInvitationsFromDisk() {
  const file = dataFile();
  if (!file) return /* @__PURE__ */ new Map();
  try {
    if (!import_fs.default.existsSync(file)) return /* @__PURE__ */ new Map();
    const parsed = JSON.parse(import_fs.default.readFileSync(file, "utf8"));
    if (!parsed || typeof parsed !== "object") return /* @__PURE__ */ new Map();
    return new Map(Object.entries(parsed));
  } catch (err) {
    console.warn("[invitationStore] load failed:", err);
    return /* @__PURE__ */ new Map();
  }
}
function persistInvitationsToDisk(db) {
  const file = dataFile();
  if (!file) return;
  try {
    import_fs.default.writeFileSync(file, JSON.stringify(Object.fromEntries(db.entries()), null, 2), "utf8");
  } catch (err) {
    console.warn("[invitationStore] save failed:", err);
  }
}

// src/server/apiApp.ts
var ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "taklifnoma2026";
function store() {
  return globalThis;
}
function invitationsDb() {
  const g = store();
  if (!g.__otInvitations) {
    g.__otInvitations = loadInvitationsFromDisk();
  }
  return g.__otInvitations;
}
function saveInvitations() {
  persistInvitationsToDisk(invitationsDb());
}
function adminTokens() {
  const g = store();
  if (!g.__otAdminTokens) g.__otAdminTokens = /* @__PURE__ */ new Set();
  return g.__otAdminTokens;
}
function seedDemoData() {
  const g = store();
  if (g.__otSeeded) return;
  g.__otSeeded = true;
  const db = invitationsDb();
  if (db.size > 0) return;
  const sample1 = {
    id: "OT-84920",
    templateId: "WD-101",
    status: "PENDING",
    hostName: "Alisher va Nigora",
    brideName: "Nigora",
    groomName: "Alisher",
    eventTitle: "Nikoh To'yi Marosimi",
    eventType: "Nikoh To'yi",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString(),
    venueName: "Versal Tantanalar Saroyi",
    locationAddress: "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 102",
    yandexUrl: "https://yandex.uz/maps/10335/tashkent/?ll=69.281111%2C41.332222&z=16",
    googleUrl: "https://maps.google.com/?q=Tashkent",
    twoGisUrl: "https://2gis.uz/tashkent",
    audioUrl: WEDDING_TEMPLATES["WD-101"].media.audioUrl,
    audioTitle: WEDDING_TEMPLATES["WD-101"].media.audioTitle,
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
      { id: "r-1", invitationId: "OT-84920", guestName: "Sardor Azimov", role: "Yaqin Do'st", status: "ATTENDING", plusOne: 2, wishes: "Baxtiyor bo'linglar!", createdAt: (/* @__PURE__ */ new Date()).toISOString() },
      { id: "r-2", invitationId: "OT-84920", guestName: "Jasur va Umida", role: "VIP Mehmon", status: "ATTENDING", plusOne: 1, wishes: "Qo'sha qaringlar!", createdAt: (/* @__PURE__ */ new Date()).toISOString() }
    ],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const sample2 = {
    id: "OT-12945",
    templateId: "WD-102",
    status: "ACTIVE",
    hostName: "Sardor va Malika",
    brideName: "Malika",
    groomName: "Sardor",
    eventTitle: "Nikoh To'yi Marosimi",
    eventType: "Nikoh To'yi",
    eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1e3).toISOString(),
    venueName: "Hyatt Regency Tashkent",
    locationAddress: "Toshkent shahri, Mirzo Ulug'bek tumani",
    yandexUrl: "https://yandex.uz/maps",
    googleUrl: "https://maps.google.com",
    audioUrl: WEDDING_TEMPLATES["WD-102"].media.audioUrl,
    audioTitle: WEDDING_TEMPLATES["WD-102"].media.audioTitle,
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.set(sample1.id, sample1);
  db.set(sample2.id, sample2);
  saveInvitations();
}
function extractBearer(req) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7).trim() || null;
}
function requireAdmin(req, res, next) {
  const token = extractBearer(req);
  if (!token || !adminTokens().has(token)) {
    return res.status(401).json({
      success: false,
      message: "Admin avtorizatsiyasi talab qilinadi"
    });
  }
  next();
}
function createApiApp() {
  seedDemoData();
  const app2 = (0, import_express.default)();
  app2.use((req, _res, next) => {
    const anyReq = req;
    if (req.body && typeof req.body === "object") anyReq._body = true;
    next();
  });
  app2.use(import_express.default.json({ limit: "15mb" }));
  app2.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      invitations: invitationsDb().size,
      persistence: describePersistence(),
      uptimeSeconds: Math.round(process.uptime())
    });
  });
  app2.get("/api/templates", (_req, res) => {
    res.json({ success: true, data: Object.values(WEDDING_TEMPLATES) });
  });
  app2.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string" || username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Login yoki parol noto\u2018g\u2018ri"
      });
    }
    const token = import_crypto.default.randomBytes(32).toString("hex");
    adminTokens().add(token);
    res.json({ success: true, token });
  });
  app2.post("/api/admin/logout", requireAdmin, (req, res) => {
    const token = extractBearer(req);
    if (token) adminTokens().delete(token);
    res.json({ success: true });
  });
  app2.get("/api/admin/me", requireAdmin, (_req, res) => {
    res.json({ success: true, username: ADMIN_USERNAME });
  });
  app2.get("/api/invitations", requireAdmin, (_req, res) => {
    const items = Array.from(invitationsDb().values());
    res.json({ success: true, data: items });
  });
  app2.get("/api/invitations/:id", (req, res) => {
    const id = req.params.id.toUpperCase();
    const invitation = invitationsDb().get(id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
    }
    const isPreview = req.query.preview === "1" || req.query.preview === "true";
    const adminToken = extractBearer(req);
    const isAdmin = !!(adminToken && adminTokens().has(adminToken));
    if (invitation.status === "PENDING" && !isPreview && !isAdmin) {
      return res.status(403).json({
        success: false,
        code: "NOT_ACTIVATED",
        message: "Bu taklifnoma hali aktivlashtirilmagan. Mehmon havolasi ishlamaydi."
      });
    }
    res.json({ success: true, data: invitation });
  });
  app2.post("/api/invitations", (req, res) => {
    try {
      const body = req.body;
      const randomNum = Math.floor(1e4 + Math.random() * 9e4);
      const newId = `OT-${randomNum}`;
      const requestedTemplateId = typeof body?.templateId === "string" ? body.templateId : "WD-101";
      const safeTemplateId = WEDDING_TEMPLATES[requestedTemplateId] ? requestedTemplateId : "WD-101";
      const template = WEDDING_TEMPLATES[safeTemplateId];
      const newInvitation = {
        id: newId,
        templateId: safeTemplateId,
        status: "PENDING",
        hostName: body.hostName || "Mezbonlar",
        brideName: body.brideName || "",
        groomName: body.groomName || "",
        eventTitle: body.eventTitle || "Nikoh To'yi Marosimi",
        eventType: body.eventType || "Nikoh To'yi",
        eventDate: body.eventDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
        venueName: body.venueName || "Tantanalar Saroyi",
        locationAddress: body.locationAddress || "Toshkent shahri",
        yandexUrl: body.yandexUrl || "https://yandex.uz/maps",
        googleUrl: body.googleUrl || "https://maps.google.com",
        twoGisUrl: body.twoGisUrl || "",
        audioUrl: body.audioUrl || template.media.audioUrl,
        audioTitle: body.audioTitle || template.media.audioTitle,
        telegramChatId: body.telegramChatId || "@onlayntaklifnomaadmin",
        agenda: body.agenda || [],
        dressCode: body.dressCode || void 0,
        customStyles: body.customStyles && typeof body.customStyles === "object" ? body.customStyles : void 0,
        coverImage: typeof body.coverImage === "string" ? body.coverImage : void 0,
        venueImage: typeof body.venueImage === "string" ? body.venueImage : void 0,
        rsvps: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      invitationsDb().set(newId, newInvitation);
      saveInvitations();
      res.status(201).json({ success: true, data: newInvitation });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server xatosi";
      res.status(500).json({ success: false, error: message });
    }
  });
  app2.post("/api/invitations/:id/activate", requireAdmin, (req, res) => {
    const id = req.params.id.toUpperCase();
    const invitation = invitationsDb().get(id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
    }
    invitation.status = "ACTIVE";
    invitation.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    invitationsDb().set(id, invitation);
    saveInvitations();
    res.json({
      success: true,
      message: `Taklifnoma #${id} muvaffaqiyatli faollashtirildi!`,
      data: invitation,
      guestLink: `/v/${id}`
    });
  });
  app2.put("/api/invitations/:id", requireAdmin, (req, res) => {
    try {
      const id = req.params.id.toUpperCase();
      const existing = invitationsDb().get(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
      }
      const body = req.body || {};
      const next = {
        ...existing,
        hostName: typeof body.hostName === "string" ? body.hostName : existing.hostName,
        brideName: typeof body.brideName === "string" ? body.brideName : existing.brideName,
        groomName: typeof body.groomName === "string" ? body.groomName : existing.groomName,
        eventTitle: typeof body.eventTitle === "string" ? body.eventTitle : existing.eventTitle,
        eventType: typeof body.eventType === "string" ? body.eventType : existing.eventType,
        eventDate: typeof body.eventDate === "string" ? body.eventDate : existing.eventDate,
        venueName: typeof body.venueName === "string" ? body.venueName : existing.venueName,
        locationAddress: typeof body.locationAddress === "string" ? body.locationAddress : existing.locationAddress,
        yandexUrl: typeof body.yandexUrl === "string" ? body.yandexUrl : existing.yandexUrl,
        googleUrl: typeof body.googleUrl === "string" ? body.googleUrl : existing.googleUrl,
        twoGisUrl: typeof body.twoGisUrl === "string" ? body.twoGisUrl : existing.twoGisUrl,
        audioUrl: typeof body.audioUrl === "string" ? body.audioUrl : existing.audioUrl,
        audioTitle: typeof body.audioTitle === "string" ? body.audioTitle : existing.audioTitle,
        telegramChatId: typeof body.telegramChatId === "string" ? body.telegramChatId : existing.telegramChatId,
        agenda: Array.isArray(body.agenda) ? body.agenda : existing.agenda,
        dressCode: body.dressCode && typeof body.dressCode === "object" ? body.dressCode : existing.dressCode,
        customStyles: body.customStyles && typeof body.customStyles === "object" ? body.customStyles : existing.customStyles,
        coverImage: typeof body.coverImage === "string" ? body.coverImage : existing.coverImage,
        venueImage: typeof body.venueImage === "string" ? body.venueImage : existing.venueImage,
        templateId: typeof body.templateId === "string" && WEDDING_TEMPLATES[body.templateId] ? body.templateId : existing.templateId,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      invitationsDb().set(id, next);
      saveInvitations();
      res.json({ success: true, data: next });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Server xatosi";
      res.status(500).json({ success: false, error: message });
    }
  });
  app2.post("/api/invitations/:id/rsvp", (req, res) => {
    const id = req.params.id.toUpperCase();
    const invitation = invitationsDb().get(id);
    if (!invitation) {
      return res.status(404).json({ success: false, message: "Taklifnoma topilmadi" });
    }
    if (invitation.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        code: "NOT_ACTIVATED",
        message: "Taklifnoma hali aktiv emas. RSVP qabul qilinmaydi."
      });
    }
    const { guestName, role, status, plusOne, wishes } = req.body;
    const newRsvp = {
      id: `r-${Date.now()}`,
      invitationId: id,
      guestName: guestName || "Mehmon",
      role: role || "Mehmon",
      status: status || "ATTENDING",
      plusOne: Number(plusOne) || 0,
      wishes: wishes || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!invitation.rsvps) invitation.rsvps = [];
    invitation.rsvps.push(newRsvp);
    invitationsDb().set(id, invitation);
    saveInvitations();
    res.json({
      success: true,
      message: "Tashrifingiz muvaffaqiyatli qabul qilindi!",
      data: newRsvp,
      telegramSimulatedLog: `\u{1F514} [${invitation.eventTitle}]: ${guestName} (${role || "Mehmon"}) tashrifini ${status === "ATTENDING" ? "TASDIQLADI" : "rad etdi"}!`
    });
  });
  app2.get("/api/admin/stats", requireAdmin, (_req, res) => {
    const items = Array.from(invitationsDb().values());
    const pending = items.filter((i) => i.status === "PENDING").length;
    const active = items.filter((i) => i.status === "ACTIVE").length;
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
  app2.use("/api", (_req, res) => {
    res.status(404).json({ success: false, message: "API yo\u2018li topilmadi" });
  });
  app2.use(
    "/api",
    (err, _req, res, _next) => {
      const status = err.status && err.status >= 400 ? err.status : 500;
      const message = err.type === "entity.too.large" ? "Yuborilgan ma\u2019lumot juda katta. Rasmni kichikroq qiling." : err.message || "Server xatosi";
      console.error("[api error]", status, err.stack || message);
      res.status(status).json({ success: false, message });
    }
  );
  return app2;
}

// src/server/vercelHandler.ts
var app = createApiApp();
function restoreOriginalUrl(req) {
  const forwarded = req.headers["x-forwarded-uri"] || req.headers["x-invoke-path"];
  if (typeof forwarded === "string" && forwarded.startsWith("/api")) {
    const queryIndex = req.url?.indexOf("?") ?? -1;
    const query = queryIndex >= 0 ? req.url.slice(queryIndex) : "";
    const pathOnly = forwarded.split("?")[0];
    req.url = pathOnly + (query && !forwarded.includes("?") ? query : forwarded.includes("?") ? "?" + forwarded.split("?")[1] : "");
  }
}
function handler(req, res) {
  restoreOriginalUrl(req);
  app(req, res);
}
module.exports = module.exports.default || module.exports;
