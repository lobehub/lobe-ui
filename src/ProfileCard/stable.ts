import { stableClasses } from '@/utils/bem';

export const profileCardClasses = stableClasses({
  block: 'profile-card',
  dataAttributes: ['variant'],
  elements: [
    'banner',
    'body',
    'avatar',
    'location',
    'name',
    'role',
    'company',
    'bio',
    'tags',
    'tag',
    'stats',
    'stat',
    'contacts',
    'contact',
  ],
});
