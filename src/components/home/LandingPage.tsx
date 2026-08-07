import React from 'react';
import { BRAND, WEDDING_CATEGORY_LABEL } from '../../config/themes';
import { ArrowRight, Heart, Send, Sparkles } from 'lucide-react';
import { WEDDING_TEMPLATES } from '@/config/weddingTemplates';
import { TemplatePreviewThumb } from '@/components/builder/TemplatePreviewThumb';
import { HeroSection } from '@/components/hero/HeroSection';

interface LandingPageProps {
  onCreateClick: () => void;
  onSelectSample: (id: string) => void;
  /** Open builder with a specific wedding template (WD-101 / WD-102 / WD-103) */
  onSelectTemplate: (templateId: string) => void;
  onAdminClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onCreateClick,
  onSelectSample,
  onSelectTemplate,
  onAdminClick,
}) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: BRAND.bg, color: BRAND.text }}
    >
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 md:px-12 py-5 border-b backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(253, 251, 247, 0.92)',
          borderColor: BRAND.borderAccent,
        }}
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border"
            style={{ backgroundColor: BRAND.white, borderColor: BRAND.borderAccent }}
          >
            <Heart className="w-4 h-4" style={{ color: BRAND.accent }} fill={BRAND.accent} />
          </div>
          <div>
            <span className="text-lg font-serif tracking-tight block" style={{ color: BRAND.text }}>
              Onlayn Taklifnoma
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-medium block leading-none"
              style={{ color: BRAND.accent }}
            >
              {WEDDING_CATEGORY_LABEL}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: BRAND.muted }}>
            <a href="#templates" className="hover:opacity-100 transition-opacity" style={{ color: BRAND.text }}>
              Andozalar
            </a>
            <a href="#how-it-works" className="hover:opacity-100 transition-opacity" style={{ color: BRAND.text }}>
              Bosqichlar
            </a>
            <button onClick={onAdminClick} className="hover:opacity-70 transition-opacity cursor-pointer">
              Admin
            </button>
          </div>

          <button
            onClick={onCreateClick}
            className="px-5 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 hover:opacity-90"
            style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Yaratish</span>
          </button>
        </div>
      </nav>

      <HeroSection
        onCreateClick={onCreateClick}
        onPreviewSample={() => onSelectSample('OT-84920')}
      />

      <section id="templates" className="py-20 px-4 sm:px-8 md:px-12 border-t" style={{ borderColor: BRAND.border }}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: BRAND.accent }}>
              {WEDDING_CATEGORY_LABEL}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal">Andoza</h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: BRAND.muted }}>
              To'y va nikoh marosimlari uchun nafis dizayn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Object.values(WEDDING_TEMPLATES).map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelectTemplate(template.id)}
                className="group flex flex-col text-left cursor-pointer"
              >
                <div
                  className="relative overflow-hidden mb-4 transition-all duration-300 group-hover:-translate-y-1 rounded-xl border"
                  style={{
                    backgroundColor: BRAND.white,
                    borderColor: BRAND.borderAccent,
                    boxShadow: '0 18px 40px rgba(30, 41, 59, 0.08)',
                  }}
                >
                  <TemplatePreviewThumb template={template} />
                </div>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] mb-1"
                  style={{ color: BRAND.accent }}
                >
                  {template.id}
                </p>
                <h3 className="font-serif text-lg mb-1" style={{ color: BRAND.text }}>
                  {template.name}
                </h3>
                <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: BRAND.muted }}>
                  {template.description}
                </p>
                <span
                  className="text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 group-hover:opacity-70 transition-opacity"
                  style={{ color: BRAND.accent }}
                >
                  <span>Tanlash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-8 md:px-12 border-t"
        style={{ borderColor: BRAND.border, backgroundColor: BRAND.white }}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: BRAND.accent }}>
              Jarayon
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal">4 Bosqichda Tayyor</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: "Ma'lumot Kiriting", desc: "Kelin-kuyov ismlari, sana, joy va musiqa." },
              { num: '02', title: 'Bepul Demo', desc: "Unikal ID va ko'rish rejimidagi taklifnoma." },
              { num: '03', title: 'Telegram Aktivlash', desc: "Admin orqali to'lov va faollashtirish." },
              { num: '04', title: 'Mehmonlarga Yuboring', desc: "Shaxsiy havolani tarqating va RSVP oling." },
            ].map((step) => (
              <div key={step.num} className="space-y-3">
                <span className="text-xs font-mono tracking-widest" style={{ color: BRAND.accent }}>
                  {step.num}
                </span>
                <h3 className="font-serif text-lg" style={{ color: BRAND.text }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: BRAND.muted }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        className="px-6 md:px-12 py-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
        style={{ borderColor: BRAND.border, color: BRAND.muted }}
      >
        <div className="flex gap-6 uppercase tracking-widest text-[10px]">
          <span>© 2026 Onlayn Taklifnoma</span>
          <span style={{ color: BRAND.accent }}>{WEDDING_CATEGORY_LABEL}</span>
        </div>
        <a
          href="https://t.me/onlayntaklifnomaadmin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          style={{ color: BRAND.text }}
        >
          <Send className="w-3.5 h-3.5" style={{ color: BRAND.accent }} />
          Telegram Admin
        </a>
      </footer>
    </div>
  );
};
