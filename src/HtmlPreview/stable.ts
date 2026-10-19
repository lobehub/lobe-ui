import { stableClasses } from '@/utils/bem';

export const htmlPreviewClasses = stableClasses({
  block: 'html-preview',
  dataAttributes: ['variant', 'shadow', 'mode'],
  elements: ['toolbar', 'content', 'iframe', 'loading', 'loading-source', 'loading-badge'],
});

export const htmlPreviewIframeClasses = stableClasses({
  block: 'html-preview-iframe',
  dataAttributes: ['animated'],
  elements: [],
});
