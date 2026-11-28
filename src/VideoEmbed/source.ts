import type { VideoEmbedSource } from './type';

const YOUTUBE = /(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/;
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/;
const VIDEO_FILE = /\.(?:mp4|m4v|webm|ogv|ogg|mov)(?:[?#]|$)/i;

/** Where a URL plays: YouTube and Vimeo through their privacy-friendly embeds, or a video file. */
export const videoEmbedSourceOf = (url: string): VideoEmbedSource => {
  const value = (url ?? '').trim();
  if (!/^https?:\/\//i.test(value)) return { kind: 'unsupported' };
  const yt = /(?:youtube\.com|youtube-nocookie\.com|youtu\.be)\//i.test(value)
    ? YOUTUBE.exec(value)?.[1]
    : undefined;
  if (yt) return { id: yt, kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt}` };
  const vm = VIMEO.exec(value)?.[1];
  if (vm) return { id: vm, kind: 'vimeo', src: `https://player.vimeo.com/video/${vm}?dnt=1` };
  if (VIDEO_FILE.test(value)) return { kind: 'file', src: value };
  return { kind: 'unsupported' };
};
