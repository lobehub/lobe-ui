import { stableClasses } from '@/utils/bem';

export const agendaClasses = stableClasses({
  block: 'agenda',
  dataAttributes: ['tone', 'variant'],
  elements: [
    'header',
    'title',
    'days',
    'day',
    'date',
    'weekday',
    'day-number',
    'month',
    'events',
    'empty',
    'event',
    'bar',
    'time',
    'body',
    'event-title',
    'speaker',
    'description',
    'location',
  ],
});
