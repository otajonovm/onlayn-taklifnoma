import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarHeart, Clock, Check, Heart } from 'lucide-react';
import { BRAND } from '@/config/themes';

/** WD-101 — Full 7-column monthly grid calendar */
export interface CalendarVariantProps {
  eventDate: string;
  eventTitle: string;
  /** false bo‘lsa soat ko‘rsatilmaydi */
  showTime?: boolean;
  venueName?: string;
  locationAddress?: string;
  accentColor?: string;
  textColor?: string;
  saveTheDateLabel?: string;
  dayTouchedLabel?: string;
  monthNamesUz?: string[];
  daysOfWeekUz?: string[];
  /** Ikkinchi tadbir (masalan Qiz bazmi) */
  secondaryEvent?: {
    date: string;
    title: string;
    venueName?: string;
    showTime?: boolean;
  };
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

function fmtTime(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
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

type DayMark = 'primary' | 'secondary' | 'both' | null;

function MonthGrid({
  year,
  monthIndex,
  primaryDay,
  secondaryDay,
  primaryTime,
  secondaryTime,
  accentColor,
  textColor,
  daysOfWeekUz,
  monthName,
  onPrimaryTouch,
}: {
  year: number;
  monthIndex: number;
  primaryDay: number | null;
  secondaryDay: number | null;
  primaryTime?: string;
  secondaryTime?: string;
  accentColor: string;
  textColor: string;
  daysOfWeekUz: string[];
  monthName: string;
  onPrimaryTouch?: () => void;
}) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const firstDayObj = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let firstDayIndex = firstDayObj.getDay() - 1;
  if (firstDayIndex < 0) firstDayIndex = 6;

  const markFor = (dayNum: number): DayMark => {
    const isP = primaryDay != null && dayNum === primaryDay;
    const isS = secondaryDay != null && dayNum === secondaryDay;
    if (isP && isS) return 'both';
    if (isP) return 'primary';
    if (isS) return 'secondary';
    return null;
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: '#FDFBF7', border: `1px solid ${accentColor}40` }}
    >
      <p className="text-base font-serif mb-3" style={{ color: textColor }}>
        {monthName}
        <span className="mx-2" style={{ color: accentColor }}>
          ·
        </span>
        {year}
      </p>

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
          const mark = markFor(dayNum);
          const isMarked = mark != null;
          const isHovered = hoveredDay === dayNum && !isMarked;
          const timeLabel =
            mark === 'both'
              ? `${primaryTime}/${secondaryTime}`
              : mark === 'primary'
                ? primaryTime
                : mark === 'secondary'
                  ? secondaryTime
                  : undefined;

