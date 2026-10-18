import { stableClasses } from '@/utils/bem';

export const mobileChatInputAreaClasses = stableClasses({
  block: 'mobile-chat-input-area',
  dataAttributes: ['expand', 'focused'],
  elements: ['top-addons', 'body', 'expand-toggle', 'inner', 'addons', 'textarea', 'bottom-addons'],
});

export const mobileChatSendButtonClasses = stableClasses({
  block: 'mobile-chat-send-button',
  elements: [],
});
