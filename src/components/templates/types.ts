import type { Invitation, AgendaItem, ThemeConfig } from '@/types';
import type { WeddingTemplateContent } from '@/config/weddingTemplates';
import type { TemplateStyleOverrides } from '@/types/styleTokens';
import { WEDDING_IMAGES } from '@/data/weddingImagery';

/**
 * Identical props contract for every template layout (WD-101 / WD-102 / WD-103).
 * Layouts only change visual structure — never the data shape.
 */
export interface WeddingData {
  invitationId: string;
  hostName: string;
  eventTitle: string;
  eventType: string;
  groomName?: string;
  brideName?: string;
  monogram: string;
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
  telegramChatId?: string;
  agenda: AgendaItem[];
  styles: TemplateStyleOverrides;
  content: WeddingTemplateContent;
  theme: ThemeConfig;
  coverImage: string;
  venueImage: string;
  onRsvpSuccess?: () => void;
}

export interface WeddingLayoutProps {
  data: WeddingData;
}

export function invitationToWeddingData(input: {
  invitation: Invitation;
  styles: TemplateStyleOverrides;
  content: WeddingTemplateContent;
  theme: ThemeConfig;
  onRsvpSuccess?: () => void;
}): WeddingData {
  const { invitation, styles, content, theme, onRsvpSuccess } = input;
  const { groom, bride } = splitCouple(content.hero.coupleNames);

  return {
    invitationId: invitation.id,
    hostName: invitation.hostName,
    eventTitle: invitation.eventTitle || content.hero.title,
    eventType: invitation.eventType,
    groomName: invitation.groomName || groom,
    brideName: invitation.brideName || bride,
    monogram: content.hero.monogram,
    eventDate:
      invitation.eventDate ||
      `${content.calendar.eventDate}T${content.calendar.eventTime}:00`,
    eventShowTime: invitation.eventShowTime !== false,
    venueName: invitation.venueName || content.venue.name,
    locationAddress: invitation.locationAddress || content.venue.address,
    qizBazmiTitle: invitation.qizBazmiTitle || 'Qiz bazmi',
    qizBazmiDate: invitation.qizBazmiDate,
    qizBazmiShowTime: invitation.qizBazmiShowTime !== false,
    qizBazmiVenue: invitation.qizBazmiVenue,
    qizBazmiAddress: invitation.qizBazmiAddress,
    yandexUrl: invitation.yandexUrl || content.venue.yandexNavUrl,
    googleUrl: invitation.googleUrl,
    twoGisUrl: invitation.twoGisUrl,
    telegramChatId: invitation.telegramChatId,
    agenda: Array.isArray(invitation.agenda)
      ? invitation.agenda
      : (content.agenda?.items ?? []).map((i) => ({
          time: i.time,
          title: i.title,
          description: i.description,
          iconName: i.iconName,
        })),
    styles,
    content,
    theme,
    coverImage:
      invitation.coverImage ||
      content.hero.coverImage ||
      WEDDING_IMAGES.ringsClose,
    venueImage: invitation.venueImage || WEDDING_IMAGES.venue,
    onRsvpSuccess,
  };
}

function splitCouple(coupleNames: string): { groom?: string; bride?: string } {
  const raw = coupleNames?.trim();
  if (!raw) return {};
  if (raw.includes('&')) {
    const parts = raw.split('&').map((s) => s.trim());
    return { groom: parts[0], bride: parts[1] };
  }
  return { groom: raw };
}
