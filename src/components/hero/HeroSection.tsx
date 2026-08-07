import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  Crown,
  GraduationCap,
  Heart,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { WEDDING_IMAGES } from '@/data/weddingImagery';
import { DEFAULT_AUDIO_TRACK } from '@/data/audioTracks';

const HERO = {
  emerald: '#0F5132',
  gold: '#D4AF37',
  rose: '#B76E79',
  ivory: '#FAFAFA',
  cream: '#FDFBF7',
  charcoal: '#1A1A1A',
} as const;

type CategoryId = 'nikoh' | 'sunnat' | 'bitiruv' | 'korporativ';

interface CategoryCard {
  id: CategoryId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  accent: string;
  secondary: string;
  eventTitle: string;
  coupleLine: string;
  dateLine: string;
  cover: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'nikoh',
    label: "Nikoh To'yi",
    shortLabel: '💍 Nikoh',
    icon: <Heart className="w-3.5 h-3.5" />,
    accent: HERO.gold,
    secondary: HERO.emerald,
    eventTitle: "Nikoh To'yi",
    coupleLine: 'Alisher & Nigora',
    dateLine: '16-Avgust · 2026',
    cover: WEDDING_IMAGES.ceremony,
  },
  {
    id: 'sunnat',
    label: "Sunnat / Beshik",
    shortLabel: '👑 Sunnat',
    icon: <Crown className="w-3.5 h-3.5" />,
    accent: HERO.rose,
    secondary: '#7A3E48',
    eventTitle: "Sunnat To'yi",
    coupleLine: 'Umidjon',
    dateLine: '12-Sentabr · 2026',
    cover: WEDDING_IMAGES.bouquet,
  },
  {
    id: 'bitiruv',
    label: 'Bitiruv / Maktab',
    shortLabel: '🎓 Bitiruv',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    accent: '#3D6B8C',
    secondary: HERO.gold,
    eventTitle: 'Bitiruv Kechasi',
    coupleLine: '11-A Sinf',
    dateLine: '28-Iyun · 2026',
    cover: WEDDING_IMAGES.evening,
  },
  {
    id: 'korporativ',
    label: 'Korporativ',
    shortLabel: '💼 Korporativ',
    icon: <Briefcase className="w-3.5 h-3.5" />,
    accent: HERO.emerald,
    secondary: HERO.gold,
    eventTitle: 'Korporativ Tadbir',
    coupleLine: 'Onlayn Taklifnoma',
    dateLine: '5-Oktabr · 2026',
    cover: WEDDING_IMAGES.venue,
  },
];

interface HeroSectionProps {
  onCreateClick: () => void;
  onPreviewSample: () => void;
}

function burstGold(x: number, y: number) {
  confetti({
    particleCount: 28,
    spread: 48,
    startVelocity: 22,
    gravity: 0.85,
    ticks: 90,
    origin: { x, y },
    colors: [HERO.gold, '#F3E5AB', HERO.emerald, HERO.ivory],
    disableForReducedMotion: true,
  });
}

