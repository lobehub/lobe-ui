import { stableClasses } from '@/utils/bem';

export const mermaidClasses = stableClasses({
  block: 'mermaid',
  dataAttributes: ['variant', 'shadow', 'expanded'],
  elements: [
    'wrapper',
    'actions',
    'language',
    'header',
    'title',
    'panel-actions',
    'expand-toggle',
    'body',
  ],
});

export const syntaxMermaidClasses = stableClasses({
  block: 'syntax-mermaid',
  dataAttributes: ['variant', 'animated'],
  elements: ['diagram', 'fallback'],
});
