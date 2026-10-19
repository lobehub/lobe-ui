import { stableClasses } from '@/utils/bem';

const diffElements = [
  'actions',
  'language',
  'header',
  'title',
  'deletions',
  'additions',
  'expand-toggle',
  'body',
] as const;

export const codeDiffClasses = stableClasses({
  block: 'code-diff',
  dataAttributes: ['variant', 'expanded'],
  elements: diffElements,
});

export const patchDiffClasses = stableClasses({
  block: 'patch-diff',
  dataAttributes: ['variant', 'expanded'],
  elements: diffElements,
});
