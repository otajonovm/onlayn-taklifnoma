import React from 'react';
import { Heart } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { CalendarGrid } from '../calendars/CalendarGrid';
import { AgendaTimeline } from '@/components/invitation/AgendaTimeline';
import { LocationNavigator } from '@/components/invitation/LocationNavigator';
import { RsvpSection } from '@/components/invitation/RsvpSection';
import { UzbekCountdown } from '@/components/invitation/UzbekCountdown';
import { RevealWords, DrawLine } from '@/components/invitation/RevealText';
import { OrnamentDivider } from '@/components/ui/ornaments';

/**
 * WD-101 — Symmetric Classical Frame
 * Uses CSS variables from DynamicStyleWrapper for colors/fonts.
 */
export const WD101Layout: React.FC<WeddingLayoutProps> = ({ data }) => {
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

  const accent = 'var(--accent-color)';
  const text = 'var(--text-primary)';
  const muted = 'var(--text-secondary)';

  return (
    <div
      className="w-full text-center ds-font-body"
      style={{ backgroundColor: 'var(--bg-color)', color: text }}
    >
      <div
        className="relative mx-auto max-w-lg border p-6 sm:p-10"
        style={{
          borderColor: 'var(--border-color)',
          borderWidth: 1,
          backgroundColor: 'var(--bg-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: '0 20px 40px rgba(30, 41, 59, 0.04)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-2 border"
          style={{ borderColor: 'var(--border-color)', opacity: 0.55 }}
          aria-hidden
        />

        <header className="relative z-10 space-y-4 pt-2">
          {monogram && (
            <p
              className="text-[11px] uppercase tracking-[0.35em] font-medium ds-font-header"
              style={{ color: accent }}
            >
              {monogram}
            </p>
          )}

          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {groomName && (
              <span
                className="text-2xl sm:text-3xl italic ds-font-header"
                style={{ color: accent }}
              >
                {groomName}
              </span>
            )}
            {(groomName || brideName) && (
              <Heart className="w-4 h-4 shrink-0" style={{ color: styles.colorAccent }} fill={styles.colorAccent} />
            )}
            {brideName && (
              <span
                className="text-2xl sm:text-3xl italic ds-font-header"
                style={{ color: accent }}
              >
                {brideName}
              </span>
            )}
          </div>

          <DrawLine color={styles.colorAccent} className="mx-auto w-12" delay={0.2} />

          <p className="text-xs uppercase tracking-widest" style={{ color: accent }}>
            {eventType}
          </p>
          <OrnamentDivider className="w-28 h-auto mx-auto" color={styles.colorAccent} />

          {content.quote?.text && (
            <div className="pt-2 px-2">
              <RevealWords
                text={`"${content.quote.text}"`}
                className="italic text-sm sm:text-base leading-relaxed ds-font-header"
                style={{ color: text }}
                delay={0.1}
              />
              {content.quote.source && (
                <p className="text-[11px] mt-3 italic" style={{ color: muted }}>
                  {content.quote.source}
                </p>
              )}
            </div>
          )}

          <p className="text-sm ds-font-header pt-2" style={{ color: text }}>
            {content.hero.preambleText}
          </p>
          <p className="text-xs leading-relaxed px-2" style={{ color: muted }}>
            {content.hero.secondaryBodyText}
          </p>
        </header>

        <section
          className="relative z-10 mt-8 pt-6 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <CalendarGrid
            eventDate={eventDate}
            eventTitle={eventTitle}
            venueName={venueName}
            locationAddress={locationAddress}
            accentColor={styles.colorAccent}
            textColor={styles.colorTextPrimary}
            saveTheDateLabel={content.calendar.saveTheDateLabel}
            dayTouchedLabel={content.calendar.dayTouchedLabel}
            monthNamesUz={content.calendar.monthNamesUz}
            daysOfWeekUz={content.calendar.daysOfWeekUz}
          />
        </section>

        <section className="relative z-10 mt-8">
          <UzbekCountdown
            targetDate={eventDate}
            accentColor={styles.colorAccent}
            primaryColor={styles.colorTextPrimary}
            cardBgColor="transparent"
            sectionLabel={content.countdown?.sectionLabel}
            pendingPassedText={content.countdown?.pendingPassedText}
            unitLabels={content.countdown?.units}
          />
        </section>

        <section className="relative z-10 mt-8">
          <AgendaTimeline
            agenda={data.agenda}
            accentColor={styles.colorAccent}
            textColor={styles.colorTextPrimary}
            headerLabel={content.agenda?.headerText}
          />
        </section>

        <section className="relative z-10 mt-8">
          <LocationNavigator
            venueName={venueName}
            locationAddress={locationAddress}
            yandexUrl={data.yandexUrl}
            googleUrl={data.googleUrl}
            twoGisUrl={data.twoGisUrl}
            accentColor={styles.colorAccent}
            textColor={styles.colorTextPrimary}
            sectionLabel={content.locationNavigator?.sectionLabel}
            maps={content.locationNavigator?.maps}
          />
        </section>

        <section className="relative z-10 mt-8">
          <RsvpSection
            invitationId={data.invitationId}
            hostName={data.hostName}
            eventTitle={eventTitle}
            telegramChatId={data.telegramChatId}
            content={content.rsvp}
            accentColor={styles.colorAccent}
            textColor={styles.colorTextPrimary}
            onRsvpSuccess={data.onRsvpSuccess}
          />
        </section>

        <p className="relative z-10 mt-8 text-[11px] italic" style={{ color: muted }}>
          {content.hero.closingLineText}
        </p>
      </div>
    </div>
  );
};

export default WD101Layout;
