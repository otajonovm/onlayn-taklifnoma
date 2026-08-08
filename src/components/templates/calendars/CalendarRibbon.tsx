import React, { useState } from 'react';
import { CalendarHeart, Check } from 'lucide-react';
import { BRAND } from '@/config/themes';
import type { CalendarVariantProps } from './CalendarGrid';

/** WD-103 — Horizontal inline date ribbon (editorial) */
export const CalendarRibbon: React.FC<CalendarVariantProps> = ({
  eventDate,
  eventTitle,
  showTime = true,
  venueName = 'Tantanalar Saroyi',
  locationAddress = 'Toshkent sh.',
  accentColor = BRAND.accent,
  textColor = BRAND.text,
  saveTheDateLabel = 'Save the Date',
  monthNamesUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ],
}) => {
  const [added, setAdded] = useState(false);
  const dateObj = (() => {
    try {
      const d = new Date(eventDate);
      return isNaN(d.getTime()) ? new Date(2026, 10, 14, 18, 0) : d;
    } catch {
      return new Date(2026, 10, 14, 18, 0);
    }
  })();

  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthName = monthNamesUz[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

  const handleAdd = () => {
    try {
      const end = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000);
      const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      window.open(
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${fmt(dateObj)}/${fmt(end)}&location=${encodeURIComponent(`${venueName}, ${locationAddress}`)}`,
        '_blank',
        'noopener,noreferrer'
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 4000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="w-full">
      <p
        className="text-[10px] uppercase tracking-[0.3em] text-center mb-4"
        style={{ color: accentColor }}
      >
        {saveTheDateLabel}
      </p>

      <div
        className="flex flex-wrap items-stretch justify-center border-y"
        style={{ borderColor: `${accentColor}55` }}
      >
        <div
          className="flex flex-col items-center justify-center px-5 py-4 min-w-[4.5rem] border-r"
          style={{ borderColor: `${accentColor}33`, backgroundColor: '#FDFBF7' }}
        >
          <span className="text-[10px] uppercase tracking-widest" style={{ color: accentColor }}>
            Kun
          </span>
          <span className="text-3xl font-serif leading-none mt-1" style={{ color: textColor }}>
            {day}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-4 flex-1 min-w-[8rem] bg-white">
          <span className="text-sm font-serif tracking-wide" style={{ color: textColor }}>
            {monthName} {year}
          </span>
          {showTime ? (
            <span className="text-xs mt-1" style={{ color: BRAND.muted }}>
              Soat {timeStr}
            </span>
          ) : null}
        </div>

        <div
          className="flex flex-col items-center justify-center px-5 py-4 min-w-[5rem] border-l"
          style={{ borderColor: `${accentColor}33`, backgroundColor: '#FDFBF7' }}
        >
          <span className="text-[10px] uppercase tracking-widest" style={{ color: accentColor }}>
            Joy
          </span>
          <span
            className="text-xs font-serif text-center mt-1 max-w-[6rem] leading-snug"
            style={{ color: textColor }}
            title={venueName}
          >
            {venueName}
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium cursor-pointer border-b pb-1"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Saqlandi
            </>
          ) : (
            <>
              <CalendarHeart className="w-3.5 h-3.5" /> Kalendarga qo‘shish
            </>
          )}
        </button>
      </div>
    </div>
  );
};
