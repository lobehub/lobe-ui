import { stableClasses } from '@/utils/bem';

export const chatMessageInputClasses = stableClasses({
  block: 'chat-message-input',
  elements: ['editor', 'actions', 'confirm', 'cancel'],
});
