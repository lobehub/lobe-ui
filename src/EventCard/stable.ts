import { stableClasses } from '@/utils/bem';

export const eventCardClasses = stableClasses({
  block: 'event-card',
  dataAttributes: ['variant'],
  elements: [
    'cover',
    'body',
    'date',
    'month',
    'day',
    'weekday',
    'title',
    'meta',
    'time',
    'venue',
    'host',
    'description',
    'tags',
    'tag',
    'footer',
    'attendees',
    'action',
  ],
});
