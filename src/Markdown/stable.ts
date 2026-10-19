import { stableClasses } from '@/utils/bem';

export const markdownClasses = stableClasses({
  block: 'markdown',
  dataAttributes: ['variant'],
  elements: [],
});

export const typographyClasses = stableClasses({ block: 'typography', elements: [] });

export const searchResultCardsClasses = stableClasses({
  block: 'search-result-cards',
  elements: ['card', 'title', 'favicon', 'url'],
});
