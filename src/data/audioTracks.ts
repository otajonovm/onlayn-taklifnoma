/** Curated background music templates for invitations */
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'oh-sevaman-yor',
    title: 'Oh Sevaman Yor',
    artist: 'Ibrohim Nurmatov',
    url: '/audio/oh-sevaman-yor.mp3',
  },
  {
    id: 'oshiqman',
    title: 'Oshiqman',
    artist: 'Izzat Shukurov',
    url: '/audio/oshiqman.mp3',
  },
  {
    id: 'sev-mani',
    title: 'Sev Mani',
    artist: 'Hojiakbar Rozmetov',
    url: '/audio/sev-mani.mp3',
  },
  {
    id: 'qaylardasan-ayt',
    title: 'Qaylardasan ayt',
    artist: 'Sardor Rahimxon',
    url: '/audio/qaylardasan-ayt.mp3',
  },
];

export const DEFAULT_AUDIO_TRACK = AUDIO_TRACKS[0];

export function findAudioTrack(url?: string): AudioTrack | undefined {
  if (!url) return undefined;
  return AUDIO_TRACKS.find((t) => t.url === url);
}

export function audioTitleFromUrl(url?: string, fallback = 'Fon Musiqasi'): string {
  return findAudioTrack(url)?.title ?? fallback;
}
