/** Placeholder templates for non-wedding categories (Faza 2 expansion) */
export const CATEGORY_TEMPLATES = {
  'KS-101': {
    id: 'KS-101',
    name: 'Sunnat Bayrami',
    category: 'kids_sunnat' as const,
    thumbnail: 'https://images.unsplash.com/photo-1515488042361-ee00e3ddd4e4?w=400',
    isPremium: false,
    threeDModel: 'crown.glb',
    particleType: 'confetti',
  },
  'ED-101': {
    id: 'ED-101',
    name: "Bitiruv To'y",
    category: 'education' as const,
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    isPremium: false,
    threeDModel: 'academic_book.glb',
    particleType: 'gold_dust',
  },
  'CR-101': {
    id: 'CR-101',
    name: 'Korporativ Tadbir',
    category: 'corporate' as const,
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    isPremium: true,
    threeDModel: 'wedding_rings.glb',
    particleType: 'gold_dust',
  },
} as const;

export type CategoryTemplateId = keyof typeof CATEGORY_TEMPLATES;
