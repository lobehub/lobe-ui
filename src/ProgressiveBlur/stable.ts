import { stableClasses } from '@/utils/bem';

export const progressiveBlurClasses = stableClasses({
  block: 'progressive-blur',
  dataAttributes: ['position', 'mode'],
  elements: ['content', 'edge', 'layer', 'gradient'],
});
