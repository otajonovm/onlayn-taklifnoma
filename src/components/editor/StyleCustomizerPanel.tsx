import React from 'react';
import { Palette, Frame, Type } from 'lucide-react';
import { BRAND } from '@/config/themes';
import {
  type TemplateStyleOverrides,
  type BorderStyleToken,
  type BorderRadiusToken,
  type FontHeaderToken,
  type FontBodyToken,
  STYLE_PALETTE_PRESETS,
  FRAME_TEMPLATES,
  HEADER_FONT_OPTIONS,
  BODY_FONT_OPTIONS,
} from '@/types/styleTokens';

export interface StyleCustomizerPanelProps {
  styles: TemplateStyleOverrides;
  onStyleChange: (partial: Partial<TemplateStyleOverrides>) => void;
}

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

export const StyleCustomizerPanel: React.FC<StyleCustomizerPanelProps> = ({
  styles,
  onStyleChange,
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
