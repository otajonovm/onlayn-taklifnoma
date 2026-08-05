import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  audioTitle?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioTitle = 'Fon Musiqasi',
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onError = () => {
      console.warn('Audio yuklanmadi:', audioUrl);
      setIsPlaying(false);
    };
    audio.addEventListener('error', onError);

    if (autoPlay) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio autoplay prevented by browser policy:", err);
      });
    }

    return () => {
      audio.removeEventListener('error', onError);
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl, autoPlay]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => console.log(err));
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={toggleAudio}
        className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-white border border-[rgba(212,163,115,0.3)] text-[#1E293B] shadow-md backdrop-blur-md hover:bg-[#FDFBF7] transition-all cursor-pointer group"
        title={isPlaying ? "Musiqani to'xtatish" : "Musiqani qo'shish"}
      >
        <div className="relative w-8 h-8 rounded-full bg-[#D4A373] text-white flex items-center justify-center">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </div>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-4 px-1">
            <span className="w-1 bg-[#D4A373] rounded-full animate-[bounce_1s_infinite_100ms] h-2/3" />
            <span className="w-1 bg-[#D4A373] rounded-full animate-[bounce_1s_infinite_300ms] h-full" />
            <span className="w-1 bg-[#D4A373] rounded-full animate-[bounce_1s_infinite_200ms] h-1/2" />
            <span className="w-1 bg-[#D4A373] rounded-full animate-[bounce_1s_infinite_400ms] h-4/5" />
          </div>
        )}

        <span className="text-xs font-medium text-[#64748B] hidden sm:inline max-w-[120px] truncate">
          {isPlaying ? audioTitle : 'Musiqa'}
        </span>
      </button>
    </div>
  );
};
