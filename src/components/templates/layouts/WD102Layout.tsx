import React from 'react';
import { motion } from 'motion/react';
import type { WeddingLayoutProps } from '../types';
import { CalendarTypographic } from '../calendars/CalendarTypographic';
import { AgendaTimeline } from '@/components/invitation/AgendaTimeline';
import { LocationNavigator } from '@/components/invitation/LocationNavigator';
import { RsvpSection } from '@/components/invitation/RsvpSection';
import { UzbekCountdown } from '@/components/invitation/UzbekCountdown';
import { WEDDING_IMAGES } from '@/data/weddingImagery';

/** Fine-line botanical SVG accents for WD-102 */
const BotanicalCorner: React.FC<{ className?: string; color: string; flip?: boolean }> = ({
  className = '',
  color,
  flip,
}) => (
  <svg
    className={`pointer-events-none absolute w-24 h-24 opacity-40 ${className}`}
    viewBox="0 0 96 96"
    fill="none"
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    aria-hidden
  >
    <path
      d="M8 88 C12 48, 40 20, 88 12"
      stroke={color}
      strokeWidth="0.8"
    />
    <path
      d="M20 80 C28 52, 52 32, 78 24"
      stroke={color}
      strokeWidth="0.5"
      opacity="0.7"
    />
    <ellipse cx="72" cy="28" rx="6" ry="10" stroke={color} strokeWidth="0.6" transform="rotate(-30 72 28)" />
    <ellipse cx="58" cy="40" rx="5" ry="8" stroke={color} strokeWidth="0.5" transform="rotate(-50 58 40)" />
    <circle cx="88" cy="12" r="2" fill={color} opacity="0.5" />
  </svg>
);

/**
 * WD-102 — Asymmetric Split & Overlap
 * Left-aligned modern typography with overlapping glassmorphism cards.
 * Hero: Large stacked names + offset monogram badge.
 * Calendar: Typographic date hero (no grid).
 * Background: Pure white + fine-line botanical SVG.
 */
export const WD102Layout: React.FC<WeddingLayoutProps> = ({ data }) => {
  const {
    groomName,
    brideName,
    monogram,
    eventTitle,
    eventType,
    eventDate,
    venueName,
    locationAddress,
    styles,
    content,
  } = data;

  const accent = styles.colorAccent;
  const text = styles.colorTextPrimary;
  const muted = styles.colorTextSecondary;

  return (
    <div
      className="relative w-full text-left overflow-hidden ds-font-body"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
    >
      <BotanicalCorner className="top-2 left-2" color={accent} />
      <BotanicalCorner className="bottom-4 right-2" color={accent} flip />

      {/* Hero — stacked names + offset monogram */}
      <header className="relative z-10 px-5 sm:px-8 pt-10 pb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: accent }}>
          {eventType || content.hero.preambleText}
        </p>

        <div className="relative">
          {groomName && (
            <motion.h2
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="ds-font-header text-4xl sm:text-5xl leading-[1.05] tracking-tight"
              style={{ color: text }}
            >
              {groomName}
            </motion.h2>
          )}
          {brideName && (
            <motion.h2
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="ds-font-header text-4xl sm:text-5xl leading-[1.05] tracking-tight mt-1"
              style={{ color: accent }}
            >
              {brideName}
            </motion.h2>
          )}

          {/* Offset monogram badge */}
          {monogram && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
              className="absolute -right-1 sm:right-4 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full border flex items-center justify-center backdrop-blur-md"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, transparent)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 12px 28px rgba(15,23,42,0.08)',
              }}
            >
              <span className="text-xs sm:text-sm ds-font-header tracking-widest" style={{ color: accent }}>
                {monogram}
              </span>
            </motion.div>
          )}
        </div>

        <p className="mt-6 max-w-sm text-sm leading-relaxed" style={{ color: muted }}>
          {content.hero.secondaryBodyText}
        </p>
      </header>

      {/* Overlapping glass card — calendar */}
      <section className="relative z-10 px-4 sm:px-6 -mt-2">
        <div
          className="relative rounded-2xl border p-5 sm:p-7 backdrop-blur-md"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, transparent)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 16px 40px rgba(15,23,42,0.06)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <CalendarTypographic
            eventDate={eventDate}
            eventTitle={eventTitle}
            venueName={venueName}
            locationAddress={locationAddress}
            accentColor={accent}
            textColor={text}
            saveTheDateLabel={content.calendar.saveTheDateLabel}
            monthNamesUz={content.calendar.monthNamesUz}
          />
        </div>
      </section>

      <section className="relative z-10 px-5 sm:px-8 mt-8">
        <UzbekCountdown
          targetDate={eventDate}
          accentColor={accent}
          primaryColor={text}
          cardBgColor="rgba(255,255,255,0.7)"
          sectionLabel={content.countdown?.sectionLabel}
          pendingPassedText={content.countdown?.pendingPassedText}
          unitLabels={content.countdown?.units}
        />
      </section>

      {data.agenda.length > 0 && (
        <section className="relative z-10 px-4 sm:px-6 mt-6">
          <div
            className="rounded-2xl border p-5 sm:p-6 backdrop-blur-md"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, transparent)',
              borderColor: 'var(--border-color)',
              boxShadow: '0 12px 32px rgba(15,23,42,0.05)',
              transform: 'translateX(4px)',
              borderRadius: 'var(--border-radius)',
            }}
          >
            <AgendaTimeline
              agenda={data.agenda}
              accentColor={accent}
              textColor={text}
              headerLabel={content.agenda?.headerText}
            />
          </div>
        </section>
      )}

      <section
        className="relative z-10 px-4 sm:px-6 mt-6"
        style={{ transform: 'translateX(-4px)' }}
      >
        <div
          className="rounded-2xl border overflow-hidden backdrop-blur-md"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card-bg) 85%, transparent)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 12px 32px rgba(15,23,42,0.05)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <div className="h-36 sm:h-40 overflow-hidden relative bg-stone-200">
            <img
              src={data.venueImage || WEDDING_IMAGES.venue}
              alt={venueName || 'Venue'}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== WEDDING_IMAGES.venue) {
                  el.src = WEDDING_IMAGES.venue;
                }
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.92) 100%)',
              }}
            />
          </div>
          <div className="p-5">
            <LocationNavigator
              venueName={venueName}
              locationAddress={locationAddress}
              yandexUrl={data.yandexUrl}
              googleUrl={data.googleUrl}
              twoGisUrl={data.twoGisUrl}
              accentColor={accent}
              textColor={text}
              sectionLabel={content.locationNavigator?.sectionLabel}
              maps={content.locationNavigator?.maps}
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 mt-6 mb-4">
        <div
          className="rounded-2xl border p-5 sm:p-6 backdrop-blur-md"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card-bg) 80%, transparent)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <RsvpSection
            invitationId={data.invitationId}
            hostName={data.hostName}
            eventTitle={eventTitle}
            telegramChatId={data.telegramChatId}
            content={content.rsvp}
            accentColor={accent}
            textColor={text}
            onRsvpSuccess={data.onRsvpSuccess}
          />
        </div>
      </section>
    </div>
  );
};

export default WD102Layout;
