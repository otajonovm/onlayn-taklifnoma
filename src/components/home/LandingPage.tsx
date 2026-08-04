import React from 'react';
import { TEMPLATES } from '../../data/templates';
import { BRAND, WEDDING_CATEGORY_LABEL } from '../../config/themes';
import { WEDDING_IMAGES } from '../../data/weddingImagery';
import { ArrowRight, Heart, Send, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onCreateClick: () => void;
  onSelectSample: (id: string) => void;
  onAdminClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onCreateClick,
  onSelectSample,
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

      <main className="relative flex-1 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto w-full pt-16 md:pt-24 pb-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <p
            className="text-[11px] uppercase tracking-[0.25em] font-medium"
            style={{ color: BRAND.accent }}
          >
            Premium To'y & Nikoh Taklifnomalari
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal leading-[1.15] tracking-tight">
            Onlayn Taklifnoma
          </h1>

          <p className="text-base sm:text-lg max-w-lg mx-auto leading-relaxed" style={{ color: BRAND.muted }}>
            Nikoh to'yingiz uchun nafis, minimalist raqamli taklifnoma — ochiluvchi konvert,
            musiqa va Telegram orqali RSVP.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onCreateClick}
              className="px-8 py-3.5 rounded-full font-medium text-sm flex items-center gap-2 transition-all cursor-pointer hover:opacity-90"
              style={{ backgroundColor: BRAND.accent, color: BRAND.white }}
            >
              <span>Taklifnoma Yaratish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectSample('OT-84920')}
              className="px-8 py-3.5 rounded-full font-medium text-sm border transition-all cursor-pointer hover:bg-white"
              style={{ borderColor: BRAND.borderAccent, color: BRAND.text, backgroundColor: BRAND.white }}
            >
              Namunani Ko'rish
            </button>
          </div>
        </div>

        {/* Hero invitation preview — full-bleed visual plane via large composition */}
        <div className="mt-20 max-w-md mx-auto">
          <div
            className="relative aspect-3/4 rounded-sm overflow-hidden border"
            style={{
              backgroundColor: BRAND.white,
              borderColor: BRAND.borderAccent,
              boxShadow: '0 24px 48px rgba(30, 41, 59, 0.06)',
            }}
          >
            <img
              src={WEDDING_IMAGES.ringsClose}
              alt="Nikoh uzuklari"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-end p-10 text-center"
              style={{
                background: 'linear-gradient(to top, rgba(253,251,247,0.97) 0%, rgba(253,251,247,0.55) 45%, transparent 70%)',
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: BRAND.accent }}>
                Nikoh To'yi
              </p>
              <h2 className="text-3xl font-serif mb-2" style={{ color: BRAND.text }}>
                Alisher <span className="italic font-light" style={{ color: BRAND.accent }}>&</span> Nigora
              </h2>
              <div className="w-10 h-px mb-3" style={{ backgroundColor: BRAND.accent }} />
              <p className="text-sm" style={{ color: BRAND.muted }}>Shanba, 16-Avgust 2026</p>
            </div>
          </div>
        </div>
      </main>

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

          <div className="grid grid-cols-1 max-w-sm mx-auto gap-6">
            {TEMPLATES.map((template) => (
              <div key={template.id} className="group flex flex-col">
                <div
                  className="relative aspect-4/5 overflow-hidden border mb-4"
                  style={{
                    borderColor: BRAND.borderAccent,
                    backgroundColor: BRAND.white,
                    boxShadow: '0 16px 36px rgba(30, 41, 59, 0.05)',
                  }}
                >
                  {/* Invitation hero preview (same composition as main hero) */}
                  <img
                    src={WEDDING_IMAGES.ringsClose}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(253,251,247,0.97) 0%, rgba(253,251,247,0.55) 45%, transparent 70%)',
                    }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.3em] mb-3"
                      style={{ color: BRAND.accent }}
                    >
                      Nikoh To'yi
                    </p>
                    <h3 className="text-2xl font-serif mb-2" style={{ color: BRAND.text }}>
                      Alisher{' '}
                      <span className="italic font-light" style={{ color: BRAND.accent }}>
                        &
                      </span>{' '}
                      Nigora
                    </h3>
                    <div className="w-10 h-px mb-3" style={{ backgroundColor: BRAND.accent }} />
                    <p className="text-sm" style={{ color: BRAND.muted }}>
                      Shanba, 16-Avgust 2026
                    </p>
                  </div>
                </div>
                <h3 className="font-serif text-lg mb-1" style={{ color: BRAND.text }}>
                  {template.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: BRAND.muted }}>
                  {template.description}
                </p>
                <button
                  onClick={onCreateClick}
                  className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: BRAND.accent }}
                >
                  <span>Tanlash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
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
