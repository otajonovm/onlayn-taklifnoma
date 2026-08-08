import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { CalendarGrid } from '../calendars/CalendarGrid';
import { AgendaTimeline } from '@/components/invitation/AgendaTimeline';
import { LocationNavigator } from '@/components/invitation/LocationNavigator';
import { RsvpSection } from '@/components/invitation/RsvpSection';
import { UzbekCountdown } from '@/components/invitation/UzbekCountdown';
import { RevealWords, DrawLine } from '@/components/invitation/RevealText';
import { OrnamentDivider } from '@/components/ui/ornaments';

const MONTHS_UZ = [
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
] as const;

const WEEKDAYS_UZ = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
] as const;

/** To‘liq o‘zbek oy/kun nomi — Intl ba’zan "M08" qaytaradi */
function formatEventWhen(
  iso?: string,
  monthNames?: string[],
  includeTime = true
): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const months = monthNames && monthNames.length >= 12 ? monthNames : [...MONTHS_UZ];
    const weekday = WEEKDAYS_UZ[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()] || MONTHS_UZ[d.getMonth()];
    const year = d.getFullYear();
    if (!includeTime) return `${weekday}, ${day}-${month} ${year}`;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${weekday}, ${day}-${month} ${year}, ${hh}:${mm}`;
  } catch {
    return iso;
  }
}

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
    eventShowTime,
    venueName,
    locationAddress,
    qizBazmiTitle,
    qizBazmiDate,
    qizBazmiShowTime,
    qizBazmiVenue,
    qizBazmiAddress,
    styles,
    content,
  } = data;

  const accent = 'var(--accent-color)';
  const text = 'var(--text-primary)';
  const muted = 'var(--text-secondary)';

  const showQizBazmi = Boolean(qizBazmiDate || qizBazmiVenue || qizBazmiAddress);
  const eventRows = [
    {
      key: 'nikoh',
      title: eventType || eventTitle || "Nikoh To'yi",
      when: formatEventWhen(eventDate, content.calendar.monthNamesUz, eventShowTime !== false),
      place: [venueName, locationAddress].filter(Boolean).join(' · '),
    },
    ...(showQizBazmi
      ? [
          {
            key: 'qiz-bazmi',
            title: qizBazmiTitle?.trim() || 'Qiz bazmi',
            when: formatEventWhen(
              qizBazmiDate,
              content.calendar.monthNamesUz,
              qizBazmiShowTime !== false
            ),
            place: [qizBazmiVenue, qizBazmiAddress].filter(Boolean).join(' · '),
          },
        ]
      : []),
  ];

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

          {/* Asosiy sarlavha — ikkala tadbir birdaniga ko‘rinsin */}
          <div className="space-y-2 px-1">
            <p
              className="text-xs sm:text-sm uppercase tracking-[0.18em] leading-relaxed"
              style={{ color: accent }}
            >
              {showQizBazmi
                ? `${eventType || "Nikoh To'yi"}  ·  ${qizBazmiTitle?.trim() || 'Qiz bazmi'}`
                : eventType}
            </p>
            {showQizBazmi && (
              <div className="pt-1 space-y-1.5 text-[11px] sm:text-xs leading-snug" style={{ color: muted }}>
                <p>
                  <span className="font-medium" style={{ color: text }}>
                    {eventType || "Nikoh To'yi"}
                  </span>
                  {eventRows[0]?.when ? ` — ${eventRows[0].when}` : ''}
                </p>
                <p>
                  <span className="font-medium" style={{ color: text }}>
                    {qizBazmiTitle?.trim() || 'Qiz bazmi'}
                  </span>
                  {eventRows[1]?.when ? ` — ${eventRows[1].when}` : ''}
                </p>
              </div>
            )}
          </div>
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
            eventTitle={eventType || eventTitle || "Nikoh To'yi"}
            showTime={eventShowTime !== false}
            venueName={venueName}
            locationAddress={locationAddress}
            accentColor={styles.colorAccent}
            textColor={styles.colorTextPrimary}
            saveTheDateLabel={content.calendar.saveTheDateLabel}
            dayTouchedLabel={content.calendar.dayTouchedLabel}
            monthNamesUz={content.calendar.monthNamesUz}
            daysOfWeekUz={content.calendar.daysOfWeekUz}
            secondaryEvent={
              qizBazmiDate
                ? {
                    date: qizBazmiDate,
                    title: qizBazmiTitle?.trim() || 'Qiz bazmi',
                    venueName: qizBazmiVenue || undefined,
                    showTime: qizBazmiShowTime !== false,
                  }
                : undefined
            }
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

        {data.agenda.length > 0 && (
          <section className="relative z-10 mt-8">
            <AgendaTimeline
              agenda={data.agenda}
              accentColor={styles.colorAccent}
              textColor={styles.colorTextPrimary}
              headerLabel={content.agenda?.headerText}
            />
          </section>
        )}

        {/* Tadbirlar — Nikoh + Qiz bazmi (bitta lista) */}
        <section
          className="relative z-10 mt-8 pt-6 border-t text-left"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p
            className="text-[11px] uppercase tracking-[0.28em] text-center mb-5"
            style={{ color: accent }}
          >
            Tadbirlar
          </p>
          <ul className="space-y-0">
            {eventRows.map((row, idx) => (
              <li
                key={row.key}
                className="py-4"
                style={{
                  borderTop: idx === 0 ? undefined : '1px solid var(--border-color)',
                }}
              >
                <p
                  className="text-sm uppercase tracking-[0.18em] mb-1.5 ds-font-header"
                  style={{ color: accent }}
                >
                  {row.title}
                </p>
                {row.when && (
                  <p className="text-sm leading-snug ds-font-header" style={{ color: text }}>
                    {row.when}
                  </p>
                )}
                {row.place && (
                  <p
                    className="mt-1.5 text-xs leading-relaxed flex items-start gap-1.5"
                    style={{ color: muted }}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                    <span>{row.place}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
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
