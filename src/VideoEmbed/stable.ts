import { stableClasses } from '@/utils/bem';

export const videoEmbedClasses = stableClasses({
  block: 'video-embed',
  dataAttributes: ['source', 'variant'],
  elements: ['frame', 'player', 'unsupported', 'caption'],
});
