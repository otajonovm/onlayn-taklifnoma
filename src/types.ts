import type { TemplateStyleOverrides } from '@/types/styleTokens';

export type CategoryType = 'wedding';

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBgColor: string;
  textColor: string;
  fontFamily: 'serif' | 'cormorant' | 'sans';
  envelopeColor: string;
  waxSealSymbol: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
  iconName?: string;
}

export interface DressCodeColor {
  name: string;
  hex: string;
}

export interface DressCodeConfig {
  title: string;
  description: string;
  colors: DressCodeColor[];
  note?: string;
}

export interface Template {
  id: string;
  title: string;
  category: CategoryType;
  categoryLabel: string;
  thumbnail: string;
  description: string;
  isPremium: boolean;
  defaultTheme: ThemeConfig;
  sampleMusicUrl: string;
  sampleMusicTitle: string;
}

export interface Rsvp {
  id: string;
  invitationId: string;
  guestName: string;
  role?: string;
  status: 'ATTENDING' | 'DECLINED';
  plusOne: number;
  wishes?: string;
  createdAt: string;
}

export interface Invitation {
  id: string;
  templateId: string;
  status: 'PENDING' | 'ACTIVE';
  hostName: string;
  brideName?: string;
  groomName?: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  locationAddress: string;
  yandexUrl?: string;
  googleUrl?: string;
  twoGisUrl?: string;
  audioUrl?: string;
  audioTitle?: string;
  telegramChatId?: string;
  agenda?: AgendaItem[];
  dressCode?: DressCodeConfig;
  /** Per-invitation style overrides (merged over template.styles) */
  customStyles?: Partial<TemplateStyleOverrides>;
  /** User-selected / uploaded images */
  coverImage?: string;
  venueImage?: string;
  rsvps?: Rsvp[];
  createdAt: string;
  updatedAt: string;
}
