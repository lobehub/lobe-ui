import { stableClasses } from '@/utils/bem';

export const chatMessageModalClasses = stableClasses({
  block: 'chat-message-modal',
  elements: ['editor', 'actions', 'confirm', 'cancel'],
});
