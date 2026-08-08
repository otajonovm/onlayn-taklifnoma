import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AgendaItem, DressCodeColor, Invitation } from '../../types';
import { BRAND, WEDDING_CATEGORY_LABEL } from '../../config/themes';
import { WEDDING_TEMPLATES } from '@/config/weddingTemplates';
import {
  mergeStyleOverrides,
  DEFAULT_INVITATION_IMAGES,
  type TemplateStyleOverrides,
  type InvitationImages,
} from '@/types/styleTokens';
import { loadBuilderDraft, saveBuilderDraft, clearBuilderDraft } from '@/lib/builderDraft';
import {
  combineDateTimeLocal,
  splitDateTimeLocal,
  toStoredIso,
} from '@/lib/eventDateTime';
import { DEFAULT_AUDIO_TRACK } from '@/data/audioTracks';
import { StyleCustomizerPanel } from '@/components/editor/StyleCustomizerPanel';
import { AudioTrackPicker } from '@/components/editor/AudioTrackPicker';
import { TemplatePreviewThumb } from '@/components/builder/TemplatePreviewThumb';
import { WeddingRenderer } from '@/components/templates/WeddingRenderer';
import { Plus, Trash2, CheckCircle2, Eye, ArrowLeft, Sparkles } from 'lucide-react';

interface LiveBuilderProps {
  onInvitationCreated: (id: string) => void;
  onCancel?: () => void;
  /** Prefill from home “Andoza” selection, e.g. WD-102 */
  initialTemplateId?: string;
}

function getInitialDraft() {
  if (typeof window === 'undefined') return null;
  return loadBuilderDraft();
}

