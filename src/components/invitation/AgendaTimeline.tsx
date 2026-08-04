import React from 'react';
import { Users, Heart, Music, Sparkles, Utensils, Gift, Clock } from 'lucide-react';
import { AgendaItem } from '../../types';
import { BRAND } from '../../config/themes';

interface AgendaTimelineProps {
  agenda?: AgendaItem[];
  accentColor?: string;
  primaryColor?: string;
  textColor?: string;
}

const DEFAULT_WEDDING_AGENDA: AgendaItem[] = [
  { time: '17:00', title: 'Mehmonlarni Kutib Olish', description: "Favvora va sharbatlar barida do'stlar diydori", iconName: 'Users' },
  { time: '18:00', title: 'Nikoh Uzuklarini Taqish', description: 'Kuyov va Kelin tantanali kirib kelishi', iconName: 'Heart' },
  { time: '19:00', title: "Sho'x Raqslar & Dasturxon", description: "San'atkorlar ijrosi va bayramona kayfiyat", iconName: 'Music' },
  { time: '20:30', title: "To'y Tortini Kesish", description: 'Musiqiy feyerverk va ezgu duolar', iconName: 'Sparkles' },
];

export const AgendaTimeline: React.FC<AgendaTimelineProps> = ({
  agenda,
  accentColor = BRAND.accent,
  textColor = BRAND.text,
}) => {
  const displayAgenda = agenda && agenda.length > 0 ? agenda : DEFAULT_WEDDING_AGENDA;

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Users':
        return <Users className="w-4 h-4" style={{ color: accentColor }} />;
      case 'Heart':
        return <Heart className="w-4 h-4" style={{ color: accentColor }} fill={accentColor} />;
      case 'Music':
        return <Music className="w-4 h-4" style={{ color: accentColor }} />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" style={{ color: accentColor }} />;
      case 'Utensils':
        return <Utensils className="w-4 h-4" style={{ color: accentColor }} />;
      case 'Gift':
        return <Gift className="w-4 h-4" style={{ color: accentColor }} />;
      default:
        return <Clock className="w-4 h-4" style={{ color: accentColor }} />;
    }
  };

  return (
    <div className="my-2 max-w-lg mx-auto">
      <p className="text-center text-xs uppercase tracking-widest font-medium mb-6" style={{ color: accentColor }}>
        — Dastur —
      </p>

      <div className="relative border-l ml-6 pl-6 space-y-6" style={{ borderColor: `${accentColor}35` }}>
        {displayAgenda.map((item, index) => (
          <div key={index} className="relative group">
            <div
              className="absolute -left-8.75 top-0.5 w-8 h-8 rounded-full bg-white border flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ borderColor: accentColor }}
            >
              {getIcon(item.iconName)}
            </div>
            <div
              className="p-4 rounded-xl border space-y-1 text-left bg-white"
              style={{ borderColor: BRAND.borderAccent }}
            >
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium font-mono"
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
              >
                {item.time}
              </span>
              <h4 className="text-base font-serif" style={{ color: textColor }}>
                {item.title}
              </h4>
              {item.description && (
                <p className="text-xs leading-relaxed" style={{ color: BRAND.muted }}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
