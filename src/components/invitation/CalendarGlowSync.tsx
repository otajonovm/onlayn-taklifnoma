import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarHeart, Clock, Check, Heart, Sparkles } from 'lucide-react';
import { BRAND } from '../../config/themes';

interface CalendarGlowSyncProps {
  eventDate: string;
  eventTitle: string;
  venueName?: string;
  locationAddress?: string;
  accentColor?: string;
}

export const CalendarGlowSync: React.FC<CalendarGlowSyncProps> = ({
  eventDate,
  eventTitle,
  venueName = 'Tantanalar Saroyi',
  locationAddress = 'Toshkent sh.',
  accentColor = BRAND.accent,
}) => {
  const [added, setAdded] = useState(false);
  const [dayTouched, setDayTouched] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const parseDateObj = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) throw new Error('Invalid Date');
      return d;
    } catch {
      return new Date(2026, 7, 16, 18, 0);
    }
  };

  const dateObj = parseDateObj(eventDate);
  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();
  const targetDay = dateObj.getDate();

  const monthsUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ];
  const daysOfWeekUz = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  const monthName = monthsUz[monthIndex];
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const firstDayObj = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let firstDayIndex = firstDayObj.getDay() - 1;
  if (firstDayIndex < 0) firstDayIndex = 6;

  const handleAddToGoogleCalendar = () => {
    try {
      const startDate = dateObj;
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
      const formatIsoUtc = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const title = encodeURIComponent(eventTitle);
      const details = encodeURIComponent(
        `Sizni ${eventTitle} tantanasiga lutfan taklif etamiz!\nJoylashuv: ${venueName} (${locationAddress})`
      );
      const location = encodeURIComponent(`${venueName}, ${locationAddress}`);
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatIsoUtc(startDate)}/${formatIsoUtc(endDate)}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
      setAdded(true);
      setTimeout(() => setAdded(false), 4000);
    } catch {
      // ignore
    }
  };

  const handleWeddingDayClick = () => {
    setDayTouched(true);
    setTimeout(() => setDayTouched(false), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="my-0 relative max-w-md mx-auto overflow-hidden bg-transparent"
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      {/* Soft ambient wash */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: `radial-gradient(circle, ${accentColor}55 0%, transparent 70%)` }}
      />

      {/* Decorative corner flourishes */}
      <svg className="absolute top-3 left-3 w-8 h-8 opacity-40 pointer-events-none" viewBox="0 0 32 32" fill="none">
        <path d="M2 30 C2 12, 12 2, 30 2" stroke={accentColor} strokeWidth="1" />
        <path d="M8 30 C8 16, 16 8, 30 8" stroke={accentColor} strokeWidth="0.6" opacity="0.6" />
      </svg>
      <svg className="absolute top-3 right-3 w-8 h-8 opacity-40 pointer-events-none rotate-90" viewBox="0 0 32 32" fill="none">
        <path d="M2 30 C2 12, 12 2, 30 2" stroke={accentColor} strokeWidth="1" />
        <path d="M8 30 C8 16, 16 8, 30 8" stroke={accentColor} strokeWidth="0.6" opacity="0.6" />
      </svg>

      <div className="relative z-10 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
            style={{
              color: accentColor,
              backgroundColor: `${accentColor}12`,
              border: `1px solid ${BRAND.borderAccent}`,
            }}
          >
            <CalendarHeart className="w-3.5 h-3.5" />
            <span>Save the Date</span>
          </motion.div>

          {/* Hero typography: giant day */}
          <div className="flex flex-col items-center gap-1">
            <motion.button
              type="button"
              onClick={handleWeddingDayClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative cursor-pointer group outline-none"
              aria-label={`${targetDay} ${monthName} — bizning kunimiz`}
            >
              <span
                className="block text-7xl sm:text-8xl font-serif font-normal leading-none tracking-tight transition-colors"
                style={{ color: BRAND.text }}
              >
                {String(targetDay).padStart(2, '0')}
              </span>
              {/* Soft gold ring on hover / touch */}
              <motion.span
                className="absolute inset-0 -m-3 rounded-full pointer-events-none"
                style={{ border: `1px solid ${accentColor}` }}
                animate={
                  dayTouched
                    ? { scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }
                    : { opacity: 0.25, scale: 1 }
                }
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
              <span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: accentColor }}
              />
            </motion.button>

            <p className="text-lg font-serif mt-2" style={{ color: BRAND.text }}>
              {monthName}
              <span className="mx-2 font-light" style={{ color: accentColor }}>·</span>
              {year}
            </p>

            <AnimatePresence>
              {dayTouched && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 text-xs italic flex items-center gap-1.5"
                  style={{ color: accentColor }}
                >
                  <Heart className="w-3 h-3" fill={accentColor} />
                  Bizning baxtli kunimiz
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider ornament */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-12" style={{ backgroundColor: BRAND.borderAccent }} />
          <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <div className="h-px w-12" style={{ backgroundColor: BRAND.borderAccent }} />
        </div>

        {/* Interactive month grid */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: BRAND.bg, border: `1px solid ${BRAND.border}` }}
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
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isTarget = dayNum === targetDay;
              const isHovered = hoveredDay === dayNum && !isTarget;

              return (
                <motion.button
                  key={`day-${dayNum}`}
                  type="button"
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.02 * dayNum,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setHoveredDay(dayNum)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={isTarget ? handleWeddingDayClick : undefined}
                  className="relative aspect-square flex items-center justify-center outline-none"
                  style={{ cursor: isTarget ? 'pointer' : 'default' }}
                >
                  {isTarget ? (
                    <span className="relative flex items-center justify-center w-9 h-9">
                      {/* Pulsing aura */}
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: `${accentColor}30` }}
                        animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0.15, 0.55] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif font-medium text-white shadow-md"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 6px 18px ${accentColor}55`,
                        }}
                      >
                        {dayNum}
                      </motion.span>
                      <Heart
                        className="absolute -top-0.5 -right-0.5 w-3 h-3 z-20"
                        style={{ color: accentColor }}
                        fill={accentColor}
                      />
                    </span>
                  ) : (
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200"
                      style={{
                        color: isHovered ? BRAND.text : BRAND.muted,
                        backgroundColor: isHovered ? `${accentColor}14` : 'transparent',
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      {dayNum}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Time & venue strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-5 flex items-center justify-between gap-3 px-1"
        >
          <div className="text-left min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: accentColor }}>
              Vaqt
            </p>
            <p className="text-sm font-serif flex items-center gap-1.5" style={{ color: BRAND.text }}>
              <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
              Soat {timeStr}
            </p>
          </div>
          <div className="w-px h-8 self-center" style={{ backgroundColor: BRAND.border }} />
          <div className="text-right min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] mb-0.5" style={{ color: accentColor }}>
              Joy
            </p>
            <p className="text-sm font-serif truncate" style={{ color: BRAND.text }} title={venueName}>
              {venueName}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToGoogleCalendar}
          className="mt-6 w-full py-3.5 px-4 rounded-full font-medium text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: added ? BRAND.text : accentColor,
            color: BRAND.white,
          }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Kalendarga saqlandi
              </motion.span>
            ) : (
              <motion.span
                key="cta"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <CalendarHeart className="w-4 h-4" />
                Google Kalendarga saqlash
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};
