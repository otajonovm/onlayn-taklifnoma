import React, { useState } from 'react';
import { TEMPLATES } from '../../data/templates';
import { AgendaItem, DressCodeColor } from '../../types';
import { BRAND, WEDDING_CATEGORY_LABEL } from '../../config/themes';
import { Plus, Trash2, CheckCircle2, Eye, ArrowLeft, Sparkles } from 'lucide-react';

interface LiveBuilderProps {
  onInvitationCreated: (id: string) => void;
  onCancel?: () => void;
}

export const LiveBuilder: React.FC<LiveBuilderProps> = ({
  onInvitationCreated,
  onCancel,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);

  const [brideName, setBrideName] = useState('Nigora');
  const [groomName, setGroomName] = useState('Alisher');
  const [eventTitle, setEventTitle] = useState("Nikoh To'yi Marosimi");
  const [eventType, setEventType] = useState("Nikoh To'yi");
  const [eventDate, setEventDate] = useState('2026-08-16T18:00');
  const [venueName, setVenueName] = useState('Versal Tantanalar Saroyi');
  const [locationAddress, setLocationAddress] = useState(
    "Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi 102"
  );
  const [yandexUrl, setYandexUrl] = useState('https://yandex.uz/maps');
  const [googleUrl, setGoogleUrl] = useState('https://maps.google.com');
  const [twoGisUrl, setTwoGisUrl] = useState('https://2gis.uz');
  const [telegramChatId, setTelegramChatId] = useState('@my_wedding_bot');

  const [agenda, setAgenda] = useState<AgendaItem[]>([
    { time: '17:00', title: 'Mehmonlarni Kutib Olish', description: 'Lobi zalida tantanali kutib olish', iconName: 'Users' },
    { time: '18:00', title: 'Nikoh Marosimi & Fotiha', description: "Shar'iy nikoh va FHDYo", iconName: 'Heart' },
    { time: '19:00', title: 'Tantanali Shou Dasturi', description: 'Konsert va kechki taom', iconName: 'Music' },
  ]);

  const [dressCodeTitle, setDressCodeTitle] = useState('Black Tie / Rasmiy Kostyum & Kechki Libos');
  const [dressCodeDesc, setDressCodeDesc] = useState("Tantanamiz fil suyagi va qum-oltin bezaklarda o'tkaziladi.");
  const [dressCodeColors, setDressCodeColors] = useState<DressCodeColor[]>([
    { name: 'Qum Oltin', hex: BRAND.accent },
    { name: 'Slate', hex: BRAND.text },
    { name: 'Marvarid', hex: '#FAF6F0' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

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
      const payload = {
        templateId: selectedTemplateId,
        hostName: `${groomName} va ${brideName}`,
        brideName,
        groomName,
        eventTitle,
        eventType,
        eventDate: new Date(eventDate).toISOString(),
        venueName,
        locationAddress,
        yandexUrl,
        googleUrl,
        twoGisUrl,
        audioUrl: selectedTemplate.sampleMusicUrl,
        audioTitle: selectedTemplate.sampleMusicTitle,
        telegramChatId,
        agenda,
        dressCode: {
          title: dressCodeTitle,
          description: dressCodeDesc,
          colors: dressCodeColors,
        },
      };

      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onInvitationCreated(data.data.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8" style={{ backgroundColor: BRAND.bg, color: BRAND.text }}>
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: BRAND.border }}>
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
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider" style={{ color: BRAND.accent }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{WEDDING_CATEGORY_LABEL}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif">Taklifnoma Yaratish</h1>
            </div>
          </div>
        </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className="p-3 rounded-xl border cursor-pointer relative transition-all bg-white hover:shadow-sm"
                style={{
                  borderColor: selectedTemplateId === t.id ? BRAND.accent : BRAND.border,
                  boxShadow: selectedTemplateId === t.id ? `0 0 0 1px ${BRAND.accent}` : undefined,
                }}
              >
                {selectedTemplateId === t.id && (
                  <div
                    className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <img src={t.thumbnail} alt={t.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className="font-serif text-sm" style={{ color: BRAND.text }}>
                  {t.title}
                </h3>
                <p className="text-[11px] mt-1 line-clamp-2" style={{ color: BRAND.muted }}>
                  {t.description}
                </p>
              </div>
            ))}
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
            Nikoh Ma'lumotlari
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-xl border bg-white"
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
                onChange={(e) => {
                  setGroomName(e.target.value);
                }}
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
                onChange={(e) => {
                  setBrideName(e.target.value);
                }}
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
                placeholder="Nikoh To'yi, Fotiha To'yi"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                Sana va Vaqt
              </label>
              <input
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
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
                To'yxona Nomi
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
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                Yandex Maps
              </label>
              <input
                type="url"
                value={yandexUrl}
                onChange={(e) => setYandexUrl(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: BRAND.accent }}>
                Google Maps
              </label>
              <input
                type="url"
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-white space-y-4" style={{ borderColor: BRAND.borderAccent }}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif" style={{ color: BRAND.text }}>
                Dastur (Agenda)
              </h3>
              <button
                type="button"
                onClick={() =>
                  setAgenda([...agenda, { time: '20:00', title: "Yangi Bo'lim", description: '', iconName: 'Clock' }])
                }
                className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer border"
                style={{ borderColor: BRAND.borderAccent, color: BRAND.accent }}
              >
                <Plus className="w-3.5 h-3.5" />
                Qo'shish
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

          <div className="p-6 rounded-xl border bg-white space-y-4" style={{ borderColor: BRAND.borderAccent }}>
            <h3 className="font-serif">Dress Code</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={dressCodeTitle}
                onChange={(e) => setDressCodeTitle(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="Sarlavha"
              />
              <input
                type="text"
                value={dressCodeDesc}
                onChange={(e) => setDressCodeDesc(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="Izoh"
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {dressCodeColors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg border"
                  style={{ borderColor: BRAND.border, backgroundColor: BRAND.bg }}
                >
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => {
                      const updated = [...dressCodeColors];
                      updated[idx].hex = e.target.value;
                      setDressCodeColors(updated);
                    }}
                    className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => {
                      const updated = [...dressCodeColors];
                      updated[idx].name = e.target.value;
                      setDressCodeColors(updated);
                    }}
                    className="w-20 text-xs bg-transparent focus:outline-none"
                    style={{ color: BRAND.text }}
                  />
                  <button
                    type="button"
                    onClick={() => setDressCodeColors(dressCodeColors.filter((_, i) => i !== idx))}
                    className="text-xs cursor-pointer"
                    style={{ color: '#BE123C' }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDressCodeColors([...dressCodeColors, { name: 'Yangi', hex: BRAND.accent }])}
                className="text-xs cursor-pointer"
                style={{ color: BRAND.accent }}
              >
                + Rang
              </button>
            </div>
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
    </div>
  );
};
