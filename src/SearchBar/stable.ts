import { stableClasses } from '@/utils/bem';

export const searchBarClasses = stableClasses({
  block: 'search-bar',
  dataAttributes: ['loading'],
  elements: ['input', 'icon', 'short-key'],
});
