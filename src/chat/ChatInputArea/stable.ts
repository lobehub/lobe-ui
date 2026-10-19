import { stableClasses } from '@/utils/bem';

export const chatChatInputAreaClasses = stableClasses({
  block: 'chat-chat-input-area',
  dataAttributes: ['expand'],
  elements: ['content', 'textarea-wrapper', 'textarea'],
});

export const chatChatInputActionBarClasses = stableClasses({
  block: 'chat-chat-input-action-bar',
  elements: ['left', 'right'],
});

export const chatChatSendButtonClasses = stableClasses({
  block: 'chat-chat-send-button',
  elements: ['left', 'right', 'hint', 'stop', 'send'],
});
