import React, { useState, useEffect } from 'react';
import { BRAND } from '../../config/themes';

interface UzbekCountdownProps {
  targetDate: string;
  primaryColor?: string;
  accentColor?: string;
  cardBgColor?: string;
  sectionLabel?: string;
  pendingPassedText?: string;
  unitLabels?: {
    daysLabel: string;
    hoursLabel: string;
    minutesLabel: string;
    secondsLabel: string;
  };
}

export const UzbekCountdown: React.FC<UzbekCountdownProps> = ({
  targetDate,
  accentColor = BRAND.accent,
  cardBgColor = BRAND.white,
  primaryColor = BRAND.text,
  sectionLabel = '— Tantanagacha —',
  pendingPassedText = "Tantana marosimi bo'lib o'tdi yoki bugun bo'lib o'tmoqda!",
  unitLabels = { daysLabel: 'Kun', hoursLabel: 'Soat', minutesLabel: 'Daqiqa', secondsLabel: 'Soniya' },
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPassed: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: unitLabels.daysLabel },
    { value: timeLeft.hours, label: unitLabels.hoursLabel },
    { value: timeLeft.minutes, label: unitLabels.minutesLabel },
    { value: timeLeft.seconds, label: unitLabels.secondsLabel, pulse: true },
  ];

  return (
    <div className="my-2 text-center">
      <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: accentColor }}>
        {sectionLabel}
      </p>

      {timeLeft.isPassed ? (
        <div
          className="py-3 px-6 rounded-xl border text-base font-serif italic"
          style={{
            backgroundColor: `${accentColor}12`,
            borderColor: BRAND.borderAccent,
            color: accentColor,
          }}
        >
          {pendingPassedText}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
          {units.map((u) => (
            <div
              key={u.label}
              className="p-3 sm:p-4 rounded-xl border"
              style={{
                backgroundColor: cardBgColor,
                borderColor: BRAND.borderAccent,
              }}
            >
              <span
                className={`block text-2xl sm:text-3xl font-serif ${u.pulse ? 'animate-pulse' : ''}`}
                style={{ color: BRAND.text }}
              >
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider mt-1 block" style={{ color: BRAND.muted }}>
                {u.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
