import { stableClasses } from '@/utils/bem';

export const weatherCardClasses = stableClasses({
  block: 'weather-card',
  dataAttributes: ['condition', 'variant'],
  elements: [
    'glow',
    'hero',
    'location',
    'temp',
    'unit',
    'condition',
    'range',
    'icon',
    'details',
    'detail',
    'hourly',
    'hour',
    'daily',
    'day',
    'bar',
  ],
});
