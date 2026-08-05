/** Shared design tokens for wedding invitation templates */

export type BorderStyleToken = 'classic_single' | 'double_fine' | 'glass_panel' | 'borderless';
export type BorderRadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type FontHeaderToken =
  | 'Cormorant Garamond'
  | 'Playfair Display'
  | 'Cinzel'
  | 'Great Vibes'
  | 'Plus Jakarta Sans';

export type FontBodyToken = 'Plus Jakarta Sans' | 'Inter' | 'Roboto' | 'Lora';

export interface TemplateStyleOverrides {
  // Colors
  colorBg: string;
  colorCardBg: string;
  colorTextPrimary: string;
  colorTextSecondary: string;
  colorAccent: string;
  colorBorder: string;

  // Borders & Frames
  borderStyle: BorderStyleToken;
  borderRadius: BorderRadiusToken;

  // Typography
  fontHeader: FontHeaderToken;
  fontBody: FontBodyToken;
}

export const DEFAULT_STYLE_OVERRIDES: TemplateStyleOverrides = {
  colorBg: '#FDFBF7',
  colorCardBg: '#FFFFFF',
  colorTextPrimary: '#1E293B',
  colorTextSecondary: '#475569',
  colorAccent: '#D4A373',
  colorBorder: 'rgba(212, 163, 115, 0.4)',
  borderStyle: 'classic_single',
  borderRadius: 'md',
  fontHeader: 'Cormorant Garamond',
  fontBody: 'Plus Jakarta Sans',
};

export interface StylePalettePreset {
  id: string;
  name: string;
  nameUz: string;
  partial: Partial<TemplateStyleOverrides>;
}

export const STYLE_PALETTE_PRESETS: StylePalettePreset[] = [
  {
    id: 'ivory_sand',
    name: 'Ivory & Sand Gold',
    nameUz: 'Fil suyagi & Qum oltin',
    partial: {
      colorBg: '#FDFBF7',
      colorCardBg: '#FFFFFF',
      colorTextPrimary: '#1E293B',
      colorTextSecondary: '#64748B',
      colorAccent: '#D4A373',
      colorBorder: 'rgba(212, 163, 115, 0.4)',
    },
  },
  {
    id: 'pure_slate',
    name: 'Pure White & Slate',
    nameUz: 'Oq & Slate',
    partial: {
      colorBg: '#FFFFFF',
      colorCardBg: '#FFFFFF',
      colorTextPrimary: '#0F172A',
      colorTextSecondary: '#334155',
      colorAccent: '#C5A059',
      colorBorder: 'rgba(197, 160, 89, 0.45)',
    },
  },
  {
    id: 'milk_rose',
    name: 'Milk Cream & Rose',
    nameUz: 'Sut krem & Atirgul',
    partial: {
      colorBg: '#FBF7F4',
      colorCardBg: '#FFFCFB',
      colorTextPrimary: '#3D2C2E',
      colorTextSecondary: '#8B6F72',
      colorAccent: '#C4878A',
      colorBorder: 'rgba(196, 135, 138, 0.4)',
    },
  },
  {
    id: 'minimal_graphite',
    name: 'Minimal Graphite',
    nameUz: 'Minimal Grafit',
    partial: {
      colorBg: '#F8F8F7',
      colorCardBg: '#FFFFFF',
      colorTextPrimary: '#1A1A1A',
      colorTextSecondary: '#525252',
      colorAccent: '#6B6B6B',
      colorBorder: 'rgba(26, 26, 26, 0.2)',
    },
  },
];

export const RADIUS_MAP: Record<BorderRadiusToken, string> = {
  none: '0px',
  sm: '6px',
  md: '12px',
  lg: '20px',
  full: '9999px',
};

export const HEADER_FONT_OPTIONS: FontHeaderToken[] = [
  'Cormorant Garamond',
  'Playfair Display',
  'Cinzel',
  'Great Vibes',
  'Plus Jakarta Sans',
];

export const BODY_FONT_OPTIONS: FontBodyToken[] = [
  'Plus Jakarta Sans',
  'Inter',
  'Roboto',
  'Lora',
];

export const BORDER_STYLE_OPTIONS: Array<{
  value: BorderStyleToken;
  label: string;
  hint: string;
}> = [
  { value: 'classic_single', label: 'Classic Single', hint: '1px thin clean line' },
  { value: 'double_fine', label: 'Double Fine', hint: 'Outer thin + inner dashed' },
  { value: 'glass_panel', label: 'Glass Panel', hint: 'Backdrop blur glass' },
  { value: 'borderless', label: 'Borderless', hint: 'Subtle shadow only' },
];

/** Visual frame templates for the builder picker */
export interface FrameTemplateOption {
  id: BorderStyleToken;
  name: string;
  nameUz: string;
  description: string;
}

export const FRAME_TEMPLATES: FrameTemplateOption[] = [
  {
    id: 'classic_single',
    name: 'Classic Gold',
    nameUz: 'Klassik oltin',
    description: 'Yupqa 1px toza chiziq',
  },
  {
    id: 'double_fine',
    name: 'Double Fine',
    nameUz: 'Ikki qatlam',
    description: 'Tashqi chiziq + ichki dashed',
  },
  {
    id: 'glass_panel',
    name: 'Glass Panel',
    nameUz: 'Shisha panel',
    description: 'Blur + yumshoq shisha effekt',
  },
  {
    id: 'borderless',
    name: 'Minimal Soft',
    nameUz: 'Minimal soyali',
    description: 'Chegarasiz, yumshoq soya',
  },
];

export interface InvitationImages {
  coverImage: string;
  venueImage: string;
}

export const DEFAULT_INVITATION_IMAGES: InvitationImages = {
  coverImage:
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80',
  venueImage:
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
};

/** Shallow merge: partial overrides win over base. */
export function mergeStyleOverrides(
  base: TemplateStyleOverrides,
  partial?: Partial<TemplateStyleOverrides> | null
): TemplateStyleOverrides {
  if (!partial) return { ...base };
  const out: TemplateStyleOverrides = { ...base };
  for (const key of Object.keys(partial) as Array<keyof TemplateStyleOverrides>) {
    const v = partial[key];
    if (v !== undefined && v !== null && v !== '') {
      (out as any)[key] = v;
    }
  }
  return out;
}

/** Google Fonts family query segment for a display name */
export function fontToGoogleQuery(family: string): string {
  return family.replace(/ /g, '+');
}
