import React, { useRef } from 'react';
import { Palette, Frame, Type, ImagePlus, Upload } from 'lucide-react';
import { BRAND } from '@/config/themes';
import { WEDDING_IMAGES } from '@/data/weddingImagery';
import {
  type TemplateStyleOverrides,
  type BorderStyleToken,
  type BorderRadiusToken,
  type FontHeaderToken,
  type FontBodyToken,
  type InvitationImages,
  STYLE_PALETTE_PRESETS,
  FRAME_TEMPLATES,
  HEADER_FONT_OPTIONS,
  BODY_FONT_OPTIONS,
} from '@/types/styleTokens';

export interface StyleCustomizerPanelProps {
  styles: TemplateStyleOverrides;
  onStyleChange: (partial: Partial<TemplateStyleOverrides>) => void;
  images: InvitationImages;
  onImagesChange: (partial: Partial<InvitationImages>) => void;
}

const PRESET_GALLERY = [
  { key: 'ringsClose', label: 'Uzuklar', url: WEDDING_IMAGES.ringsClose },
  { key: 'rings', label: 'Qo‘llar', url: WEDDING_IMAGES.rings },
  { key: 'ceremony', label: 'Marosim', url: WEDDING_IMAGES.ceremony },
  { key: 'venue', label: 'Zal', url: WEDDING_IMAGES.venue },
  { key: 'bouquet', label: 'Guldasta', url: WEDDING_IMAGES.bouquet },
  { key: 'evening', label: 'Kechki', url: WEDDING_IMAGES.evening },
] as const;

const ColorField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => {
  const isRgba = value.startsWith('rgba') || value.startsWith('rgb');
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: BRAND.muted }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        {!isRgba && (
          <input
            type="color"
            value={value.length === 7 ? value : '#D4A373'}
            onChange={(e) => onChange(e.target.value)}
            className="w-9 h-9 rounded-lg border cursor-pointer shrink-0 bg-white"
            style={{ borderColor: BRAND.border }}
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border text-xs font-mono bg-white"
          style={{ borderColor: BRAND.border, color: BRAND.text }}
        />
      </div>
    </label>
  );
};

function FramePreview({
  id,
  accent,
  active,
}: {
  id: BorderStyleToken;
  accent: string;
  active: boolean;
}) {
  const border = active ? accent : '#D4C4A8';
  if (id === 'classic_single') {
    return (
      <div
        className="h-14 rounded-md bg-[#FAF6F0]"
        style={{ border: `1px solid ${border}` }}
      />
    );
  }
  if (id === 'double_fine') {
    return (
      <div
        className="h-14 rounded-md bg-[#FAF6F0] p-1.5"
        style={{ border: `1px solid ${border}` }}
      >
        <div className="h-full rounded-sm" style={{ border: `1px dashed ${border}` }} />
      </div>
    );
  }
  if (id === 'glass_panel') {
    return (
      <div
        className="h-14 rounded-md relative overflow-hidden"
        style={{
          border: `1px solid ${border}`,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(250,246,240,0.55) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 30% 40%, rgba(212,163,115,0.35), transparent 55%)',
          }}
        />
      </div>
    );
  }
  return (
    <div
      className="h-14 rounded-md bg-[#FAF6F0]"
      style={{ boxShadow: '0 8px 20px rgba(30,41,59,0.12)' }}
    />
  );
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1200;
/** Keep each data-URL under ~450KB so DO/Cloudflare body limits are not hit */
const MAX_DATA_URL_CHARS = 450_000;

