import { stableClasses } from '@/utils/bem';

export const highlighterClasses = stableClasses({
  block: 'highlighter',
  dataAttributes: ['variant', 'shadow', 'wrap', 'expanded'],
  elements: [
    'actions',
    'language',
    'header',
    'title',
    'panel-actions',
    'expand-toggle',
    'body',
    'content',
  ],
});

export const syntaxHighlighterClasses = stableClasses({
  block: 'syntax-highlighter',
  dataAttributes: ['variant', 'animated'],
  elements: [],
});
