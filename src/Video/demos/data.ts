import type { VideoMarker, VideoSection } from '@lobehub/ui';

export const SAMPLE_SRC =
  'https://github.com/lobehub/lobe-chat/assets/28616219/f29475a3-f346-4196-a435-41a6373ab9e2';

export const sections: VideoSection[] = [
  { start: 0, title: 'Intro' },
  { start: 4, title: 'Open the app' },
  { start: 9, title: 'Create an agent' },
  { start: 16, title: 'Run a task' },
  { start: 24, title: 'Result' },
];

export const markers: VideoMarker[] = [
  { color: 'success', content: 'The new agent appears in the sidebar', label: 'Check', time: 11 },
  { color: 'warning', content: 'A toast briefly covers the send button', label: 'Flag', time: 19 },
  { color: 'success', content: 'The reply streams in without errors', label: 'Check', time: 25 },
];

const STEP_LABELS = ['Click', 'Type', 'Scroll', 'Wait', 'Hover'];

export const denseSections: VideoSection[] = Array.from({ length: 40 }, (_, index) => ({
  start: Number(((index * 29) / 40 + (index % 3) * 0.12).toFixed(2)),
  title: `${STEP_LABELS[index % STEP_LABELS.length]} #${index + 1}`,
}));
