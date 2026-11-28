import { stableClasses } from '@/utils/bem';

export const citationClasses = stableClasses({
  block: 'citation',
  dataAttributes: ['variant', 'open'],
  elements: ['marker', 'card', 'source', 'title', 'snippet', 'link'],
});