const InvitationCard: React.FC<{
  category: CategoryCard;
  guestName: string;
  audioOn: boolean;
  onToggleAudio: () => void;
}> = ({ category, guestName, audioOn, onToggleAudio }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 22 });
  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 55%)`;

  const displayName = guestName.trim() || 'Mehmon';
  const personalLine = `Hurmatli ${displayName}, sizni taklif etamiz!`;

  const handleMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto" style={{ perspective: 1000 }}>
      {/* Ambient glow */}
      <div
        className="absolute -inset-8 rounded-full blur-[80px] opacity-60 pointer-events-none"
        style={{ backgroundColor: `${category.accent}33` }}
      />

      <motion.div
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerLeave={resetTilt}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative aspect-3/4 rounded-2xl overflow-hidden border will-change-transform"
        style={{
          rotateX: rx,
          rotateY: ry,
          transformStyle: 'preserve-3d' as const,
          borderColor: `${HERO.gold}4D`,
          boxShadow: `0 28px 60px rgba(26,26,26,0.14), 0 0 0 1px ${HERO.gold}22, inset 0 1px 0 rgba(255,255,255,0.35)`,
          backgroundColor: HERO.ivory,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0"
          >
            <img
              src={category.cover}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(26,26,26,0.15) 0%, rgba(26,26,26,0.25) 35%, ${HERO.cream}f2 72%, ${HERO.cream} 100%)`,
              }}
            />
            <motion.div className="absolute inset-0 mix-blend-soft-light pointer-events-none" style={{ background: glare }} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 text-center z-10">
          <p
            className="text-[10px] uppercase tracking-[0.28em] mb-2 font-medium"
            style={{ color: category.accent, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {category.eventTitle}
          </p>
          <h3
            className="text-2xl sm:text-[1.7rem] leading-tight mb-2"
            style={{ color: HERO.charcoal, fontFamily: "'Playfair Display', serif" }}
          >
            {category.coupleLine}
          </h3>
          <div className="w-10 h-px mx-auto mb-3" style={{ backgroundColor: category.accent }} />
          <p
            className="text-xs sm:text-sm leading-relaxed mb-3 min-h-10"
            style={{ color: HERO.charcoal, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {personalLine}{' '}
            <span aria-hidden>✨</span>
          </p>
          <p className="text-[11px] tracking-wide" style={{ color: `${HERO.charcoal}99` }}>
            {category.dateLine}
          </p>
        </div>

        {/* Audio floating toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAudio();
          }}
          aria-label={audioOn ? 'Musiqani to‘xtatish' : 'Musiqani yoqish'}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-md cursor-pointer transition-transform hover:scale-105"
          style={{
            backgroundColor: 'rgba(253,251,247,0.82)',
            borderColor: `${HERO.gold}55`,
            color: audioOn ? HERO.emerald : HERO.charcoal,
            boxShadow: '0 8px 20px rgba(26,26,26,0.1)',
          }}
        >
          {audioOn ? (
            <span className="relative flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
              <span className="absolute -bottom-1 flex gap-0.5">
                <span className="w-0.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: HERO.gold }} />
                <span className="w-0.5 h-2 rounded-full animate-pulse [animation-delay:120ms]" style={{ backgroundColor: HERO.gold }} />
                <span className="w-0.5 h-1 rounded-full animate-pulse [animation-delay:240ms]" style={{ backgroundColor: HERO.gold }} />
              </span>
            </span>
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Gold corner accents */}
        <div
          className="absolute top-3 left-3 w-6 h-6 border-t border-l pointer-events-none"
          style={{ borderColor: `${HERO.gold}88` }}
        />
        <div
          className="absolute bottom-3 right-3 w-6 h-6 border-b border-r pointer-events-none"
          style={{ borderColor: `${HERO.gold}88` }}
        />
      </motion.div>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onCreateClick, onPreviewSample }) => {
  const [guestName, setGuestName] = useState('');
  const [audioOn, setAudioOn] = useState(false);
  const [comingSoonNote, setComingSoonNote] = useState<string | null>(null);
  const comingSoonTimer = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Hozircha faqat nikoh to'yi mavjud
  const active = CATEGORIES[0];

  useEffect(() => {
    const audio = new Audio(DEFAULT_AUDIO_TRACK.url);
    audio.loop = true;
    audio.volume = 0.28;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
      if (comingSoonTimer.current) window.clearTimeout(comingSoonTimer.current);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioOn) {
      void audio.play().catch(() => setAudioOn(false));
    } else {
      audio.pause();
    }
  }, [audioOn]);

  const selectCategory = useCallback((id: CategoryId) => {
    if (id !== 'nikoh') {
      const label = CATEGORIES.find((c) => c.id === id)?.label || 'Bu bo‘lim';
      setComingSoonNote(`${label} hozirda tayyorlanmoqda`);
      if (comingSoonTimer.current) window.clearTimeout(comingSoonTimer.current);
      comingSoonTimer.current = window.setTimeout(() => setComingSoonNote(null), 2800);
      return;
    }

    setComingSoonNote(null);
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) {
      burstGold((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height * 0.35) / window.innerHeight);
    }
  }, []);

  const handleCreate = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    burstGold(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );
    onCreateClick();
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: HERO.cream,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: HERO.charcoal,
      }}
    >
      {/* Ambient gold blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-24 -left-16 w-85 h-85 rounded-full bg-[#D4AF37]/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-95 h-95 rounded-full bg-[#0F5132]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-70 h-70 rounded-full bg-[#B76E79]/10 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 md:px-12 pt-10 sm:pt-14 md:pt-16 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* ── Left: copy + demo + CTAs ── */}
          <div className="order-1 space-y-7 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
              style={{
                borderColor: `${HERO.gold}55`,
                backgroundColor: 'rgba(255,255,255,0.65)',
                boxShadow: '0 8px 24px rgba(212,175,55,0.12)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: HERO.gold }} />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: HERO.gold }}>
                Premium raqamli taklifnomalar
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="space-y-4"
            >
              <h1
                className="text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.12] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <span className="block" style={{ color: HERO.charcoal }}>
                  Onlayn Taklifnoma
                </span>
                <span className="block mt-1 italic font-normal" style={{ color: HERO.gold }}>
                  bir daqiqada — nafis va jonli
                </span>
              </h1>
              <p className="text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0" style={{ color: `${HERO.charcoal}B3` }}>
                Ismingizni yozing — taklifnoma darhol shaxsiylashadi. Musiqa, 3D ochilish va Telegram RSVP
                bilan mehmonlaringizni hayratda qoldiring.
              </p>
            </motion.div>

            {/* Live name demo */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="max-w-md mx-auto lg:mx-0 text-left"
            >
              <label
                htmlFor="hero-guest-name"
                className="block text-xs sm:text-sm font-medium mb-2"
                style={{ color: HERO.gold }}
              >
                Oʻzingiz sinab koʻring (Ismingizni kiriting):
              </label>
              <div
                className="relative rounded-2xl border overflow-hidden"
                style={{
                  borderColor: `${HERO.gold}66`,
                  backgroundColor: 'rgba(255,255,255,0.78)',
                  boxShadow: '0 12px 32px rgba(26,26,26,0.06)',
                }}
              >
                <input
                  id="hero-guest-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value.slice(0, 28))}
                  placeholder="Masalan: Sardor"
                  autoComplete="given-name"
                  className="w-full bg-transparent px-4 py-3.5 text-sm sm:text-base outline-none placeholder:opacity-45"
                  style={{ color: HERO.charcoal }}
                />
                <div
                  className="px-4 pb-3 text-[12px] sm:text-[13px] leading-snug"
                  style={{ color: `${HERO.charcoal}A6`, fontFamily: "'Cormorant Garamond', serif" }}
                >
                  <span className="italic">
                    Hurmatli {guestName.trim() || '…'}, sizni taklif etamiz!
                  </span>{' '}
                  ✨
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <motion.button
                type="button"
                onClick={handleCreate}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold cursor-pointer overflow-hidden"
                style={{
                  backgroundColor: HERO.gold,
                  color: HERO.charcoal,
                  boxShadow: '0 16px 36px rgba(212,175,55,0.35)',
                }}
              >
                <span>Taklifnoma Yaratish</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                type="button"
                onClick={onPreviewSample}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium cursor-pointer border backdrop-blur-md"
                style={{
                  borderColor: `${HERO.gold}80`,
                  color: HERO.charcoal,
                  backgroundColor: 'rgba(255,255,255,0.45)',
                  boxShadow: '0 10px 28px rgba(212,175,55,0.12)',
                }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${HERO.gold}22`, color: HERO.gold }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </span>
                <span>Namuna ko&apos;rish</span>
              </motion.button>
            </motion.div>

            <p className="text-[11px] tracking-wide" style={{ color: `${HERO.charcoal}80` }}>
              Telegram va WhatsApp uchun mos · 2 daqiqada demo
            </p>
          </div>

          {/* ── Right: 3D card stage ── */}
          <motion.div
            ref={stageRef}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="order-2 relative"
          >
            {/* Category tabs — hozircha faqat Nikoh To'yi */}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {CATEGORIES.map((cat) => {
                const isAvailable = cat.id === 'nikoh';
                const isActive = isAvailable;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    title={isAvailable ? cat.label : 'Hozirda tayyorlanmoqda'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium border cursor-pointer transition-all"
                    style={{
                      borderColor: isActive ? HERO.gold : `${HERO.gold}33`,
                      backgroundColor: isActive ? `${HERO.gold}18` : 'rgba(255,255,255,0.45)',
                      color: isActive ? HERO.gold : `${HERO.charcoal}88`,
                      boxShadow: isActive ? `0 6px 16px ${HERO.gold}33` : 'none',
                      opacity: isAvailable ? 1 : 0.72,
                    }}
                  >
                    <span className="hidden sm:inline-flex">{cat.icon}</span>
                    <span>{cat.shortLabel}</span>
                    {!isAvailable && (
                      <span
                        className="text-[9px] uppercase tracking-wider hidden md:inline"
                        style={{ color: `${HERO.charcoal}77` }}
                      >
                        tez orada
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-6 mb-3 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {comingSoonNote && (
                  <motion.p
                    key={comingSoonNote}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[11px] sm:text-xs font-medium"
                    style={{ color: HERO.gold }}
                  >
                    {comingSoonNote}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <InvitationCard
              category={active}
              guestName={guestName}
              audioOn={audioOn}
              onToggleAudio={() => setAudioOn((v) => !v)}
            />
          </motion.div>
        </div>

        {/* Pastga ishora — andoza / namuna bo‘limiga */}
        <motion.a
          href="#templates"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-10 sm:mt-12 flex flex-col items-center gap-2 cursor-pointer group"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.22em] font-medium transition-opacity group-hover:opacity-80"
            style={{ color: HERO.gold }}
          >
            Andozalarni ko‘ring
          </span>
          <span
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
            style={{
              borderColor: `${HERO.gold}66`,
              backgroundColor: 'rgba(255,255,255,0.55)',
              color: HERO.gold,
              boxShadow: '0 8px 20px rgba(212,175,55,0.15)',
            }}
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </span>
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
