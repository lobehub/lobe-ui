import { stableClasses } from '@/utils/bem';

export const snippetClasses = stableClasses({
  block: 'snippet',
  dataAttributes: ['variant', 'shadow'],
  elements: ['spotlight', 'highlight', 'copy'],
});
