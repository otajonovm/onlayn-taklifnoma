import React from 'react';
import { MapPin, Navigation, ExternalLink, Compass, Globe } from 'lucide-react';
import { BRAND } from '@/config/themes';

interface LocationNavigatorProps {
  venueName: string;
  locationAddress: string;
  yandexUrl?: string;
  googleUrl?: string;
  twoGisUrl?: string;
  accentColor?: string;
  textColor?: string;
  cardBgColor?: string;
}

export const LocationNavigator: React.FC<LocationNavigatorProps> = ({
  venueName,
  locationAddress,
  yandexUrl,
  googleUrl,
  twoGisUrl,
  accentColor = BRAND.accent,
  textColor = BRAND.text,
}) => {
  const queryText = encodeURIComponent(`${venueName} ${locationAddress}`);

  const handleYandexClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const customYandexWeb = yandexUrl || `https://yandex.uz/maps/?text=${queryText}`;
    const deepLinkNavi = `yandexnavi://build_route_on_map?text=${queryText}`;

    if (isMobile) {
      const start = Date.now();
      window.location.href = deepLinkNavi;
      setTimeout(() => {
        if (Date.now() - start < 1500) {
          window.open(customYandexWeb, '_blank', 'noopener,noreferrer');
        }
      }, 800);
    } else {
      window.open(customYandexWeb, '_blank', 'noopener,noreferrer');
    }
  };

  const finalGoogleUrl =
    googleUrl || `https://www.google.com/maps/search/?api=1&query=${queryText}`;
  const finalTwoGisUrl = twoGisUrl || `https://2gis.uz/tashkent/search/${queryText}`;

  const maps = [
    {
      key: 'yandex',
      label: 'Yandex Maps',
      hint: 'Navigator',
      icon: Compass,
      onClick: handleYandexClick,
      href: undefined as string | undefined,
    },
    {
      key: 'google',
      label: 'Google Maps',
      hint: 'Marshrut',
      icon: Navigation,
      onClick: undefined,
      href: finalGoogleUrl,
    },
    {
      key: '2gis',
      label: '2GIS',
      hint: 'Xarita',
      icon: MapPin,
      onClick: undefined,
      href: finalTwoGisUrl,
    },
  ];

  const btnClass =
    'group flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl text-center transition-all duration-300 cursor-pointer active:scale-[0.98] hover:-translate-y-0.5';

  const btnStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    border: `1px solid ${BRAND.borderAccent}`,
    boxShadow: '0 8px 24px rgba(30, 41, 59, 0.04)',
    color: textColor,
  };

  return (
    <div className="my-0 p-1 rounded-none border-0 text-center max-w-lg mx-auto space-y-5 bg-transparent w-full">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto border"
        style={{
          backgroundColor: `${accentColor}14`,
          borderColor: BRAND.borderAccent,
          color: accentColor,
        }}
      >
        <MapPin className="w-5 h-5" />
      </div>

      <div className="space-y-1">
        <p
          className="text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-1.5"
          style={{ color: accentColor }}
        >
          <Globe className="w-3.5 h-3.5" />
          Manzil va xarita
        </p>
        <h3 className="text-xl sm:text-2xl font-serif px-1" style={{ color: textColor }}>
          {venueName}
        </h3>
        <p className="text-sm leading-relaxed px-2" style={{ color: BRAND.muted }}>
          {locationAddress}
        </p>
      </div>

      <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {maps.map((m) => {
          const Icon = m.icon;
          const inner = (
            <>
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors group-hover:scale-105"
                style={{
                  backgroundColor: `${accentColor}18`,
                  color: accentColor,
                }}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-xs font-serif font-medium tracking-wide" style={{ color: textColor }}>
                {m.label}
              </span>
              <span
                className="text-[10px] uppercase tracking-wider flex items-center gap-1"
                style={{ color: BRAND.muted }}
              >
                {m.hint}
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </span>
            </>
          );

          if (m.href) {
            return (
              <a
                key={m.key}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className={btnClass}
                style={btnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BRAND.borderAccent;
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.82)';
                }}
              >
                {inner}
              </a>
            );
          }

          return (
            <button
              key={m.key}
              type="button"
              onClick={m.onClick}
              className={btnClass}
              style={btnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = accentColor;
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BRAND.borderAccent;
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.82)';
              }}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
};
