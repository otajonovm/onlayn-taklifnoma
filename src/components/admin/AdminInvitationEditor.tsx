import React, { useEffect, useState } from 'react';
import type { AgendaItem, Invitation } from '@/types';
import { adminAuthHeaders } from '@/lib/adminAuth';
import { splitDateTimeLocal, toStoredIso } from '@/lib/eventDateTime';
import { WEDDING_TEMPLATES } from '@/config/weddingTemplates';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const UI = {
  emerald: '#0F5132',
  gold: '#D4AF37',
  cream: '#FDFBF7',
  charcoal: '#1A1A1A',
  muted: '#64748B',
  border: 'rgba(212, 175, 55, 0.35)',
} as const;

interface AdminInvitationEditorProps {
  invitation: Invitation;
  onClose: () => void;
  onSaved: (next: Invitation) => void;
}

export const AdminInvitationEditor: React.FC<AdminInvitationEditorProps> = ({
  invitation,
  onClose,
  onSaved,
}) => {
  const nikoh = splitDateTimeLocal(invitation.eventDate);
  const qiz = splitDateTimeLocal(invitation.qizBazmiDate);

  const [templateId, setTemplateId] = useState(invitation.templateId || 'WD-101');
  const [groomName, setGroomName] = useState(invitation.groomName || '');
  const [brideName, setBrideName] = useState(invitation.brideName || '');
  const [hostName, setHostName] = useState(invitation.hostName || '');
  const [eventTitle, setEventTitle] = useState(invitation.eventTitle || '');
  const [eventType, setEventType] = useState(invitation.eventType || '');
  const [eventDateOnly, setEventDateOnly] = useState(nikoh.date || '');
  const [eventTime, setEventTime] = useState(
    invitation.eventShowTime === false ? '' : nikoh.time || ''
  );
  const [venueName, setVenueName] = useState(invitation.venueName || '');
  const [locationAddress, setLocationAddress] = useState(invitation.locationAddress || '');
  const [qizBazmiTitle, setQizBazmiTitle] = useState(invitation.qizBazmiTitle || 'Qiz bazmi');
  const [qizBazmiDateOnly, setQizBazmiDateOnly] = useState(qiz.date || '');
  const [qizBazmiTime, setQizBazmiTime] = useState(
    invitation.qizBazmiShowTime === false ? '' : qiz.time || ''
  );
  const [qizBazmiVenue, setQizBazmiVenue] = useState(invitation.qizBazmiVenue || '');
  const [qizBazmiAddress, setQizBazmiAddress] = useState(invitation.qizBazmiAddress || '');
  const [yandexUrl, setYandexUrl] = useState(invitation.yandexUrl || '');
  const [googleUrl, setGoogleUrl] = useState(invitation.googleUrl || '');
  const [twoGisUrl, setTwoGisUrl] = useState(invitation.twoGisUrl || '');
  const [telegramChatId, setTelegramChatId] = useState(invitation.telegramChatId || '');
  const [audioTitle, setAudioTitle] = useState(invitation.audioTitle || '');
  const [audioUrl, setAudioUrl] = useState(invitation.audioUrl || '');
  const [agenda, setAgenda] = useState<AgendaItem[]>(
    Array.isArray(invitation.agenda) ? invitation.agenda : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const inputClass =
    'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none bg-white';
  const inputStyle = { borderColor: UI.border, color: UI.charcoal } as const;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDateOnly.trim()) {
      setError('Nikoh sanasi majburiy');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        templateId,
        groomName,
        brideName,
        hostName: hostName.trim() || `${groomName} va ${brideName}`.trim(),
        eventTitle,
        eventType,
        eventDate: toStoredIso(eventDateOnly, eventTime),
        eventShowTime: Boolean(eventTime.trim()),
        venueName,
        locationAddress,
        yandexUrl,
        googleUrl,
        twoGisUrl,
        telegramChatId,
        audioTitle,
        audioUrl,
        agenda,
      };

      if (templateId === 'WD-101') {
        payload.qizBazmiTitle = qizBazmiTitle.trim() || 'Qiz bazmi';
        payload.qizBazmiDate = qizBazmiDateOnly.trim()
          ? toStoredIso(qizBazmiDateOnly, qizBazmiTime)
          : '';
        payload.qizBazmiShowTime = Boolean(qizBazmiTime.trim());
        payload.qizBazmiVenue = qizBazmiVenue;
        payload.qizBazmiAddress = qizBazmiAddress;
      }

      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...adminAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Saqlash muvaffaqiyatsiz');
      }
      onSaved(data.data as Invitation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(26,26,26,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border shadow-xl"
        style={{ backgroundColor: UI.cream, borderColor: UI.border }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b"
          style={{ backgroundColor: UI.cream, borderColor: UI.border }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: UI.gold }}>
              Tahrirlash
            </p>
            <h2 className="text-lg font-serif" style={{ color: UI.charcoal }}>
              #{invitation.id}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full border cursor-pointer"
            style={{ borderColor: UI.border, color: UI.muted }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Andoza">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                {Object.keys(WEDDING_TEMPLATES).map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Mezbon (hostName)">
              <input
                className={inputClass}
                style={inputStyle}
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
              />
            </Field>
            <Field label="Kuyov">
              <input
                className={inputClass}
                style={inputStyle}
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
              />
            </Field>
            <Field label="Kelin">
              <input
                className={inputClass}
                style={inputStyle}
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
              />
            </Field>
            <Field label="Tadbir nomi">
              <input
                className={inputClass}
                style={inputStyle}
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </Field>
            <Field label="Marosim turi">
              <input
                className={inputClass}
                style={inputStyle}
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              />
            </Field>
            <Field label="Nikoh sanasi">
              <input
                type="date"
                required
                className={inputClass}
                style={inputStyle}
                value={eventDateOnly}
                onChange={(e) => setEventDateOnly(e.target.value)}
              />
            </Field>
            <Field
              label="Nikoh vaqti (ixtiyoriy)"
              action={
                eventTime ? (
                  <button
                    type="button"
                    className="text-[10px] underline cursor-pointer"
                    style={{ color: UI.muted }}
                    onClick={() => setEventTime('')}
                  >
                    Olib tashlash
                  </button>
                ) : null
              }
            >
              <input
                type="time"
                className={inputClass}
                style={inputStyle}
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </Field>
            <Field label="To‘yxona">
              <input
                className={inputClass}
                style={inputStyle}
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
              />
            </Field>
            <Field label="Manzil">
              <input
                className={inputClass}
                style={inputStyle}
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
              />
            </Field>
          </div>

          {templateId === 'WD-101' && (
            <div
              className="rounded-xl border p-4 space-y-3"
              style={{ borderColor: UI.border, backgroundColor: '#fff' }}
            >
              <p className="text-sm font-serif" style={{ color: UI.charcoal }}>
                Qiz bazmi
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Nomi">
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={qizBazmiTitle}
                    onChange={(e) => setQizBazmiTitle(e.target.value)}
                  />
                </Field>
                <Field label="Sana">
                  <input
                    type="date"
                    className={inputClass}
                    style={inputStyle}
                    value={qizBazmiDateOnly}
                    onChange={(e) => setQizBazmiDateOnly(e.target.value)}
                  />
                </Field>
                <Field
                  label="Vaqt (ixtiyoriy)"
                  action={
                    qizBazmiTime ? (
                      <button
                        type="button"
                        className="text-[10px] underline cursor-pointer"
                        style={{ color: UI.muted }}
                        onClick={() => setQizBazmiTime('')}
                      >
                        Olib tashlash
                      </button>
                    ) : null
                  }
                >
                  <input
                    type="time"
                    className={inputClass}
                    style={inputStyle}
                    value={qizBazmiTime}
                    onChange={(e) => setQizBazmiTime(e.target.value)}
                  />
                </Field>
                <Field label="Joy">
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={qizBazmiVenue}
                    onChange={(e) => setQizBazmiVenue(e.target.value)}
                  />
                </Field>
                <Field label="Manzil">
                  <input
                    className={inputClass}
                    style={inputStyle}
                    value={qizBazmiAddress}
                    onChange={(e) => setQizBazmiAddress(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Yandex Maps">
              <input
                className={inputClass}
                style={inputStyle}
                value={yandexUrl}
                onChange={(e) => setYandexUrl(e.target.value)}
              />
            </Field>
            <Field label="Google Maps">
              <input
                className={inputClass}
                style={inputStyle}
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
              />
            </Field>
            <Field label="2GIS">
              <input
                className={inputClass}
                style={inputStyle}
                value={twoGisUrl}
                onChange={(e) => setTwoGisUrl(e.target.value)}
              />
            </Field>
            <Field label="Telegram chat ID">
              <input
                className={inputClass}
                style={inputStyle}
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
              />
            </Field>
            <Field label="Audio nomi">
              <input
                className={inputClass}
                style={inputStyle}
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
              />
            </Field>
            <Field label="Audio URL">
              <input
                className={inputClass}
                style={inputStyle}
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
              />
            </Field>
          </div>

          <div
            className="rounded-xl border p-4 space-y-3"
            style={{ borderColor: UI.border, backgroundColor: '#fff' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-serif" style={{ color: UI.charcoal }}>
                Dastur
              </p>
              <button
                type="button"
                onClick={() =>
                  setAgenda([
                    ...agenda,
                    { time: '18:00', title: 'Yangi band', description: '', iconName: 'Clock' },
                  ])
                }
                className="px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1 cursor-pointer"
                style={{ borderColor: UI.border, color: UI.gold }}
              >
                <Plus className="w-3 h-3" /> Qo‘shish
              </button>
            </div>
            {agenda.length === 0 ? (
              <p className="text-xs" style={{ color: UI.muted }}>
                Dastur bo‘sh — taklifnomada ko‘rinmaydi.
              </p>
            ) : (
              <div className="space-y-2">
                {agenda.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[5rem_1fr_auto] gap-2 items-start">
                    <input
                      className={inputClass}
                      style={inputStyle}
                      value={item.time}
                      onChange={(e) => {
                        const next = [...agenda];
                        next[idx] = { ...item, time: e.target.value };
                        setAgenda(next);
                      }}
                      placeholder="18:00"
                    />
                    <div className="space-y-1">
                      <input
                        className={inputClass}
                        style={inputStyle}
                        value={item.title}
                        onChange={(e) => {
                          const next = [...agenda];
                          next[idx] = { ...item, title: e.target.value };
                          setAgenda(next);
                        }}
                        placeholder="Sarlavha"
                      />
                      <input
                        className={inputClass}
                        style={inputStyle}
                        value={item.description || ''}
                        onChange={(e) => {
                          const next = [...agenda];
                          next[idx] = { ...item, description: e.target.value };
                          setAgenda(next);
                        }}
                        placeholder="Izoh"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setAgenda(agenda.filter((_, i) => i !== idx))}
                      className="p-2 rounded-lg border cursor-pointer"
                      style={{ borderColor: UI.border, color: UI.muted }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border text-sm cursor-pointer"
              style={{ borderColor: UI.border, color: UI.muted }}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: UI.emerald, color: UI.cream }}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Field({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 gap-2">
        <label className="block text-[11px] font-medium" style={{ color: UI.gold }}>
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}
