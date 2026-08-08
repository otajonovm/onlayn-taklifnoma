import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarHeart, Clock, Check } from 'lucide-react';
import { BRAND } from '@/config/themes';
import type { CalendarVariantProps } from './CalendarGrid';

/** WD-102 — Large typographic date hero (big day + side badge), no month grid */
export const CalendarTypographic: React.FC<CalendarVariantProps> = ({
  eventDate,
  eventTitle,
  showTime = true,
  venueName = 'Tantanalar Saroyi',
  locationAddress = 'Toshkent sh.',
  accentColor = '#C5A059',
  textColor = '#0F172A',
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
      return isNaN(d.getTime()) ? new Date(2026, 8, 25, 17, 0) : d;
    } catch {
      return new Date(2026, 8, 25, 17, 0);
    }
  })();

  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthName = monthNamesUz[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  const weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const weekday = weekdays[dateObj.getDay()];

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
    <div className="relative text-left max-w-md">
      <p
        className="text-[10px] uppercase tracking-[0.28em] font-medium mb-4"
        style={{ color: accentColor }}
      >
        {saveTheDateLabel}
      </p>

      <div className="flex items-end gap-5">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif leading-none tracking-tight"
          style={{
            fontSize: 'clamp(5.5rem, 18vw, 7.5rem)',
            color: textColor,
            lineHeight: 0.85,
          }}
        >
          {day}
        </motion.span>

        <div
          className="mb-2 px-3 py-3 rounded-2xl border backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderColor: `${accentColor}40`,
            boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
          }}
        >
          <p className="text-[10px] uppercase tracking-wider" style={{ color: accentColor }}>
            {weekday}
          </p>
          <p className="text-base font-serif mt-0.5" style={{ color: textColor }}>
            {monthName}
          </p>
          <p className="text-sm" style={{ color: BRAND.muted }}>
            {year}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {showTime ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-sm font-serif" style={{ color: textColor }}>
              <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
              {timeStr}
            </span>
            <span className="w-px h-4" style={{ backgroundColor: `${accentColor}40` }} />
          </>
        ) : null}
        <span className="text-sm truncate" style={{ color: BRAND.muted }}>
          {venueName}
        </span>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer border backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderColor: `${accentColor}50`,
          color: textColor,
        }}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" style={{ color: accentColor }} /> Saqlandi
          </>
        ) : (
          <>
            <CalendarHeart className="w-4 h-4" style={{ color: accentColor }} /> Kalendarga
          </>
        )}
      </button>
    </div>
  );
};
