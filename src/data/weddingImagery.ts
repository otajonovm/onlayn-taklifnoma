/** Curated romantic wedding photography (Unsplash CDN) */
export const WEDDING_IMAGES = {
  /** Soft ceremony / couple atmosphere */
  ceremony:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  /** Hands with wedding rings */
  rings:
    'https://images.unsplash.com/photo-1515934752419-aa85c34dda0d?auto=format&fit=crop&w=900&q=80',
  /** Close-up gold wedding bands */
  ringsClose:
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80',
  /** Floral wedding table / romantic venue */
  venue:
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
  /** Soft bouquet / romantic detail */
  bouquet:
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
  /** Candlelit / evening romance */
  evening:
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
} as const;

export type WeddingImageKey = keyof typeof WEDDING_IMAGES;
