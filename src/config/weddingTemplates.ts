import { WEDDING_IMAGES } from '../data/weddingImagery';
import { BRAND } from './themes';
import type { TemplateStyleOverrides } from '../types/styleTokens';

export type WeddingCategory = 'wedding';

/** Template styles = full design tokens (colors, frame, fonts) */
export type WeddingTemplateStyles = TemplateStyleOverrides;

export interface WeddingHeroContent {
  title: string;
  coupleNames: string; // e.g. "Alisher & Nigora"
  monogram: string; // e.g. "A & N"
  coverImage?: string;

  // LuxuryFloralCard typography
  preambleText: string; // "Hurmat bilan taklif etamiz"
  primaryBodyTemplate: string; // template literal with ${title}
  secondaryBodyText: string;
  closingLineText: string;
}

export interface WeddingQuoteContent {
  text: string;
  source?: string;
}

export interface WeddingCalendarContent {
  title: string;
  // Template defaults (invitation renderer will overwrite with invitation.eventDate/eventTime).
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
  badgeText: string; // small CTA/badge text under section header
  saveTheDateLabel: string; // "Save the Date"
  dayTouchedLabel: string; // "Bizning baxtli kunimiz"
  googleCalendarSync: boolean;

  // Optional Uzbek names overrides
  monthNamesUz?: string[];
  daysOfWeekUz?: string[];
}

export interface WeddingVenueContent {
  name: string;
  address: string;
  yandexNavUrl: string;
}

export interface WeddingAgendaItemConfig {
  time: string;
  title: string;
  description?: string;
  iconName?: string; // Users | Heart | Music | Sparkles...
}

export interface WeddingAgendaContent {
  headerText: string; // section title
  items: WeddingAgendaItemConfig[];
}

export interface WeddingRsvpRoleConfig {
  value: string;
  label: string;
}

export interface WeddingRsvpStatusConfig {
  attendingValue: 'ATTENDING' | 'DECLINED';
  attendingLabel: string;
  declinedValue: 'ATTENDING' | 'DECLINED';
  declinedLabel: string;
}

export interface WeddingRsvpContent {
  badgeText: string;
  sectionTitle: string;
  sectionSubtitleTemplate: string; // allows ${hostName}

  guestNameLabel: string;
  proximityLabel: string;
  statusLabel: string;

  roles: WeddingRsvpRoleConfig[];
  status: WeddingRsvpStatusConfig;

  plusOneLabel: string;
  wishesLabel: string;
  submitButtonSubmittingLabel: string; // "Yuborilmoqda..."
  submitButtonAttendingLabel: string; // "Boraman — Tasdiqlash"
  submitButtonDeclinedLabel: string; // "Javobni Yuborish"

  // Success state
  successTitle: string;
  successSubtitleTemplate: string; // allows hostName/eventTitle if needed
}

export interface WeddingCountdownContent {
  sectionLabel: string; // "— Tantanagacha —"
  pendingPassedText: string; // when time is passed
  units: {
    daysLabel: string;
    hoursLabel: string;
    minutesLabel: string;
    secondsLabel: string;
  };
}

export interface WeddingLocationNavigatorContent {
  sectionLabel: string; // "Manzil va xarita"
  venuePrefix?: string; // optional
  mapTitleLabel?: string;
  // Which maps to show & their UI labels.
  maps: Array<{
    key: 'yandex' | 'google' | 'twoGis';
    label: string;
    hint: string;
  }>;
}

export interface WeddingTemplateMedia {
  audioUrl: string;
  audioTitle: string;
}

export interface WeddingTemplateEnvelope {
  envelopeColor: string;
  waxSealSymbol: string; // shown on envelope wax seal
}

export interface WeddingTemplateContent {
  hero: WeddingHeroContent;
  quote?: WeddingQuoteContent;

  calendar: WeddingCalendarContent;
  venue: WeddingVenueContent;