export const LiveBuilder: React.FC<LiveBuilderProps> = ({
  onInvitationCreated,
  onCancel,
  initialTemplateId,
}) => {
  const templateIds = Object.keys(WEDDING_TEMPLATES);
  // Har doim localStorage qoralamasini tiklaymiz (orqaga qaytganda ma’lumot yo‘qolmasin)
  const initialDraft = useMemo(() => getInitialDraft(), []);

  const switchingTemplateFromHome = Boolean(
    initialTemplateId &&
      WEDDING_TEMPLATES[initialTemplateId] &&
      initialDraft &&
      initialDraft.selectedTemplateId !== initialTemplateId
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    // Home’dan boshqa andoza tanlanganda — yangi shablon
    if (switchingTemplateFromHome && initialTemplateId) {
      return initialTemplateId;
    }
    // Qoralama bor bo‘lsa — undan davom etamiz
    if (initialDraft?.selectedTemplateId && WEDDING_TEMPLATES[initialDraft.selectedTemplateId]) {
      return initialDraft.selectedTemplateId;
    }
    if (initialTemplateId && WEDDING_TEMPLATES[initialTemplateId]) {
      return initialTemplateId;
    }
    return templateIds[0];
  });

  const [createdInvitationId, setCreatedInvitationId] = useState<string | null>(
    initialDraft?.createdInvitationId ?? null
  );

  const [brideName, setBrideName] = useState(initialDraft?.brideName ?? 'Nigora');
  const [groomName, setGroomName] = useState(initialDraft?.groomName ?? 'Alisher');
  const [eventTitle, setEventTitle] = useState(
    initialDraft?.eventTitle ?? "Nikoh To'yi Marosimi"
  );
  const [eventType, setEventType] = useState(initialDraft?.eventType ?? "Nikoh To'yi");
  const initialNikoh = splitDateTimeLocal(initialDraft?.eventDate ?? '2026-08-16T18:00');
  const [eventDateOnly, setEventDateOnly] = useState(initialNikoh.date || '2026-08-16');
  const [eventTime, setEventTime] = useState(() => {
    if (initialDraft?.eventShowTime === false) return '';
    if (typeof initialDraft?.eventTime === 'string') return initialDraft.eventTime;
    return initialNikoh.time || '18:00';
  });
  const [venueName, setVenueName] = useState(
    initialDraft?.venueName ?? 'Versal Tantanalar Saroyi'
  );
  const [locationAddress, setLocationAddress] = useState(
    initialDraft?.locationAddress ??
      "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 102"
  );
  const [qizBazmiTitle, setQizBazmiTitle] = useState(
    initialDraft?.qizBazmiTitle ?? 'Qiz bazmi'
  );
  const initialQiz = splitDateTimeLocal(initialDraft?.qizBazmiDate ?? '2026-08-15T16:00');
  const [qizBazmiDateOnly, setQizBazmiDateOnly] = useState(initialQiz.date || '2026-08-15');
  const [qizBazmiTime, setQizBazmiTime] = useState(() => {
    if (initialDraft?.qizBazmiShowTime === false) return '';
    if (typeof initialDraft?.qizBazmiTime === 'string') return initialDraft.qizBazmiTime;
    return initialQiz.time || '16:00';
  });
  const [qizBazmiVenue, setQizBazmiVenue] = useState(
    initialDraft?.qizBazmiVenue ?? ''
  );
  const [qizBazmiAddress, setQizBazmiAddress] = useState(
    initialDraft?.qizBazmiAddress ?? ''
  );
  const [yandexUrl, setYandexUrl] = useState(
    initialDraft?.yandexUrl ?? 'https://yandex.uz/maps'
  );
  const [googleUrl, setGoogleUrl] = useState(
    initialDraft?.googleUrl ?? 'https://maps.google.com'
  );
  const [twoGisUrl, setTwoGisUrl] = useState(initialDraft?.twoGisUrl ?? 'https://2gis.uz');
  const [telegramChatId, setTelegramChatId] = useState(
    initialDraft?.telegramChatId ?? '@my_wedding_bot'
  );

  const [agenda, setAgenda] = useState<AgendaItem[]>(
    () =>
      initialDraft?.agenda ?? [
        {
          time: '17:00',
          title: 'Mehmonlarni Kutib Olish',
          description: 'Lobi zalida tantanali kutib olish',
          iconName: 'Users',
        },
        {
          time: '18:00',
          title: 'Nikoh Marosimi & Fotiha',
          description: "Shar'iy nikoh va FHDYo",
          iconName: 'Heart',
        },
        {
          time: '19:00',
          title: 'Tantanali Shou Dasturi',
          description: 'Konsert va kechki taom',
          iconName: 'Music',
        },
      ]
  );

  const [dressCodeTitle, setDressCodeTitle] = useState(
    initialDraft?.dressCodeTitle ?? 'Black Tie / Rasmiy Kostyum & Kechki Libos'
  );
  const [dressCodeDesc, setDressCodeDesc] = useState(
    initialDraft?.dressCodeDesc ??
      "Tantanamiz fil suyagi va qum-oltin bezaklarda o'tkaziladi."
  );
  const [dressCodeColors, setDressCodeColors] = useState<DressCodeColor[]>(
    () =>
      initialDraft?.dressCodeColors ?? [
        { name: 'Qum Oltin', hex: BRAND.accent },
        { name: 'Slate', hex: BRAND.text },
        { name: 'Marvarid', hex: '#FAF6F0' },
      ]
  );

  const selectedTemplate =
    WEDDING_TEMPLATES[selectedTemplateId] || WEDDING_TEMPLATES[templateIds[0]];

  const [styleOverrides, setStyleOverrides] = useState<TemplateStyleOverrides>(
    () =>
      initialDraft?.styleOverrides ?? {
        ...(WEDDING_TEMPLATES[initialDraft?.selectedTemplateId || templateIds[0]]?.styles ||
          selectedTemplate.styles),
      }
  );
  const [images, setImages] = useState<InvitationImages>(() => ({
    coverImage:
      initialDraft?.images.coverImage ||
      selectedTemplate.content.hero.coverImage ||
      DEFAULT_INVITATION_IMAGES.coverImage,
    venueImage:
      initialDraft?.images.venueImage || DEFAULT_INVITATION_IMAGES.venueImage,
  }));

  const [audioUrl, setAudioUrl] = useState(
    () =>
      initialDraft?.audioUrl ||
      selectedTemplate.media.audioUrl ||
      DEFAULT_AUDIO_TRACK.url
  );
  const [audioTitle, setAudioTitle] = useState(
    () =>
      initialDraft?.audioTitle ||
      selectedTemplate.media.audioTitle ||
      DEFAULT_AUDIO_TRACK.title
  );

  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(
    initialDraft?.savedAt ?? null
  );
  // Qoralama tiklanganda (yoki bir xil shablon) style/image reset qilmaymiz
  const skipTemplateReset = useRef(Boolean(initialDraft) && !switchingTemplateFromHome);

  // Reset styles + images + audio to template defaults when user switches template
  useEffect(() => {
    if (skipTemplateReset.current) {
      skipTemplateReset.current = false;
      return;
    }
    const t = WEDDING_TEMPLATES[selectedTemplateId];
    if (!t) return;
    setStyleOverrides({ ...t.styles });
    setImages({
      coverImage: t.content.hero.coverImage || DEFAULT_INVITATION_IMAGES.coverImage,
      venueImage: DEFAULT_INVITATION_IMAGES.venueImage,
    });
    setAudioUrl(t.media.audioUrl);
    setAudioTitle(t.media.audioTitle);
  }, [selectedTemplateId]);

  const buildDraftPayload = () => ({
    selectedTemplateId,
    brideName,
    groomName,
    eventTitle,
    eventType,
    eventDate: combineDateTimeLocal(eventDateOnly, eventTime) || eventDateOnly,
    eventTime,
    eventShowTime: Boolean(eventTime.trim()),
    venueName,
    locationAddress,
    qizBazmiTitle,
    qizBazmiDate: combineDateTimeLocal(qizBazmiDateOnly, qizBazmiTime) || qizBazmiDateOnly,
    qizBazmiTime,
    qizBazmiShowTime: Boolean(qizBazmiTime.trim()),
    qizBazmiVenue,
    qizBazmiAddress,
    yandexUrl,
    googleUrl,
    twoGisUrl,
    telegramChatId,
    agenda,
    dressCodeTitle,
    dressCodeDesc,
    dressCodeColors,
    styleOverrides,
    images,
    audioUrl,
    audioTitle,
    createdInvitationId: createdInvitationId || undefined,
  });

  // Autosave qoralama (localStorage)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveBuilderDraft(buildDraftPayload());
      setDraftSavedAt(new Date().toISOString());
    }, 500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- buildDraftPayload fields listed below
  }, [
    selectedTemplateId,
    brideName,
    groomName,
    eventTitle,
    eventType,
    eventDateOnly,
    eventTime,
    venueName,
    locationAddress,
    qizBazmiTitle,
    qizBazmiDateOnly,
    qizBazmiTime,
    qizBazmiVenue,
    qizBazmiAddress,
    yandexUrl,
    googleUrl,
    twoGisUrl,
    telegramChatId,
    agenda,
    dressCodeTitle,
    dressCodeDesc,
    dressCodeColors,
    styleOverrides,
    images,
    audioUrl,
    audioTitle,
    createdInvitationId,
  ]);

  const handleStyleChange = (partial: Partial<TemplateStyleOverrides>) => {
    setStyleOverrides((prev) => mergeStyleOverrides(prev, partial));
  };

  const draftInvitation: Invitation = useMemo(
    () => ({
      id: 'PREVIEW',
      templateId: selectedTemplateId,
      status: 'PENDING',
      hostName: `${groomName} va ${brideName}`,
      brideName,
      groomName,
      eventTitle,
      eventType,
      eventDate: toStoredIso(eventDateOnly, eventTime),
      eventShowTime: Boolean(eventTime.trim()),
      venueName,
      locationAddress,
      qizBazmiTitle: selectedTemplateId === 'WD-101' ? qizBazmiTitle || 'Qiz bazmi' : undefined,
      qizBazmiDate:
        selectedTemplateId === 'WD-101'
          ? toStoredIso(
              qizBazmiDateOnly ||
                (() => {
                  const d = new Date(`${eventDateOnly}T12:00`);
                  d.setDate(d.getDate() - 1);
                  const pad = (n: number) => String(n).padStart(2, '0');
                  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                })(),
              qizBazmiTime
            )
          : undefined,
      qizBazmiShowTime:
        selectedTemplateId === 'WD-101' ? Boolean(qizBazmiTime.trim()) : undefined,
      qizBazmiVenue: selectedTemplateId === 'WD-101' ? qizBazmiVenue : undefined,
      qizBazmiAddress: selectedTemplateId === 'WD-101' ? qizBazmiAddress : undefined,
      yandexUrl,
      googleUrl,
      twoGisUrl,
      audioUrl,
      audioTitle,
      telegramChatId,
      agenda,
      dressCode: {
        title: dressCodeTitle,
        description: dressCodeDesc,
        colors: dressCodeColors,
      },
      customStyles: styleOverrides,
      coverImage: images.coverImage,
      venueImage: images.venueImage,
      rsvps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [
      selectedTemplateId,
      selectedTemplate,
      groomName,
      brideName,
      eventTitle,
      eventType,
      eventDateOnly,
      eventTime,
      venueName,
      locationAddress,
      qizBazmiTitle,
      qizBazmiDateOnly,
      qizBazmiTime,
      qizBazmiVenue,
      qizBazmiAddress,
      yandexUrl,
      googleUrl,
      twoGisUrl,
      telegramChatId,
      agenda,
      dressCodeTitle,
      dressCodeDesc,
      dressCodeColors,
      styleOverrides,
      images,
      audioUrl,
      audioTitle,
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-white border text-sm focus:outline-none focus:ring-1';
  const inputStyle = {
    color: BRAND.text,
    borderColor: BRAND.border,
  } as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Oversized data-URLs break Cloudflare/DO body limits and return HTML 413/502
      const MAX_INLINE = 450_000;
      const safeCover =
        images.coverImage?.startsWith('data:') && images.coverImage.length > MAX_INLINE
          ? ''
          : images.coverImage;
      const safeVenue =
        images.venueImage?.startsWith('data:') && images.venueImage.length > MAX_INLINE
          ? ''
          : images.venueImage;
      if (
        (images.coverImage?.startsWith('data:') && images.coverImage.length > MAX_INLINE) ||
        (images.venueImage?.startsWith('data:') && images.venueImage.length > MAX_INLINE)
      ) {
        throw new Error(
          'Yuklangan rasm juda katta. Galereyadan shablon rasm tanlang yoki kichikroq fayl yuklang.'
        );
      }

      // WD-101: Qiz bazmi majburiy saqlansin (bo‘sh sana bo‘lsa nikohdan 1 kun oldin)
      const qizPayload =
        selectedTemplateId === 'WD-101'
          ? (() => {
              let qizDate = qizBazmiDateOnly.trim();
              if (!qizDate) {
                const d = new Date(`${eventDateOnly}T12:00`);
                d.setDate(d.getDate() - 1);
                const pad = (n: number) => String(n).padStart(2, '0');
                qizDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
              }
              return {
                qizBazmiTitle: qizBazmiTitle.trim() || 'Qiz bazmi',
                qizBazmiDate: toStoredIso(qizDate, qizBazmiTime),
                qizBazmiShowTime: Boolean(qizBazmiTime.trim()),
                qizBazmiVenue: qizBazmiVenue.trim(),
                qizBazmiAddress: qizBazmiAddress.trim(),
              };
            })()
          : {};

      const payload = {
        templateId: selectedTemplateId,
        hostName: `${groomName} va ${brideName}`,
        brideName,
        groomName,
        eventTitle,
        eventType,
        eventDate: toStoredIso(eventDateOnly, eventTime),
        eventShowTime: Boolean(eventTime.trim()),
        venueName,
        locationAddress,
        ...qizPayload,
        yandexUrl,
        googleUrl,
        twoGisUrl,
        audioUrl,
        audioTitle,
        telegramChatId,
        agenda,
        dressCode: {
          title: dressCodeTitle,
          description: dressCodeDesc,
          colors: dressCodeColors,
        },
        customStyles: styleOverrides,
        coverImage: safeCover || undefined,
        venueImage: safeVenue || undefined,
      };

      // Oxirgi o‘zgarishlar localStorage’ga darhol yozilsin (orqaga qaytganda yo‘qolmasin)
      saveBuilderDraft(buildDraftPayload());

      const parseApi = (text: string, status: number) => {
        try {
          return text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            status === 413 || status === 502
              ? 'Rasm/so‘rov juda katta. Shablon rasmlardan foydalaning.'
              : status === 404
                ? 'API topilmadi (404). DigitalOcean URL dan foydalanayotganingizni tekshiring.'
                : `Server javob bermadi (HTTP ${status}).`
          );
        }
      };

      let updatingId = createdInvitationId;
      let res = await fetch(
        updatingId ? `/api/invitations/${updatingId}` : '/api/invitations',
        {
          method: updatingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      let data: { success?: boolean; data?: { id: string }; message?: string } = parseApi(
        await res.text(),
        res.status
      );

      // Eski ID topilmasa — yangisini yaratamiz
      if (updatingId && (res.status === 404 || !data.success)) {
        setCreatedInvitationId(null);
        updatingId = null;
        res = await fetch('/api/invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        data = parseApi(await res.text(), res.status);
      }

      if (data.success && data.data?.id) {
        const id = data.data.id;
        setCreatedInvitationId(id);
        saveBuilderDraft({
          ...buildDraftPayload(),
          createdInvitationId: id,
        });
        setDraftSavedAt(new Date().toISOString());
        onInvitationCreated(id);
      } else {
        throw new Error(data.message || 'Taklifnoma yaratilmadi');
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-3 sm:px-6" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6"
          style={{ borderColor: BRAND.border }}
        >
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-2 rounded-full border transition-all cursor-pointer hover:bg-white"
                style={{ borderColor: BRAND.borderAccent, color: BRAND.accent }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider"
                style={{ color: BRAND.accent }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{WEDDING_CATEGORY_LABEL}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif">Taklifnoma Yaratish</h1>
              {draftSavedAt && (
                <p className="text-xs mt-1" style={{ color: BRAND.muted }}>
                  Qoralama avtomatik saqlandi
                  {createdInvitationId ? ` · #${createdInvitationId}` : ''}
                </p>
              )}
            </div>
          </div>
          {createdInvitationId && (
            <button
              type="button"
              onClick={() => {
                if (
                  !window.confirm(
                    'Yangi taklifnoma boshlanadi. Joriy qoralama tozalanadi. Davom etasizmi?'
                  )
                ) {
                  return;
                }
                clearBuilderDraft();
                setCreatedInvitationId(null);
                window.location.href = '/builder';
              }}
              className="text-xs px-3 py-2 rounded-lg border cursor-pointer hover:bg-white"
              style={{ borderColor: BRAND.border, color: BRAND.muted }}
            >
              Yangi taklifnoma
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* LEFT — form + style customizer */}
          <div className="space-y-8 min-w-0">
            <div className="space-y-5">
              <h2 className="text-lg font-serif flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium"
                  style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
                >
                  1
                </span>
                Andozani Tanlang
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {templateIds.map((id) => {
                  const t = WEDDING_TEMPLATES[id];
                  if (!t) return null;
                  const active = selectedTemplateId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(t.id)}
                      className="rounded-xl border cursor-pointer relative transition-all bg-white text-left hover:shadow-md overflow-hidden"
                      style={{
                        borderColor: active ? BRAND.accent : BRAND.border,
                        boxShadow: active
                          ? `0 0 0 1px ${BRAND.accent}, 0 12px 28px rgba(30,41,59,0.08)`
                          : '0 8px 20px rgba(30,41,59,0.04)',
                      }}
                    >
                      {active && (
                        <div
                          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      <TemplatePreviewThumb
                        template={t}
                        groomName={groomName}
                        brideName={brideName}
                      />
                      <div className="px-2.5 py-2">
                        <h3 className="font-serif text-sm" style={{ color: BRAND.text }}>
                          {t.name}
                        </h3>
                        <p className="text-[10px]" style={{ color: BRAND.muted }}>
                          {t.id}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t" style={{ borderColor: BRAND.border }}>
              <h2 className="text-lg font-serif flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium"
                  style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
                >
                  2
                </span>
                Nikoh Ma&apos;lumotlari
              </h2>

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-xl border bg-white"
                style={{ borderColor: BRAND.borderAccent }}
              >
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                    Kuyovning Ismi
                  </label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                    Kelinning Ismi
                  </label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                    Sarlavha
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                    Marosim Turi
                  </label>
                  <input
                    type="text"
                    required
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                      Nikoh sanasi
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDateOnly}
                      onChange={(e) => setEventDateOnly(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <label className="block text-xs font-medium" style={{ color: BRAND.accent }}>
                        Vaqt (ixtiyoriy)
                      </label>
                      {eventTime ? (
                        <button
                          type="button"
                          onClick={() => setEventTime('')}
                          className="text-[10px] underline cursor-pointer"
                          style={{ color: BRAND.muted }}
                        >
                          Olib tashlash
                        </button>
                      ) : null}
                    </div>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                    Telegram RSVP
                  </label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                    To&apos;yxona Nomi
                  </label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                    Manzil
                  </label>
                  <input
                    type="text"
                    required
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              {selectedTemplateId === 'WD-101' && (
                <div
                  className="p-5 rounded-xl border bg-white space-y-4"
                  style={{ borderColor: BRAND.borderAccent }}
                >
                  <div>
                    <h3 className="font-serif" style={{ color: BRAND.text }}>
                      Qiz bazmi
                    </h3>
                    <p className="text-xs mt-1" style={{ color: BRAND.muted }}>
                      Nikoh bilan birga taklifnomada alohida qator bo‘lib chiqadi.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: BRAND.accent }}
                      >
                        Tadbir nomi
                      </label>
                      <input
                        type="text"
                        value={qizBazmiTitle}
                        onChange={(e) => setQizBazmiTitle(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Qiz bazmi"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: BRAND.accent }}
                      >
                        Sana
                      </label>
                      <input
                        type="date"
                        value={qizBazmiDateOnly}
                        onChange={(e) => setQizBazmiDateOnly(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <label className="block text-xs font-medium" style={{ color: BRAND.accent }}>
                          Vaqt (ixtiyoriy)
                        </label>
                        {qizBazmiTime ? (
                          <button
                            type="button"
                            onClick={() => setQizBazmiTime('')}
                            className="text-[10px] underline cursor-pointer"
                            style={{ color: BRAND.muted }}
                          >
                            Olib tashlash
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="time"
                        value={qizBazmiTime}
                        onChange={(e) => setQizBazmiTime(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: BRAND.accent }}
                      >
                        Joy nomi
                      </label>
                      <input
                        type="text"
                        value={qizBazmiVenue}
                        onChange={(e) => setQizBazmiVenue(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Masalan: Oilaviy hovli"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: BRAND.accent }}
                      >
                        Manzil
                      </label>
                      <input
                        type="text"
                        value={qizBazmiAddress}
                        onChange={(e) => setQizBazmiAddress(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                        placeholder="Manzil"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5 rounded-xl border bg-white space-y-3" style={{ borderColor: BRAND.borderAccent }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif" style={{ color: BRAND.text }}>
                    Dastur
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setAgenda([
                        ...agenda,
                        { time: '20:00', title: "Yangi Bo'lim", description: '', iconName: 'Clock' },
                      ])
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer border"
                    style={{ borderColor: BRAND.borderAccent, color: BRAND.accent }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Qo&apos;shish
                  </button>
                </div>
                <div className="space-y-2">
                  {agenda.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg border"
                      style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg }}
                    >
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const updated = [...agenda];
                          updated[idx].time = e.target.value;
                          setAgenda(updated);
                        }}
                        className="w-16 px-2 py-1.5 rounded border text-xs font-mono text-center bg-white"
                        style={{ borderColor: BRAND.border, color: BRAND.accent }}
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...agenda];
                          updated[idx].title = e.target.value;
                          setAgenda(updated);
                        }}
                        className="flex-1 px-2 py-1.5 rounded border text-xs bg-white"
                        style={{ borderColor: BRAND.border, color: BRAND.text }}
                      />
                      <button
                        type="button"
                        onClick={() => setAgenda(agenda.filter((_, i) => i !== idx))}
                        className="p-1.5 cursor-pointer"
                        style={{ color: '#BE123C' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-serif flex items-center gap-2 mb-4">
                  <span
                    className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium"
                    style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
                  >
                    3
                  </span>
                  Dizayn
                </h2>
                <StyleCustomizerPanel
                  styles={styleOverrides}
                  onStyleChange={handleStyleChange}
                />
              </div>

              <div>
                <h2 className="text-lg font-serif flex items-center gap-2 mb-4">
                  <span
                    className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium"
                    style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
                  >
                    4
                  </span>
                  Musiqa
                </h2>
                <AudioTrackPicker
                  audioUrl={audioUrl}
                  audioTitle={audioTitle}
                  onChange={(track) => {
                    setAudioUrl(track.url);
                    setAudioTitle(`${track.title} — ${track.artist}`);
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-xl font-serif text-lg flex items-center justify-center gap-3 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
              >
                <Eye className="w-5 h-5" />
                <span>{isSubmitting ? 'Tayyorlanmoqda...' : "Ko'rish va Tayyorlash"}</span>
              </button>
            </form>
          </div>

          {/* RIGHT — live preview */}
          <aside className="xl:sticky xl:top-6 min-w-0">
            <div
              className="rounded-xl border overflow-hidden bg-white"
              style={{ borderColor: BRAND.borderAccent, boxShadow: '0 16px 40px rgba(30,41,59,0.06)' }}
            >
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg }}
              >
                <p className="text-xs uppercase tracking-wider font-medium" style={{ color: BRAND.accent }}>
                  Live preview · {selectedTemplateId}
                </p>
              </div>
              <div
                className="max-h-[80vh] overflow-y-auto p-3 sm:p-4"
                style={{ backgroundColor: styleOverrides.colorBg }}
              >
                <WeddingRenderer
                  templateId={selectedTemplateId}
                  invitation={draftInvitation}
                  customStyles={styleOverrides}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
