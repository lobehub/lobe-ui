import { stableClasses } from '@/utils/bem';

export const chatTokenTagClasses = stableClasses({
  block: 'chat-token-tag',
  dataAttributes: ['mode', 'status'],
  elements: ['progress'],
});
