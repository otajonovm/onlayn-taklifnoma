import React from 'react';
import { Calendar, Clock, Heart } from 'lucide-react';
import type { WeddingTemplateConfig } from '@/config/weddingTemplates';
import { WEDDING_IMAGES } from '@/data/weddingImagery';

interface TemplatePreviewThumbProps {
  template: WeddingTemplateConfig;
  groomName?: string;
  brideName?: string;
  className?: string;
}

function parseEventParts(eventDate: string, monthNames: string[]) {
  const [y, m, d] = eventDate.split('-');
  const monthIdx = Math.max(0, Number(m || '1') - 1);
  return {
    day: d || '16',
    year: y || '2026',
    month: monthNames[monthIdx] || 'Avgust',
  };
}

/**
 * Dense mini-invitation previews for WD-101 / WD-102 / WD-103 (home + builder).
 */
export const TemplatePreviewThumb: React.FC<TemplatePreviewThumbProps> = ({
  template,
  groomName,
  brideName,
  className = '',
}) => {
  const s = template.styles;
  const couple = template.content.hero.coupleNames || '';
  const parts = couple.split('&').map((p) => p.trim());
  const groom = groomName || parts[0] || 'Alisher';
  const bride = brideName || parts[1] || 'Nigora';
  const monogram = template.content.hero.monogram || 'S & A';
  const quote = template.content.quote?.text;
  const quoteSource = template.content.quote?.source;
  const cover = template.content.hero.coverImage || WEDDING_IMAGES.ceremony;
  const cal = template.content.calendar;
  const { day, year, month } = parseEventParts(cal.eventDate, cal.monthNamesUz ?? []);
  const venue = template.content.venue.name;

  // ── WD-101 — ivory classic, double frame, full stack ──
  if (template.id === 'WD-101') {
    return (
      <div
        className={`relative w-full aspect-3/4 overflow-hidden ${className}`}
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, #FFFCF8 0%, ${s.colorBg} 55%, #F3EDE4 100%)`,
          fontFamily: `'${s.fontBody}', sans-serif`,
        }}
      >
        <div
          className="absolute inset-[7%] flex flex-col items-center text-center px-2.5 pt-3 pb-2.5"
          style={{ border: `1.5px solid ${s.colorAccent}`, borderRadius: 2 }}
        >
          <div
            className="absolute inset-0.75 pointer-events-none"
            style={{ border: `1px solid ${s.colorAccent}`, opacity: 0.35, borderRadius: 1 }}
          />

          <p
            className="relative text-[9px] tracking-[0.32em] uppercase mt-0.5"
            style={{ color: s.colorAccent, fontFamily: `'${s.fontHeader}', serif` }}
          >
            {monogram}
          </p>

          <div className="relative flex items-center justify-center gap-1.5 mt-2.5 px-1">
            <span
              className="text-[17px] italic leading-none"
              style={{ color: s.colorAccent, fontFamily: `'${s.fontHeader}', serif` }}
            >
              {groom}
            </span>
            <Heart className="w-3 h-3 shrink-0" style={{ color: s.colorAccent }} fill={s.colorAccent} />
            <span
              className="text-[17px] italic leading-none"
              style={{ color: s.colorAccent, fontFamily: `'${s.fontHeader}', serif` }}
            >
              {bride}
            </span>
          </div>

          <div className="relative flex items-center gap-2 my-2.5 w-full max-w-[85%]">
            <span className="flex-1 h-px" style={{ backgroundColor: s.colorAccent, opacity: 0.45 }} />
            <span
              className="text-[8px] uppercase tracking-[0.22em] shrink-0"
              style={{ color: s.colorAccent }}
            >
              Nikoh To&apos;yi
            </span>
            <span className="flex-1 h-px" style={{ backgroundColor: s.colorAccent, opacity: 0.45 }} />
          </div>

          <div className="relative flex items-center gap-1.5 mb-2">
            <span className="w-6 h-px" style={{ backgroundColor: s.colorAccent, opacity: 0.4 }} />
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ border: `1px solid ${s.colorAccent}`, opacity: 0.7 }}
            />
            <span className="w-6 h-px" style={{ backgroundColor: s.colorAccent, opacity: 0.4 }} />
          </div>

          {quote && (
            <p
              className="relative text-[9px] italic leading-snug px-1"
              style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
            >
              “{quote}”
            </p>
          )}
          {quoteSource && (
            <p className="relative text-[7px] uppercase tracking-[0.12em] mt-1" style={{ color: s.colorTextSecondary }}>
              {quoteSource}
            </p>
          )}

          <p
            className="relative text-[9px] mt-2.5 mb-1"
            style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
          >
            {template.content.hero.preambleText}
          </p>
          <p
            className="relative text-[7.5px] leading-relaxed px-0.5 line-clamp-3"
            style={{ color: s.colorTextSecondary }}
          >
            {template.content.hero.secondaryBodyText}
          </p>

          <div className="relative mt-auto w-full pt-2.5 flex flex-col items-center gap-1.5">
            <div className="w-full max-w-[90%] h-px mb-0.5" style={{ backgroundColor: s.colorBorder }} />
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border"
              style={{ borderColor: s.colorAccent, color: s.colorAccent }}
            >
              <Calendar className="w-2.5 h-2.5" />
              <span className="text-[7px] uppercase tracking-[0.16em] font-medium">
                {cal.saveTheDateLabel}
              </span>
            </div>
            <p
              className="text-[13px] font-semibold tracking-wide"
              style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
            >
              {month} · {year}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── WD-102 — fine-line botanical (matches live layout) ──
  if (template.id === 'WD-102') {
    const mono =
      (groom[0] || 'A').toUpperCase() + ' & ' + (bride[0] || 'N').toUpperCase();

    return (
      <div
        className={`relative w-full aspect-3/4 overflow-hidden ${className}`}
        style={{
          backgroundColor: '#FFFFFF',
          fontFamily: `'${s.fontBody}', sans-serif`,
        }}
      >
        {/* Botanical — top left (subtle) */}
        <svg
          className="absolute top-2 left-2 w-13 h-13 opacity-40 pointer-events-none"
          viewBox="0 0 96 96"
          fill="none"
          aria-hidden
        >
          <path d="M8 88C12 48 40 20 88 12" stroke={s.colorAccent} strokeWidth="0.9" />
          <path d="M20 80C28 52 52 32 78 24" stroke={s.colorAccent} strokeWidth="0.55" opacity="0.75" />
          <ellipse cx="72" cy="28" rx="6" ry="10" stroke={s.colorAccent} strokeWidth="0.65" transform="rotate(-30 72 28)" />
          <ellipse cx="58" cy="40" rx="5" ry="8" stroke={s.colorAccent} strokeWidth="0.55" transform="rotate(-50 58 40)" />
        </svg>

        <div className="absolute inset-0 flex flex-col px-3.5 pt-5 pb-3">
          <p
            className="text-[8px] uppercase tracking-[0.26em] mb-3"
            style={{ color: s.colorAccent }}
          >
            Nikoh To&apos;yi
          </p>

          <div className="relative pr-11 mb-2.5">
            <p
              className="text-[19px] leading-[1.08] tracking-tight"
              style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
            >
              {groom}
            </p>
            <p
              className="text-[19px] leading-[1.08] tracking-tight mt-0.5"
              style={{ color: s.colorAccent, fontFamily: `'${s.fontHeader}', serif` }}
            >
              {bride}
            </p>

            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border flex items-center justify-center"
              style={{
                borderColor: s.colorBorder,
                backgroundColor: 'rgba(255,255,255,0.9)',
                boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
              }}
            >
              <span
                className="text-[7px] tracking-wide"
                style={{ color: s.colorAccent, fontFamily: `'${s.fontHeader}', serif` }}
              >
                {mono}
              </span>
            </div>
          </div>

          <p
            className="text-[7.5px] leading-normal line-clamp-3 max-w-[94%] mb-3"
            style={{ color: s.colorTextSecondary }}
          >
            {template.content.hero.secondaryBodyText}
          </p>

          {/* Save the Date — glass card */}
          <div
            className="mt-auto rounded-xl border px-2.5 py-2.5"
            style={{
              borderColor: s.colorBorder,
              backgroundColor: 'rgba(255,255,255,0.92)',
              boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
            }}
          >
            <p
              className="text-[7px] uppercase tracking-[0.2em] mb-1.5"
              style={{ color: s.colorAccent }}
            >
              {cal.saveTheDateLabel}
            </p>

            <div className="flex items-center gap-2.5">
              <span
                className="text-[30px] font-semibold leading-none tracking-tight shrink-0"
                style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
              >
                {day}
              </span>
              <div
                className="rounded-md px-2 py-1 min-w-0"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${s.colorBorder}`,
                  boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                }}
              >
                <p className="text-[6px] uppercase tracking-[0.12em]" style={{ color: s.colorAccent }}>
                  Yakshanba
                </p>
                <p
                  className="text-[11px] leading-tight"
                  style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
                >
                  {month}
                </p>
                <p className="text-[7.5px]" style={{ color: s.colorTextSecondary }}>
                  {year}
                </p>
              </div>
            </div>

            <div
              className="mt-2 flex items-center gap-1.5 text-[7px] min-w-0"
              style={{ color: s.colorTextSecondary }}
            >
              <Clock className="w-2.5 h-2.5 shrink-0" style={{ color: s.colorAccent }} />
              <span className="shrink-0">{cal.eventTime}</span>
              <span className="w-px h-2.5 shrink-0" style={{ backgroundColor: s.colorBorder }} />
              <span className="truncate">{venue}</span>
            </div>

            <div
              className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
              style={{ borderColor: s.colorBorder, color: s.colorTextPrimary }}
            >
              <Calendar className="w-2.5 h-2.5" style={{ color: s.colorAccent }} />
              <span className="text-[7px] font-medium">Kalendarga</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── WD-103 — editorial postcard with cover ──
  return (
    <div
      className={`relative w-full aspect-3/4 overflow-hidden ${className}`}
      style={{
        backgroundColor: s.colorBg,
        fontFamily: `'${s.fontBody}', sans-serif`,
      }}
    >
      <div
        className="absolute inset-1.5 flex flex-col overflow-hidden"
        style={{ border: `1px dashed ${s.colorBorder}` }}
      >
        <div className="flex items-center justify-between px-2.5 py-1.5 shrink-0">
          <span className="text-[7px] uppercase tracking-[0.22em]" style={{ color: s.colorAccent }}>
            Nikoh To&apos;yi
          </span>
          <span className="text-[7px] uppercase tracking-[0.16em]" style={{ color: s.colorTextSecondary }}>
            {monogram.replace(/\s*&\s*/g, ' · ')}
          </span>
        </div>

        <div className="relative w-full flex-[1.15] min-h-0 overflow-hidden">
          <img
            src={cover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 35%, ${s.colorBg}cc 78%, ${s.colorBg} 100%)`,
            }}
          />
        </div>

        <div className="relative -mt-5 flex flex-col items-center text-center px-2.5 pb-2.5 pt-1 shrink-0 z-10">
          <p className="text-[7px] uppercase tracking-[0.22em] mb-1.5" style={{ color: s.colorAccent }}>
            {template.content.hero.preambleText}
          </p>
          <p
            className="text-[16px] leading-[1.1]"
            style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
          >
            {groom}
          </p>
          <span
            className="text-[11px] italic my-0.5"
            style={{ color: s.colorAccent, fontFamily: `'${s.fontHeader}', serif` }}
          >
            &
          </span>
          <p
            className="text-[16px] leading-[1.1]"
            style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
          >
            {bride}
          </p>

          <div className="w-10 h-px my-2" style={{ backgroundColor: s.colorBorder }} />

          {quote && (
            <p
              className="text-[8.5px] italic leading-snug line-clamp-2 px-1"
              style={{ color: s.colorTextPrimary, fontFamily: `'${s.fontHeader}', serif` }}
            >
              “{quote}”
            </p>
          )}
          {quoteSource && (
            <p className="text-[6.5px] uppercase tracking-[0.14em] mt-1" style={{ color: s.colorTextSecondary }}>
              {quoteSource}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewThumb;
