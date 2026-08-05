/** Dynamically inject Google Fonts <link> for selected families (Vite SPA). */

const loadedFamilies = new Set<string>();

const FONT_SPECS: Record<string, string> = {
  'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400',
  'Playfair Display': 'Playfair+Display:ital,wght@0,400;0,600;0,700;1,400',
  Cinzel: 'Cinzel:wght@400;600;700',
  'Great Vibes': 'Great+Vibes',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400',
  Inter: 'Inter:wght@400;500;600;700',
  Roboto: 'Roboto:wght@400;500;700',
  Lora: 'Lora:ital,wght@0,400;0,600;1,400',
};

export function ensureFontsLoaded(...families: Array<string | undefined | null>) {
  if (typeof document === 'undefined') return;

  const needed = families.filter((f): f is string => !!f && !loadedFamilies.has(f));
  if (needed.length === 0) return;

  const specs = needed.map((f) => FONT_SPECS[f] || f.replace(/ /g, '+')).filter(Boolean);
  if (specs.length === 0) return;

  const href = `https://fonts.googleapis.com/css2?${specs.map((s) => `family=${s}`).join('&')}&display=swap`;
  const id = `gf-${needed.join('-').replace(/\s+/g, '_')}`;

  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  needed.forEach((f) => loadedFamilies.add(f));
}