  // Extended for "all-sections JSON-driven" mode.
  agenda?: WeddingAgendaContent;
  rsvp?: WeddingRsvpContent;
  countdown?: WeddingCountdownContent;
  locationNavigator?: WeddingLocationNavigatorContent;
}

export interface WeddingTemplateConfig {
  id: string; // e.g. 'WD-101'
  name: string;
  category: WeddingCategory;

  styles: WeddingTemplateStyles;
  content: WeddingTemplateContent;

  // Identifiers used across the UI/editor.
  thumbnail?: string;
  description?: string;
  isPremium?: boolean;

  media: WeddingTemplateMedia;
  envelope: WeddingTemplateEnvelope;
}

export const WEDDING_TEMPLATES: Record<string, WeddingTemplateConfig> = {
  'WD-101': {
    id: 'WD-101',
    name: 'Minimal Ivory Classic',
    category: 'wedding',
    styles: {
      colorBg: BRAND.bg,
      colorCardBg: BRAND.white,
      colorTextPrimary: BRAND.text,
      colorTextSecondary: BRAND.muted,
      colorAccent: BRAND.accent,
      colorBorder: 'rgba(212, 163, 115, 0.4)',
      borderStyle: 'classic_single',
      borderRadius: 'md',
      fontHeader: 'Cormorant Garamond',
      fontBody: 'Plus Jakarta Sans',
    },
    content: {
      hero: {
        title: 'Eng baxtli kunimizga taklif etamiz',
        coupleNames: 'Sardorbek & Anoraxon',
        monogram: 'S & A',
        coverImage: WEDDING_IMAGES.ringsClose,
        preambleText: 'Hurmat bilan taklif etamiz',
        primaryBodyTemplate: 'Bizning hayotimizdagi eng baxtli kun — ${title} ga sizni mehmon qilib taklif etamiz.',
        secondaryBodyText:
          'Sizning ishtirokingiz, ezgu tilaklaringiz va duolaringiz biz uchun beqiyos qadrli. Shu quvonchini birga nishonlashni istaymiz.',
        closingLineText: 'Kutib olishimizdan mamnun bo‘lamiz',
      },
      quote: {
        text: 'Alloh ularning qalbini sevgi ila birlashtirdi',
        source: "Anfol surasi, 63-oyat",
      },
      calendar: {
        title: 'Tantanali Kun',
        eventDate: '2026-12-26',
        eventTime: '18:00',
        badgeText: "To'y kuni",
        saveTheDateLabel: 'Save the Date',
        dayTouchedLabel: 'Bizning baxtli kunimiz',
        googleCalendarSync: true,
        monthNamesUz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
        daysOfWeekUz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
      },
      venue: {
        name: 'Hyatt Regency Tashkent',
        address: "Navoiy shoh ko'chasi, 1-uy",
        yandexNavUrl: 'https://yandex.com/maps/?text=Hyatt%20Regency%20Tashkent',
      },
      agenda: {
        headerText: 'Dastur',
        items: [
          { time: '17:00', title: "Mehmonlarni Kutib Olish", description: 'Lobi zalida tantanali kutib olish', iconName: 'Users' },
          { time: '18:00', title: 'Nikoh Marosimi & Fotiha', description: "Shar'iy nikoh marosimi", iconName: 'Heart' },
          { time: '19:00', title: "Tantanali Shou Dasturi", description: 'Konsert va bayramona kayfiyat', iconName: 'Music' },
          { time: '21:30', title: "To'y Tortini Kesish", description: 'Chiroqlar va ezgu duolar', iconName: 'Sparkles' },
        ],
      },
      rsvp: {
        badgeText: 'RSVP',
        sectionTitle: 'Tashrifingizni Bildiring',
        sectionSubtitleTemplate: '${hostName} sizni kutmoqda.',

        guestNameLabel: 'Ismingiz *',
        proximityLabel: 'Yaqinlik',
        statusLabel: 'Tashrif *',

        roles: [
          { value: 'Yaqin Do\'st', label: 'Yaqin Do\'st' },
          { value: 'Qarindosh', label: 'Qarindosh / Oila' },
          { value: 'Hamkasb', label: 'Hamkasb' },
          { value: 'Qo\'shni', label: 'Qo\'shni' },
          { value: 'Tantana sohibi', label: 'Tantana sohibi' },
        ],

        status: {
          attendingValue: 'ATTENDING',
          attendingLabel: 'Boraman',
          declinedValue: 'DECLINED',
          declinedLabel: 'Bora olmayman',
        },

        plusOneLabel: 'Necha kishi?',
        wishesLabel: 'Tilaklar (ixtiyoriy)',
        submitButtonSubmittingLabel: 'Yuborilmoqda...',
        submitButtonAttendingLabel: 'Boraman — Tasdiqlash',
        submitButtonDeclinedLabel: 'Javobni Yuborish',

        successTitle: 'Rahmat!',
        successSubtitleTemplate: 'Tashrifingiz tasdiqlandi. Mezbonlar tez orada xabar olishadi.',
      },
      locationNavigator: {
        sectionLabel: 'Manzil va xarita',
        maps: [
          { key: 'yandex', label: 'Yandex Maps', hint: 'Navigator' },
          { key: 'google', label: 'Google Maps', hint: 'Marshrut' },
          { key: 'twoGis', label: '2GIS', hint: 'Xarita' },
        ],
      },
      countdown: {
        sectionLabel: '— Tantanagacha —',
        pendingPassedText: "Tantana marosimi bo'lib o'tdi yoki bugun bo'lib o'tmoqda!",
        units: {
          daysLabel: 'Kun',
          hoursLabel: 'Soat',
          minutesLabel: 'Daqiqa',
          secondsLabel: 'Soniya',
        },
      },
    },

    thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    description: 'Minimal ivory va soft oltin aksentli nafis taklifnoma.',
    isPremium: true,

    media: {
      audioUrl: '/audio/oh-sevaman-yor.mp3',
      audioTitle: 'Oh Sevaman Yor — Ibrohim Nurmatov',
    },

    envelope: {
      envelopeColor: '#FAF6F0',
      waxSealSymbol: '❤️',
    },
  },

  'WD-102': {
    id: 'WD-102',
    name: 'Fine-Line Botanical',
    category: 'wedding',
    styles: {
      colorBg: BRAND.white,
      colorCardBg: BRAND.white,
      colorTextPrimary: '#0F172A',
      colorTextSecondary: '#334155',
      colorAccent: '#C5A059',
      colorBorder: 'rgba(197, 160, 89, 0.45)',
      borderStyle: 'glass_panel',
      borderRadius: 'lg',
      fontHeader: 'Playfair Display',
      fontBody: 'Inter',
    },
    content: {
      hero: {
        title: "Nikoh To'yi Taklifnomasi",
        coupleNames: 'Masudbek & Malika',
        monogram: 'M & M',
        coverImage: WEDDING_IMAGES.rings,
        preambleText: 'Hurmat bilan taklif etamiz',
        primaryBodyTemplate: 'Bizning hayotimizdagi eng baxtli kun — ${title} ga sizni mehmon qilib taklif etamiz.',
        secondaryBodyText:
          'Sizning ishtirokingiz, ezgu tilaklaringiz va duolaringiz biz uchun beqiyos qadrli. Shu quvonchini birga nishonlashni istaymiz.',
        closingLineText: 'Kutib olishimizdan mamnun bo‘lamiz',
      },
      quote: {
        text: 'Muhabbat ikki qalbni birlashtiradi',
        source: 'Klassik hikmat',
      },
      calendar: {
        title: 'Sanalarni Saqlab Qo‘ying',
        eventDate: '2026-09-25',
        eventTime: '17:00',
        badgeText: 'Tantanali Oqshom',
        saveTheDateLabel: 'Save the Date',
        dayTouchedLabel: 'Bizning baxtli kunimiz',
        googleCalendarSync: true,
        monthNamesUz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
        daysOfWeekUz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
      },
      venue: {
        name: 'Tashkent Palace',
        address: 'Toshkent shahri',
        yandexNavUrl: 'https://yandex.com/maps/?text=Tashkent%20Palace',
      },
      agenda: {
        headerText: 'Dastur',
        items: [
          { time: '17:00', title: 'Mehmonlarni Kutib Olish', description: "Milliy kayfiyat", iconName: 'Users' },
          { time: '18:00', title: 'Nikoh Marosimi', description: "Uzuklar va fotiha", iconName: 'Heart' },
          { time: '20:00', title: 'Bayram Dasturxoni', description: "Konsert va tort", iconName: 'Music' },
        ],
      },
      rsvp: {
        badgeText: 'RSVP',
        sectionTitle: 'Tashrifingizni Bildiring',
        sectionSubtitleTemplate: '${hostName} sizni kutmoqda.',

        guestNameLabel: 'Ismingiz *',
        proximityLabel: 'Yaqinlik',
        statusLabel: 'Tashrif *',

        roles: [
          { value: 'Yaqin Do\'st', label: 'Yaqin Do\'st' },
          { value: 'Qarindosh', label: 'Qarindosh / Oila' },
        ],

        status: {
          attendingValue: 'ATTENDING',
          attendingLabel: 'Boraman',
          declinedValue: 'DECLINED',
          declinedLabel: 'Bora olmayman',
        },

        plusOneLabel: 'Necha kishi?',
        wishesLabel: 'Tilaklar (ixtiyoriy)',
        submitButtonSubmittingLabel: 'Yuborilmoqda...',
        submitButtonAttendingLabel: 'Boraman — Tasdiqlash',
        submitButtonDeclinedLabel: 'Javobni Yuborish',

        successTitle: 'Rahmat!',
        successSubtitleTemplate: 'Tashrifingiz tasdiqlandi. Mezbonlar tez orada xabar olishadi.',
      },
      locationNavigator: {
        sectionLabel: 'Manzil va xarita',
        maps: [
          { key: 'yandex', label: 'Yandex Maps', hint: 'Navigator' },
          { key: 'google', label: 'Google Maps', hint: 'Marshrut' },
          { key: 'twoGis', label: '2GIS', hint: 'Xarita' },
        ],
      },
      countdown: {
        sectionLabel: '— Tantanagacha —',
        pendingPassedText: "Tantana marosimi bo'lib o'tdi yoki bugun bo'lib o'tmoqda!",
        units: {
          daysLabel: 'Kun',
          hoursLabel: 'Soat',
          minutesLabel: 'Daqiqa',
          secondsLabel: 'Soniya',
        },
      },
    },

    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    description: 'Fine-line ramkali botanical stil.',
    isPremium: true,

    media: {
      audioUrl: '/audio/oshiqman.mp3',
      audioTitle: 'Oshiqman — Izzat Shukurov',
    },

    envelope: {
      envelopeColor: '#FAF6F0',
      waxSealSymbol: '👑',
    },
  },

  'WD-103': {
    id: 'WD-103',
    name: 'Editorial Postcard',
    category: 'wedding',
    styles: {
      colorBg: '#FDFBF7',
      colorCardBg: '#FFFFFF',
      colorTextPrimary: '#1E293B',
      colorTextSecondary: '#64748B',
      colorAccent: '#B8956C',
      colorBorder: 'rgba(184, 149, 108, 0.45)',
      borderStyle: 'double_fine',
      borderRadius: 'sm',
      fontHeader: 'Playfair Display',
      fontBody: 'Plus Jakarta Sans',
    },
    content: {
      hero: {
        title: "Nikoh To'yi Marosimi",
        coupleNames: 'Jasur & Madina',
        monogram: 'J · M',
        coverImage: WEDDING_IMAGES.ceremony,
        preambleText: 'Hurmat bilan taklif etamiz',
        primaryBodyTemplate:
          'Bizning hayotimizdagi eng baxtli kun — ${title} ga sizni mehmon qilib taklif etamiz.',
        secondaryBodyText:
          'Sizning ishtirokingiz, ezgu tilaklaringiz va duolaringiz biz uchun beqiyos qadrli.',
        closingLineText: 'Kutib olishimizdan mamnun bo‘lamiz',
      },
      quote: {
        text: 'Sevgi sabr bilan mustahkamlanadi',
        source: 'Ma’naviy meros',
      },
      calendar: {
        title: 'Sana',
        eventDate: '2026-11-14',
        eventTime: '18:00',
        badgeText: 'Tantanali kun',
        saveTheDateLabel: 'Save the Date',
        dayTouchedLabel: 'Bizning baxtli kunimiz',
        googleCalendarSync: true,
        monthNamesUz: [
          'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
          'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
        ],
        daysOfWeekUz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
      },
      venue: {
        name: 'Hilton Tashkent City',
        address: "Toshkent, Islam Karimov ko'chasi",
        yandexNavUrl: 'https://yandex.com/maps/?text=Hilton%20Tashkent%20City',
      },
      agenda: {
        headerText: 'Dastur',
        items: [
          { time: '17:30', title: 'Mehmonlarni Kutib Olish', description: 'Lobby', iconName: 'Users' },
          { time: '18:30', title: 'Nikoh Marosimi', description: 'Uzuklar', iconName: 'Heart' },
          { time: '20:00', title: 'Bayram Dasturi', description: 'Konsert', iconName: 'Music' },
        ],
      },
      rsvp: {
        badgeText: 'RSVP',
        sectionTitle: 'Tashrifingizni Bildiring',
        sectionSubtitleTemplate: '${hostName} sizni kutmoqda.',
        guestNameLabel: 'Ismingiz *',
        proximityLabel: 'Yaqinlik',
        statusLabel: 'Tashrif *',
        roles: [
          { value: "Yaqin Do'st", label: "Yaqin Do'st" },
          { value: 'Qarindosh', label: 'Qarindosh / Oila' },
          { value: 'Hamkasb', label: 'Hamkasb' },
        ],
        status: {
          attendingValue: 'ATTENDING',
          attendingLabel: 'Boraman',
          declinedValue: 'DECLINED',
          declinedLabel: 'Bora olmayman',
        },
        plusOneLabel: 'Necha kishi?',
        wishesLabel: 'Tilaklar (ixtiyoriy)',
        submitButtonSubmittingLabel: 'Yuborilmoqda...',
        submitButtonAttendingLabel: 'Boraman — Tasdiqlash',
        submitButtonDeclinedLabel: 'Javobni Yuborish',
        successTitle: 'Rahmat!',
        successSubtitleTemplate: 'Tashrifingiz tasdiqlandi. Mezbonlar tez orada xabar olishadi.',
      },
      locationNavigator: {
        sectionLabel: 'Manzil va xarita',
        maps: [
          { key: 'yandex', label: 'Yandex Maps', hint: 'Navigator' },
          { key: 'google', label: 'Google Maps', hint: 'Marshrut' },
          { key: 'twoGis', label: '2GIS', hint: 'Xarita' },
        ],
      },
      countdown: {
        sectionLabel: '— Tantanagacha —',
        pendingPassedText: "Tantana marosimi bo'lib o'tdi yoki bugun bo'lib o'tmoqda!",
        units: {
          daysLabel: 'Kun',
          hoursLabel: 'Soat',
          minutesLabel: 'Daqiqa',
          secondsLabel: 'Soniya',
        },
      },
    },
    thumbnail:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Editorial jurnal / postcard stil — ikki tonli bo‘limlar.',
    isPremium: true,
    media: {
      audioUrl: '/audio/sev-mani.mp3',
      audioTitle: 'Sev Mani — Hojiakbar Rozmetov',
    },
    envelope: {
      envelopeColor: '#F5EDE3',
      waxSealSymbol: '✦',
    },
  },
};

export type WeddingTemplateId = keyof typeof WEDDING_TEMPLATES;

