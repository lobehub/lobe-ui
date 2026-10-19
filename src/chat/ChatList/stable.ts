import { stableClasses } from '@/utils/bem';

export const chatChatListClasses = stableClasses({
  block: 'chat-chat-list',
  dataAttributes: ['variant'],
  elements: ['history-divider'],
});

export const chatChatActionsBarClasses = stableClasses({
  block: 'chat-chat-actions-bar',
  elements: [],
});
