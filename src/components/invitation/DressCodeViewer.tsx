import React from 'react';
import { Shirt } from 'lucide-react';
import { DressCodeConfig } from '../../types';
import { BRAND } from '../../config/themes';

interface DressCodeViewerProps {
  dressCode?: DressCodeConfig;
  accentColor?: string;
  textColor?: string;
}

const DEFAULT_DRESS_CODE: DressCodeConfig = {
  title: 'Klassik & Tantanali Dress Code',
  description: 'Smoking, bayramona kostyum-shim hamda nafis kechki liboslar.',
  colors: [
    { name: 'Qum Oltin', hex: BRAND.accent },
    { name: 'Slate', hex: BRAND.text },
    { name: 'Marvarid', hex: '#FAF6F0' },
  ],
};

export const DressCodeViewer: React.FC<DressCodeViewerProps> = ({
  dressCode,
  accentColor = BRAND.accent,
  textColor = BRAND.text,
}) => {
  const config = dressCode || DEFAULT_DRESS_CODE;

  return (
    <div
      className="my-0 p-1 rounded-none border-0 max-w-lg mx-auto text-center space-y-4 bg-transparent"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mx-auto border"
        style={{ backgroundColor: `${accentColor}12`, borderColor: accentColor, color: accentColor }}
      >
        <Shirt className="w-5 h-5" />
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: accentColor }}>
          — Dress Code —
        </p>
        <h3 className="text-lg font-serif" style={{ color: textColor }}>
          {config.title}
        </h3>
        <p className="text-xs max-w-xs mx-auto" style={{ color: BRAND.muted }}>
          {config.description}
        </p>
      </div>

      {config.colors && config.colors.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] uppercase tracking-wider mb-2.5" style={{ color: BRAND.muted }}>
            Tavsiya etiladigan ranglar
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {config.colors.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.hex, outline: `1px solid ${BRAND.borderAccent}` }}
                  title={color.name}
                />
                <span className="text-[10px]" style={{ color: textColor }}>
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