/** Downscale to JPEG so drafts fit in localStorage and API payloads stay small. */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Faylni o‘qib bo‘lmadi'));
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error('Rasm formati qo‘llab-quvvatlanmaydi'));
      img.onload = () => {
        let edge = MAX_IMAGE_EDGE;
        let quality = 0.78;
        const attempt = () => {
          const scale = Math.min(1, edge / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const out = canvas.toDataURL('image/jpeg', quality);
          if (out.length > MAX_DATA_URL_CHARS && (edge > 640 || quality > 0.5)) {
            edge = Math.round(edge * 0.8);
            quality = Math.max(0.45, quality - 0.1);
            attempt();
            return;
          }
          resolve(out);
        };
        attempt();
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

function ImageSlot({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      alert('Rasm 8 MB dan kichik bo‘lsin');
      return;
    }
    try {
      onChange(await compressImage(file));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Rasmni yuklab bo‘lmadi');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: BRAND.muted }}>
          {label}
        </span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border cursor-pointer"
          style={{ borderColor: BRAND.border, color: BRAND.text }}
        >
          <Upload className="w-3 h-3" />
          Yuklash
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      <div
        className="relative h-24 rounded-lg overflow-hidden border bg-stone-100"
        style={{ borderColor: BRAND.border }}
      >
        {value ? (
          <img src={value} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: BRAND.muted }}>
            <ImagePlus className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {PRESET_GALLERY.map((p) => {
          const active = value === p.url;
          return (
            <button
              key={`${label}-${p.key}`}
              type="button"
              title={p.label}
              onClick={() => onChange(p.url)}
              className="relative h-12 rounded-md overflow-hidden border cursor-pointer"
              style={{
                borderColor: active ? BRAND.accent : BRAND.border,
                boxShadow: active ? `0 0 0 1px ${BRAND.accent}` : undefined,
              }}
            >
              <img src={p.url} alt={p.label} className="w-full h-full object-cover" loading="lazy" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const StyleCustomizerPanel: React.FC<StyleCustomizerPanelProps> = ({
  styles,
  onStyleChange,
  images,
  onImagesChange,
}) => {
  return (
    <div
      className="rounded-xl border bg-white space-y-6 p-5"
      style={{ borderColor: BRAND.borderAccent }}
    >
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4" style={{ color: BRAND.accent }} />
        <h3 className="text-base font-serif" style={{ color: BRAND.text }}>
          Dizayn sozlamalari
        </h3>
      </div>

      {/* Images */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-3.5 h-3.5" style={{ color: BRAND.accent }} />
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: BRAND.accent }}>
            Rasmlar
          </p>
        </div>
        <p className="text-xs" style={{ color: BRAND.muted }}>
          Shablondan tanlang yoki o‘zingiz yuklang (max 2.5 MB).
        </p>
        <ImageSlot
          label="Asosiy / cover"
          value={images.coverImage}
          onChange={(url) => onImagesChange({ coverImage: url })}
        />
        <ImageSlot
          label="Joy / venue banner"
          value={images.venueImage}
          onChange={(url) => onImagesChange({ venueImage: url })}
        />
      </section>

      {/* Colors */}
      <section className="space-y-3">
        <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: BRAND.accent }}>
          Ranglar
        </p>
        <div className="grid grid-cols-2 gap-2">
          {STYLE_PALETTE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onStyleChange(p.partial)}
              className="text-left px-3 py-2.5 rounded-lg border text-xs cursor-pointer hover:opacity-90 transition-opacity"
              style={{ borderColor: BRAND.border, color: BRAND.text }}
            >
              <span className="flex gap-1 mb-1.5">
                {[
                  p.partial.colorBg,
                  p.partial.colorAccent,
                  p.partial.colorTextPrimary,
                ].map((c, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: c, borderColor: BRAND.border }}
                  />
                ))}
              </span>
              <span className="font-medium block">{p.nameUz}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <ColorField
            label="Fon (Bg)"
            value={styles.colorBg}
            onChange={(v) => onStyleChange({ colorBg: v })}
          />
          <ColorField
            label="Kartochka"
            value={styles.colorCardBg}
            onChange={(v) => onStyleChange({ colorCardBg: v })}
          />
          <ColorField
            label="Asosiy matn"
            value={styles.colorTextPrimary}
            onChange={(v) => onStyleChange({ colorTextPrimary: v })}
          />
          <ColorField
            label="Ikkinchi matn"
            value={styles.colorTextSecondary}
            onChange={(v) => onStyleChange({ colorTextSecondary: v })}
          />
          <ColorField
            label="Aksent"
            value={styles.colorAccent}
            onChange={(v) => onStyleChange({ colorAccent: v })}
          />
          <ColorField
            label="Chegara"
            value={styles.colorBorder}
            onChange={(v) => onStyleChange({ colorBorder: v })}
          />
        </div>
      </section>

      {/* Frame templates */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Frame className="w-3.5 h-3.5" style={{ color: BRAND.accent }} />
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: BRAND.accent }}>
            Ramka shablonlari
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {FRAME_TEMPLATES.map((tpl) => {
            const active = styles.borderStyle === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onStyleChange({ borderStyle: tpl.id })}
                className="text-left p-2.5 rounded-xl border cursor-pointer transition-shadow"
                style={{
                  borderColor: active ? BRAND.accent : BRAND.border,
                  backgroundColor: active ? `${BRAND.accent}10` : BRAND.white,
                  boxShadow: active ? `0 0 0 1px ${BRAND.accent}` : undefined,
                }}
              >
                <FramePreview id={tpl.id} accent={styles.colorAccent || BRAND.accent} active={active} />
                <span className="mt-2 text-xs font-medium block" style={{ color: BRAND.text }}>
                  {tpl.nameUz}
                </span>
                <span className="text-[10px] block" style={{ color: BRAND.muted }}>
                  {tpl.description}
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: BRAND.muted }}>
              Radius
            </span>
            <select
              value={styles.borderRadius}
              onChange={(e) =>
                onStyleChange({ borderRadius: e.target.value as BorderRadiusToken })
              }
              className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
              style={{ borderColor: BRAND.border, color: BRAND.text }}
            >
              {(['none', 'sm', 'md', 'lg', 'full'] as BorderRadiusToken[]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <ColorField
            label="Border rang"
            value={styles.colorBorder}
            onChange={(v) => onStyleChange({ colorBorder: v })}
          />
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Type className="w-3.5 h-3.5" style={{ color: BRAND.accent }} />
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: BRAND.accent }}>
            Tipografiya
          </p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: BRAND.muted }}>
            Sarlavha shrifti
          </span>
          <select
            value={styles.fontHeader}
            onChange={(e) =>
              onStyleChange({ fontHeader: e.target.value as FontHeaderToken })
            }
            className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white"
            style={{
              borderColor: BRAND.border,
              color: BRAND.text,
              fontFamily: `'${styles.fontHeader}', serif`,
            }}
          >
            {HEADER_FONT_OPTIONS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: `'${f}', serif` }}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: BRAND.muted }}>
            Matn shrifti
          </span>
          <select
            value={styles.fontBody}
            onChange={(e) => onStyleChange({ fontBody: e.target.value as FontBodyToken })}
            className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white"
            style={{
              borderColor: BRAND.border,
              color: BRAND.text,
              fontFamily: `'${styles.fontBody}', sans-serif`,
            }}
          >
            {BODY_FONT_OPTIONS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>
                {f}
              </option>
            ))}
          </select>
        </label>
      </section>
    </div>
  );
};

export default StyleCustomizerPanel;
