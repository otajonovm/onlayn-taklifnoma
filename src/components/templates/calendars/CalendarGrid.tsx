import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarHeart, Clock, Check, Heart, Sparkles } from 'lucide-react';
import { BRAND } from '@/config/themes';

/** WD-101 — Full 7-column monthly grid calendar */
export interface CalendarVariantProps {
  eventDate: string;
  eventTitle: string;
  venueName?: string;
  locationAddress?: string;
  accentColor?: string;
  textColor?: string;
  saveTheDateLabel?: string;
  dayTouchedLabel?: string;
  monthNamesUz?: string[];
  daysOfWeekUz?: string[];
}

function parseDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) throw new Error('Invalid');
    return d;
  } catch {
    return new Date(2026, 7, 16, 18, 0);
  }
}

function openGoogleCal(
  dateObj: Date,
  eventTitle: string,
  venueName: string,
  locationAddress: string
) {
  const endDate = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${fmt(dateObj)}/${fmt(endDate)}&details=${encodeURIComponent(`Sizni ${eventTitle} tantanasiga taklif etamiz!\nJoylashuv: ${venueName} (${locationAddress})`)}&location=${encodeURIComponent(`${venueName}, ${locationAddress}`)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export const CalendarGrid: React.FC<CalendarVariantProps> = ({
  eventDate,
  eventTitle,
  venueName = 'Tantanalar Saroyi',
  locationAddress = 'Toshkent sh.',
  accentColor = BRAND.accent,
  textColor = BRAND.text,
  saveTheDateLabel = 'Save the Date',
  dayTouchedLabel = 'Bizning baxtli kunimiz',
  monthNamesUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ],
  daysOfWeekUz = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
}) => {
  const [added, setAdded] = useState(false);
  const [dayTouched, setDayTouched] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const dateObj = parseDate(eventDate);
  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();
  const targetDay = dateObj.getDate();
  const monthName = monthNamesUz[monthIndex];
  const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

  const firstDayObj = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let firstDayIndex = firstDayObj.getDay() - 1;
  if (firstDayIndex < 0) firstDayIndex = 6;

  return (
    <div className="my-0 relative max-w-md mx-auto text-center">
      <div
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
        style={{
          color: accentColor,
          backgroundColor: `${accentColor}12`,
          border: `1px solid ${accentColor}33`,
        }}
      >
        <CalendarHeart className="w-3.5 h-3.5" />
        <span>{saveTheDateLabel}</span>
      </div>

      <p className="text-lg font-serif mb-4" style={{ color: textColor }}>
        {monthName}
        <span className="mx-2" style={{ color: accentColor }}>·</span>
        {year}
      </p>

      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: '#FDFBF7', border: `1px solid ${accentColor}40` }}
      >
        <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
          {daysOfWeekUz.map((d) => (
            <div
              key={d}
              className="py-1.5 text-[10px] uppercase tracking-wider font-medium"
              style={{ color: BRAND.muted }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`e-${idx}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isTarget = dayNum === targetDay;
            const isHovered = hoveredDay === dayNum && !isTarget;

            return (
              <button
                key={dayNum}
                type="button"
                onMouseEnter={() => setHoveredDay(dayNum)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => {
                  if (!isTarget) return;
                  setDayTouched(true);
                  setTimeout(() => setDayTouched(false), 2200);
                }}
                className="relative aspect-square flex items-center justify-center outline-none"
                style={{ cursor: isTarget ? 'pointer' : 'default' }}
              >
                {isTarget ? (
                  <span className="relative flex items-center justify-center w-9 h-9">
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: `${accentColor}30` }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0.15, 0.55] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span
                      className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {dayNum}
                    </span>
                  </span>
                ) : (
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                    style={{
                      color: isHovered ? textColor : BRAND.muted,
                      backgroundColor: isHovered ? `${accentColor}14` : 'transparent',
                    }}
                  >
                    {dayNum}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {dayTouched && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs italic flex items-center justify-center gap-1.5"
            style={{ color: accentColor }}
          >
            <Heart className="w-3 h-3" fill={accentColor} />
            {dayTouchedLabel}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-3 px-1">
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: accentColor }}>
            Vaqt
          </p>
          <p className="text-sm font-serif flex items-center gap-1.5" style={{ color: textColor }}>
            <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
            Soat {timeStr}
          </p>
        </div>
        <div className="w-px h-8" style={{ backgroundColor: BRAND.border }} />
        <div className="text-right flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: accentColor }}>
            Joy
          </p>
          <p className="text-sm font-serif truncate" style={{ color: textColor }}>
            {venueName}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          openGoogleCal(dateObj, eventTitle, venueName, locationAddress);
          setAdded(true);
          setTimeout(() => setAdded(false), 4000);
        }}
        className="mt-6 w-full py-3.5 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
        style={{ backgroundColor: added ? textColor : accentColor, color: '#fff' }}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" /> Kalendarga saqlandi
          </>
        ) : (
          <>
            <CalendarHeart className="w-4 h-4" /> Google Kalendarga saqlash
          </>
        )}
      </button>
    </div>
  );
};