          return (
            <button
              key={dayNum}
              type="button"
              onMouseEnter={() => setHoveredDay(dayNum)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => {
                if (mark === 'primary' || mark === 'both') onPrimaryTouch?.();
              }}
              className={`relative flex items-center justify-center outline-none ${isMarked ? 'min-h-14' : 'aspect-square'}`}
              style={{ cursor: isMarked ? 'pointer' : 'default' }}
            >
              {isMarked ? (
                <span className="relative flex flex-col items-center justify-center w-full">
                  <span className="relative flex items-center justify-center w-9 h-9">
                    {(mark === 'primary' || mark === 'both') && (
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: `${accentColor}30` }}
                        animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0.15, 0.55] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    <span
                      className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif"
                      style={
                        mark === 'secondary'
                          ? {
                              color: accentColor,
                              backgroundColor: `${accentColor}14`,
                              border: `1.5px solid ${accentColor}`,
                            }
                          : mark === 'both'
                            ? {
                                color: '#fff',
                                background: `linear-gradient(135deg, ${accentColor} 55%, ${accentColor}99 100%)`,
                                boxShadow: `inset 0 0 0 2px ${accentColor}`,
                              }
                            : {
                                color: '#fff',
                                backgroundColor: accentColor,
                              }
                      }
                    >
                      {dayNum}
                    </span>
                  </span>
                  {timeLabel && (
                    <span
                      className="mt-0.5 text-[7px] font-medium leading-none tracking-wide max-w-full truncate px-0.5"
                      style={{ color: accentColor }}
                    >
                      {timeLabel}
                    </span>
                  )}
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
  );
}

export const CalendarGrid: React.FC<CalendarVariantProps> = ({
  eventDate,
  eventTitle,
  showTime = true,
  venueName = 'Tantanalar Saroyi',
  locationAddress = 'Toshkent sh.',
  accentColor = BRAND.accent,
  textColor = BRAND.text,
  saveTheDateLabel = 'Save the Date',
  dayTouchedLabel = 'Bizning baxtli kunimiz',
  monthNamesUz = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentabr',
    'Oktabr',
    'Noyabr',
    'Dekabr',
  ],
  daysOfWeekUz = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
  secondaryEvent,
}) => {
  const [added, setAdded] = useState(false);
  const [dayTouched, setDayTouched] = useState(false);

  const primary = parseDate(eventDate);
  const secondary = secondaryEvent?.date ? parseDate(secondaryEvent.date) : null;
  const secondaryShowTime = secondaryEvent?.showTime !== false;
  const primaryTime = showTime ? fmtTime(primary) : undefined;
  const secondaryTime =
    secondary && secondaryShowTime ? fmtTime(secondary) : undefined;
  const sharedMonth = secondary ? sameMonth(primary, secondary) : true;

  return (
    <div className="my-0 relative max-w-md mx-auto text-center space-y-4">
      <div
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] font-medium"
        style={{
          color: accentColor,
          backgroundColor: `${accentColor}12`,
          border: `1px solid ${accentColor}33`,
        }}
      >
        <CalendarHeart className="w-3.5 h-3.5" />
        <span>{saveTheDateLabel}</span>
      </div>

      {/* Legend */}
      {secondary && (
        <div
          className="flex flex-wrap items-center justify-center gap-3 text-[10px]"
          style={{ color: textColor }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
            {eventTitle || "Nikoh To'yi"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ border: `1.5px solid ${accentColor}`, backgroundColor: `${accentColor}14` }}
            />
            {secondaryEvent?.title || 'Qiz bazmi'}
          </span>
        </div>
      )}

      {sharedMonth || !secondary ? (
        <MonthGrid
          year={primary.getFullYear()}
          monthIndex={primary.getMonth()}
          primaryDay={primary.getDate()}
          secondaryDay={secondary ? secondary.getDate() : null}
          primaryTime={primaryTime}
          secondaryTime={secondaryTime}
          accentColor={accentColor}
          textColor={textColor}
          daysOfWeekUz={daysOfWeekUz}
          monthName={monthNamesUz[primary.getMonth()]}
          onPrimaryTouch={() => {
            setDayTouched(true);
            setTimeout(() => setDayTouched(false), 2200);
          }}
        />
      ) : (
        <div className="space-y-4">
          <MonthGrid
            year={primary.getFullYear()}
            monthIndex={primary.getMonth()}
            primaryDay={primary.getDate()}
            secondaryDay={null}
            primaryTime={primaryTime}
            accentColor={accentColor}
            textColor={textColor}
            daysOfWeekUz={daysOfWeekUz}
            monthName={monthNamesUz[primary.getMonth()]}
            onPrimaryTouch={() => {
              setDayTouched(true);
              setTimeout(() => setDayTouched(false), 2200);
            }}
          />
          <MonthGrid
            year={secondary.getFullYear()}
            monthIndex={secondary.getMonth()}
            primaryDay={null}
            secondaryDay={secondary.getDate()}
            secondaryTime={secondaryTime}
            accentColor={accentColor}
            textColor={textColor}
            daysOfWeekUz={daysOfWeekUz}
            monthName={monthNamesUz[secondary.getMonth()]}
          />
        </div>
      )}

      <AnimatePresence>
        {dayTouched && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs italic flex items-center justify-center gap-1.5"
            style={{ color: accentColor }}
          >
            <Heart className="w-3 h-3" fill={accentColor} />
            {dayTouchedLabel}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Times list */}
      <div className="space-y-2.5 px-1 text-left">
        <div
          className="flex items-start justify-between gap-3 py-2 border-b"
          style={{ borderColor: `${accentColor}33` }}
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: accentColor }}>
              {eventTitle || "Nikoh To'yi"}
            </p>
            {primaryTime ? (
              <p className="text-sm font-serif flex items-center gap-1.5 mt-0.5" style={{ color: textColor }}>
                <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                Soat {primaryTime}
              </p>
            ) : (
              <p className="text-sm font-serif mt-0.5" style={{ color: BRAND.muted }}>
                Vaqt belgilanmagan
              </p>
            )}
          </div>
          <p className="text-xs font-serif text-right truncate max-w-[45%]" style={{ color: BRAND.muted }}>
            {venueName}
          </p>
        </div>
        {secondary && secondaryEvent && (
          <div className="flex items-start justify-between gap-3 py-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: accentColor }}>
                {secondaryEvent.title}
              </p>
              {secondaryTime ? (
                <p className="text-sm font-serif flex items-center gap-1.5 mt-0.5" style={{ color: textColor }}>
                  <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                  Soat {secondaryTime}
                </p>
              ) : (
                <p className="text-sm font-serif mt-0.5" style={{ color: BRAND.muted }}>
                  Vaqt belgilanmagan
                </p>
              )}
            </div>
            {secondaryEvent.venueName && (
              <p className="text-xs font-serif text-right truncate max-w-[45%]" style={{ color: BRAND.muted }}>
                {secondaryEvent.venueName}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          openGoogleCal(primary, eventTitle, venueName, locationAddress);
          if (secondary && secondaryEvent) {
            window.setTimeout(() => {
              openGoogleCal(
                secondary,
                secondaryEvent.title,
                secondaryEvent.venueName || venueName,
                locationAddress
              );
            }, 400);
          }
          setAdded(true);
          setTimeout(() => setAdded(false), 4000);
        }}
        className="w-full py-3.5 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
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
