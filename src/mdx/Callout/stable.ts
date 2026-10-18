import { stableClasses } from '@/utils/bem';

export const mdxCalloutClasses = stableClasses({
  block: 'mdx-callout',
  dataAttributes: ['type'],
  elements: ['icon', 'content', 'inner'],
});
