import type { AgendaItem, DressCodeColor, Invitation } from '@/types';
import type { InvitationImages, TemplateStyleOverrides } from '@/types/styleTokens';
import { DEFAULT_INVITATION_IMAGES, mergeStyleOverrides } from '@/types/styleTokens';
import { BRAND } from '@/config/themes';
import { WEDDING_TEMPLATES } from '@/config/weddingTemplates';

export const BUILDER_DRAFT_KEY = 'ot_builder_draft_v1';

export interface BuilderDraft {
  selectedTemplateId: string;
  brideName: string;
  groomName: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  locationAddress: string;
  qizBazmiTitle?: string;
  qizBazmiDate?: string;
  qizBazmiVenue?: string;
  qizBazmiAddress?: string;
  yandexUrl: string;
  googleUrl: string;
  twoGisUrl: string;
  telegramChatId: string;
  agenda: AgendaItem[];
  dressCodeTitle: string;
  dressCodeDesc: string;
  dressCodeColors: DressCodeColor[];
  styleOverrides: TemplateStyleOverrides;
  images: InvitationImages;
  audioUrl?: string;
  audioTitle?: string;
  /** Oxirgi yaratilgan/yangilangan taklifnoma — qayta saqlashda PUT */
  createdInvitationId?: string;
  savedAt: string;
}

export function loadBuilderDraft(): BuilderDraft | null {
  try {
    const raw = localStorage.getItem(BUILDER_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BuilderDraft;
    if (!parsed?.selectedTemplateId || !parsed?.styleOverrides) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveBuilderDraft(draft: Omit<BuilderDraft, 'savedAt'>): void {
  const payload: BuilderDraft = {
    ...draft,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(BUILDER_DRAFT_KEY, JSON.stringify(payload));
    return;
  } catch {
    // Quota exceeded — most likely large base64 uploads
  }

  // Retry without inline uploads so text and styles still survive a reload
  try {
    const stripped: BuilderDraft = {
      ...payload,
      images: {
        coverImage: isInlineImage(payload.images.coverImage) ? '' : payload.images.coverImage,
        venueImage: isInlineImage(payload.images.venueImage) ? '' : payload.images.venueImage,
      },
    };
    localStorage.setItem(BUILDER_DRAFT_KEY, JSON.stringify(stripped));
  } catch (err) {
    console.warn('[builderDraft] save failed:', err);
  }
}

function isInlineImage(url: string): boolean {
  return typeof url === 'string' && url.startsWith('data:');
}

export function clearBuilderDraft(): void {
  try {
    localStorage.removeItem(BUILDER_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/** Previewdan “Tahrirlash” — serverdagi taklifnomani builder qoralamasiga yozadi */
export function seedBuilderDraftFromInvitation(invitation: Invitation): void {
  const toLocalInput = (iso?: string, fallback = '2026-08-16T18:00') => {
    if (!iso) return fallback;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return fallback;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  saveBuilderDraft({
    selectedTemplateId: invitation.templateId || 'WD-101',
    brideName: invitation.brideName || '',
    groomName: invitation.groomName || '',
    eventTitle: invitation.eventTitle || "Nikoh To'yi Marosimi",
    eventType: invitation.eventType || "Nikoh To'yi",
    eventDate: toLocalInput(invitation.eventDate),
    venueName: invitation.venueName || '',
    locationAddress: invitation.locationAddress || '',
    qizBazmiTitle: invitation.qizBazmiTitle || 'Qiz bazmi',
    qizBazmiDate: invitation.qizBazmiDate
      ? toLocalInput(invitation.qizBazmiDate, '2026-08-15T16:00')
      : invitation.eventDate
        ? toLocalInput(
            new Date(new Date(invitation.eventDate).getTime() - 24 * 60 * 60 * 1000).toISOString(),
            '2026-08-15T16:00'
          )
        : '2026-08-15T16:00',
    qizBazmiVenue: invitation.qizBazmiVenue || '',
    qizBazmiAddress: invitation.qizBazmiAddress || '',
    yandexUrl: invitation.yandexUrl || 'https://yandex.uz/maps',
    googleUrl: invitation.googleUrl || 'https://maps.google.com',
    twoGisUrl: invitation.twoGisUrl || 'https://2gis.uz',
    telegramChatId: invitation.telegramChatId || '',
    agenda: Array.isArray(invitation.agenda) ? invitation.agenda : [],
    dressCodeTitle:
      invitation.dressCode?.title || 'Black Tie / Rasmiy Kostyum & Kechki Libos',
    dressCodeDesc:
      invitation.dressCode?.description ||
      "Tantanamiz fil suyagi va qum-oltin bezaklarda o'tkaziladi.",
    dressCodeColors: invitation.dressCode?.colors?.length
      ? invitation.dressCode.colors
      : [
          { name: 'Qum Oltin', hex: BRAND.accent },
          { name: 'Slate', hex: BRAND.text },
          { name: 'Marvarid', hex: '#FAF6F0' },
        ],
    styleOverrides: mergeStyleOverrides(
      WEDDING_TEMPLATES[invitation.templateId]?.styles ||
        WEDDING_TEMPLATES['WD-101'].styles,
      invitation.customStyles
    ),
    images: {
      coverImage: invitation.coverImage || DEFAULT_INVITATION_IMAGES.coverImage,
      venueImage: invitation.venueImage || DEFAULT_INVITATION_IMAGES.venueImage,
    },
    audioUrl: invitation.audioUrl,
    audioTitle: invitation.audioTitle,
    createdInvitationId: invitation.id,
  });
}
