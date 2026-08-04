/** Minimalist high-end wedding brand tokens */
export const BRAND = {
  bg: '#FDFBF7',
  white: '#FFFFFF',
  text: '#1E293B',
  accent: '#D4A373',
  border: '#E5E7EB',
  borderAccent: 'rgba(212, 163, 115, 0.2)',
  muted: '#64748B',
} as const;

export type PaletteId = 'ivory_sand';

export interface ThemePalette {
  id: PaletteId;
  name: string;
  nameUz: string;
  bg: string;
  cardBg: string;
  accent: string;
  text: string;
  primaryColor: string;
  envelopeColor: string;
  glassBg: string;
  glassBorder: string;
  isDark: boolean;
  fontHeader: string;
}

export const PALETTES: Record<PaletteId, ThemePalette> = {
  ivory_sand: {
    id: 'ivory_sand',
    name: 'Ivory & Soft Gold',
    nameUz: "Fil Suyagi va Mayin Oltin",
    bg: BRAND.bg,
    cardBg: BRAND.white,
    accent: BRAND.accent,
    text: BRAND.text,
    primaryColor: BRAND.white,
    envelopeColor: '#FAF6F0',
    glassBg: 'bg-white/90 backdrop-blur-md',
    glassBorder: 'border-[#D4A373]/20',
    isDark: false,
    fontHeader: 'Playfair Display',
  },
};

export const DEFAULT_PALETTE_ID: PaletteId = 'ivory_sand';

export const WEDDING_CATEGORY_LABEL = "To'y & Nikoh";
