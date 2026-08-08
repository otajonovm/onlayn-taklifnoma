import React from 'react';
import { motion } from 'motion/react';
import type { WeddingLayoutProps } from '../types';
import { CalendarRibbon } from '../calendars/CalendarRibbon';
import { AgendaTimeline } from '@/components/invitation/AgendaTimeline';
import { LocationNavigator } from '@/components/invitation/LocationNavigator';
import { RsvpSection } from '@/components/invitation/RsvpSection';
import { UzbekCountdown } from '@/components/invitation/UzbekCountdown';
import { WEDDING_IMAGES } from '@/data/weddingImagery';

/**
 * WD-103 — Editorial Magazine / Postcard
 * Two-tone divided sections (ivory top, white bottom) with journal rules.
 * Hero: Full-width cover image → Editorial serif names.
 * Calendar: Horizontal inline date ribbon.
 */
export const WD103Layout: React.FC<WeddingLayoutProps> = ({ data }) => {
  const {
    groomName,
    brideName,
    monogram,
    eventTitle,
    eventType,
    eventDate,
    eventShowTime,
    venueName,
    locationAddress,
    styles,
    content,
  } = data;

  const accent = styles.colorAccent;
  const text = styles.colorTextPrimary;
  const muted = styles.colorTextSecondary;
  const cover = data.coverImage || WEDDING_IMAGES.ceremony;

  return (
    <div className="w-full overflow-hidden ds-font-body" style={{ color: 'var(--text-primary)' }}>
      {/* TOP — ivory editorial masthead + cover */}
      <div style={{ backgroundColor: 'var(--bg-color)' }}>
        <div
          className="px-5 sm:px-8 pt-6 pb-3 flex items-center justify-between border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: accent }}>
            {eventType || 'Taklifnoma'}
          </span>
          {monogram && (
            <span className="text-[10px] uppercase tracking-[0.2em] ds-font-header" style={{ color: muted }}>
              {monogram}
            </span>
          )}
        </div>

        {/* Full-width cover image placeholder header */}
        <div className="relative w-full aspect-16/10 sm:aspect-2/1 overflow-hidden">
          <img
            src={cover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src !== WEDDING_IMAGES.ceremony) {
                el.src = WEDDING_IMAGES.ceremony;
              }
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(253,251,247,0.15) 0%, rgba(253,251,247,0.85) 100%)',
            }}
          />
        </div>

        {/* Editorial serif names */}
        <header className="px-5 sm:px-10 pt-6 pb-8 text-center border-b" style={{ borderColor: 'var(--border-color)' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: accent }}>
              {content.hero.preambleText}
            </p>
            <h2
              className="ds-font-header text-3xl sm:text-4xl leading-tight tracking-tight"
              style={{ color: text }}
            >
              {groomName}
              {(groomName || brideName) && (
                <span className="block text-lg sm:text-xl italic font-light my-1" style={{ color: accent }}>
                  &
                </span>
              )}
              {brideName}
            </h2>
            {content.quote?.text && (
              <p
                className="mt-5 max-w-sm mx-auto text-sm italic ds-font-header leading-relaxed border-t border-b py-4"
                style={{ color: muted, borderColor: 'var(--border-color)' }}
              >
                “{content.quote.text}”
                {content.quote.source && (
                  <span className="block text-[10px] not-italic mt-2 tracking-wide uppercase">
                    {content.quote.source}
                  </span>
                )}
              </p>
            )}
          </motion.div>
        </header>
      </div>

      {/* BOTTOM — white journal body */}
      <div style={{ backgroundColor: 'var(--card-bg)' }}>
        <section className="px-5 sm:px-8 py-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <CalendarRibbon
            eventDate={eventDate}
            showTime={eventShowTime !== false}
            eventTitle={eventTitle}
            venueName={venueName}
            locationAddress={locationAddress}
            accentColor={accent}
            textColor={text}
            saveTheDateLabel={content.calendar.saveTheDateLabel}
            monthNamesUz={content.calendar.monthNamesUz}
          />
        </section>

        <section className="px-5 sm:px-8 py-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <UzbekCountdown
            targetDate={eventDate}
            accentColor={accent}
            primaryColor={text}
            cardBgColor={styles.colorBg}
            sectionLabel={content.countdown?.sectionLabel}
            pendingPassedText={content.countdown?.pendingPassedText}
            unitLabels={content.countdown?.units}
          />
        </section>

        {data.agenda.length > 0 && (
          <section className="px-5 sm:px-8 py-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="max-w-lg mx-auto">
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-center mb-6 border-y py-2"
                style={{ color: accent, borderColor: 'var(--border-color)' }}
              >
                {content.agenda?.headerText || 'Dastur'}
              </p>
              <AgendaTimeline
                agenda={data.agenda}
                accentColor={accent}
                textColor={text}
                headerLabel={content.agenda?.headerText}
              />
            </div>
          </section>
        )}

        <section className="px-5 sm:px-8 py-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
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
        </section>

        <section className="px-5 sm:px-8 py-10">
          <div
            className="max-w-lg mx-auto border p-5 sm:p-6"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-color)',
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

        <footer
          className="px-5 py-6 text-center text-[11px] italic border-t"
          style={{ color: muted, borderColor: 'var(--border-color)' }}
        >
          {content.hero.closingLineText}
        </footer>
      </div>
    </div>
  );
};

export default WD103Layout;
