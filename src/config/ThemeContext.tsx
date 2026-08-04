import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaletteId, ThemePalette, PALETTES, DEFAULT_PALETTE_ID } from './themes';

interface ThemeContextType {
  paletteId: PaletteId;
  palette: ThemePalette;
  setPaletteId: (id: PaletteId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paletteId, setPaletteIdState] = useState<PaletteId>(() => {
    const saved = localStorage.getItem('onlayn_taklifnoma_palette');
    if (saved && saved in PALETTES) {
      return saved as PaletteId;
    }
    return DEFAULT_PALETTE_ID;
  });

  const setPaletteId = (id: PaletteId) => {
    setPaletteIdState(id);
    localStorage.setItem('onlayn_taklifnoma_palette', id);
  };

  const palette = PALETTES[paletteId] || PALETTES[DEFAULT_PALETTE_ID];

  return (
    <ThemeContext.Provider value={{ paletteId, palette, setPaletteId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      paletteId: DEFAULT_PALETTE_ID,
      palette: PALETTES[DEFAULT_PALETTE_ID],
      setPaletteId: () => {},
    };
  }
  return context;
};
