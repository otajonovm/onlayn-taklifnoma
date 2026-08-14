/** Paperless Post–inspired brand tokens (Emerald / Gold / Rose Gold) */
export const BRAND = {
  bg: '#FDFBF7',
  white: '#FFFFFF',
  text: '#1E293B',
  primary: '#0F5132',
  accent: '#D4AF37',
  roseGold: '#B76E79',
  border: '#E5E7EB',
  borderAccent: 'rgba(212, 175, 55, 0.25)',
  muted: '#64748B',
} as const;

export type PaletteId = 'ivory_sand' | 'emerald_gold';

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
    glassBorder: 'border-[#D4AF37]/20',
    isDark: false,
    fontHeader: 'Playfair Display',
  },
  emerald_gold: {
    id: 'emerald_gold',
    name: 'Emerald & Gold',
    nameUz: "Zumrad va Oltin",
    bg: BRAND.bg,
    cardBg: BRAND.white,
    accent: BRAND.accent,
    text: BRAND.text,
    primaryColor: BRAND.primary,
    envelopeColor: '#E8F5EE',
    glassBg: 'bg-white/90 backdrop-blur-md',
    glassBorder: 'border-[#0F5132]/15',
    isDark: false,
    fontHeader: 'Playfair Display',
  },
};

export const DEFAULT_PALETTE_ID: PaletteId = 'emerald_gold';

export const WEDDING_CATEGORY_LABEL = "To'y & Nikoh";

export const CATEGORY_LABELS: Record<string, string> = {
  wedding: WEDDING_CATEGORY_LABEL,
  kids_sunnat: "Bolalar & Sunnat",
  education: "Ta'lim",
  corporate: 'Korporativ',
};
