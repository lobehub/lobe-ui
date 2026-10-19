import { stableClasses } from '@/utils/bem';

export const chatLoadingDotsClasses = stableClasses({
  block: 'chat-loading-dots',
  dataAttributes: ['variant'],
  elements: ['dot', 'orbit'],
});
