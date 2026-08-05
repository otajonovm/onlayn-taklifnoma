import React, { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play } from 'lucide-react';
import { BRAND } from '@/config/themes';
import { AUDIO_TRACKS, type AudioTrack } from '@/data/audioTracks';

export interface AudioTrackPickerProps {
  audioUrl: string;
  audioTitle: string;
  onChange: (track: AudioTrack) => void;
}

export const AudioTrackPicker: React.FC<AudioTrackPickerProps> = ({
  audioUrl,
  audioTitle,
  onChange,
}) => {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const stopPreview = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPreviewId(null);
  };

  const togglePreview = (track: AudioTrack) => {
    if (previewId === track.id) {
      stopPreview();
      return;
    }
    stopPreview();
    const audio = new Audio(track.url);
    audio.volume = 0.7;
    audioRef.current = audio;
    setPreviewId(track.id);
    audio.play().catch(() => setPreviewId(null));
    audio.onended = () => setPreviewId(null);
  };

  return (
    <div
      className="rounded-xl border bg-white space-y-3 p-5"
      style={{ borderColor: BRAND.borderAccent }}
    >
      <div className="flex items-center gap-2">
        <Music className="w-4 h-4" style={{ color: BRAND.accent }} />
        <h3 className="text-base font-serif" style={{ color: BRAND.text }}>
          Fon musiqasi
        </h3>
      </div>
      <p className="text-xs" style={{ color: BRAND.muted }}>
        Shablondan tanlang. Hozirgi: <span className="font-medium">{audioTitle}</span>
      </p>

      <div className="space-y-2">
        {AUDIO_TRACKS.map((track) => {
          const active = audioUrl === track.url;
          const playing = previewId === track.id;
          return (
            <div
              key={track.id}
              className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
              style={{
                borderColor: active ? BRAND.accent : BRAND.border,
                backgroundColor: active ? `${BRAND.accent}12` : BRAND.white,
              }}
            >
              <button
                type="button"
                onClick={() => togglePreview(track)}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer border"
                style={{
                  borderColor: BRAND.border,
                  backgroundColor: playing ? BRAND.accent : BRAND.white,
                  color: playing ? BRAND.white : BRAND.text,
                }}
                title={playing ? 'To‘xtatish' : 'Tinglash'}
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopPreview();
                  onChange(track);
                }}
                className="flex-1 min-w-0 text-left cursor-pointer"
              >
                <span className="block text-sm font-medium truncate" style={{ color: BRAND.text }}>
                  {track.title}
                </span>
                <span className="block text-[11px] truncate" style={{ color: BRAND.muted }}>
                  {track.artist}
                </span>
              </button>

              {active && (
                <span
                  className="text-[10px] uppercase tracking-wide font-medium shrink-0"
                  style={{ color: BRAND.accent }}
                >
                  Tanlangan
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioTrackPicker;
