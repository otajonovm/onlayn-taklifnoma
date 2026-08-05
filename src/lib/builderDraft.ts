import type { AgendaItem, DressCodeColor } from '@/types';
import type { InvitationImages, TemplateStyleOverrides } from '@/types/styleTokens';

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
