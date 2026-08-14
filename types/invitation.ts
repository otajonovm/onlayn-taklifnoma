export type InvitationStatus = 'PENDING' | 'ACTIVE';
export type RsvpStatus = 'ATTENDING' | 'DECLINED';
export type TemplateCategory = 'wedding' | 'kids_sunnat' | 'education' | 'corporate';

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

export interface RsvpDTO {
  id: string;
  invitationId: string;
  guestName: string;
  role?: string;
  status: RsvpStatus;
  plusOne: number;
  wishes?: string;
  createdAt: string;
}

export interface InvitationDTO {
  id: string;
  templateId: string;
  status: InvitationStatus;
  telegramChatId?: string;
  telegramUserId?: string;
  hostName: string;
  brideName?: string;
  groomName?: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventShowTime?: boolean;
  venueName: string;
  locationAddress: string;
  qizBazmiTitle?: string;
  qizBazmiDate?: string;
  qizBazmiShowTime?: boolean;
  qizBazmiVenue?: string;
  qizBazmiAddress?: string;
  yandexUrl?: string;
  googleUrl?: string;
  twoGisUrl?: string;
  audioUrl?: string;
  audioTitle?: string;
  agenda?: AgendaItem[];
  dressCode?: DressCodeConfig;
  customStyles?: Record<string, unknown>;
  coverImage?: string;
  venueImage?: string;
  rsvps?: RsvpDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationInput {
  templateId: string;
  hostName: string;
  brideName?: string;
  groomName?: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventShowTime?: boolean;
  venueName: string;
  locationAddress: string;
  qizBazmiTitle?: string;
  qizBazmiDate?: string;
  qizBazmiShowTime?: boolean;
  qizBazmiVenue?: string;
  qizBazmiAddress?: string;
  yandexUrl?: string;
  googleUrl?: string;
  twoGisUrl?: string;
  audioUrl?: string;
  audioTitle?: string;
  telegramChatId?: string;
  telegramUserId?: string;
  agenda?: AgendaItem[];
  dressCode?: DressCodeConfig;
  customStyles?: Record<string, unknown>;
  coverImage?: string;
  venueImage?: string;
}

export interface TelegramInitDataUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}
