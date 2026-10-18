import { stableClasses } from '@/utils/bem';

export const chatChatItemClasses = stableClasses({
  block: 'chat-chat-item',
  dataAttributes: ['placement', 'variant', 'editing', 'loading'],
  elements: [
    'avatar',
    'avatar-group',
    'loading',
    'body',
    'title',
    'time',
    'content',
    'message',
    'extra',
    'error',
    'actions',
    'spacing',
  ],
});
