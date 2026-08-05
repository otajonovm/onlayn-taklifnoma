import { Template } from '../types';
import { BRAND, WEDDING_CATEGORY_LABEL } from '../config/themes';

const lightWeddingTheme = {
  primaryColor: BRAND.white,
  accentColor: BRAND.accent,
  backgroundColor: BRAND.bg,
  cardBgColor: BRAND.white,
  textColor: BRAND.text,
  fontFamily: 'serif' as const,
  envelopeColor: '#FAF6F0',
};

export const TEMPLATES: Template[] = [
  {
    id: 'blooming_white_rose',
    title: 'Gullagan Oq Atirgul',
    category: 'wedding',
    categoryLabel: WEDDING_CATEGORY_LABEL,
    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    description: "Nafis oq atirgul bezaklari va ochiluvchi konvertli minimalist to'y taklifnomasi.",
    isPremium: true,
    sampleMusicUrl: '/audio/oh-sevaman-yor.mp3',
    sampleMusicTitle: 'Oh Sevaman Yor — Ibrohim Nurmatov',
    defaultTheme: {
      ...lightWeddingTheme,
      waxSealSymbol: '❤️',
    },
  },
];
