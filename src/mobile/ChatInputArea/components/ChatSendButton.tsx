'use client';

import { SendHorizontal } from 'lucide-react';
import { memo } from 'react';

import Button from '@/Button';

import type { ChatSendButtonProps } from '../type';

const ChatSendButton = memo<ChatSendButtonProps>(({ ref, loading, onStop, onSend, ...rest }) => {
  return (
    <Button
      icon={SendHorizontal}
      loading={loading}
      onClick={(e) => {
        e.preventDefault();
        if (loading) {
          onStop?.(e);
        } else {
          onSend?.(e);
        }
      }}
      ref={ref}
      type={'primary'}
      {...rest}
    />
  );
});

ChatSendButton.displayName = 'ChatSendButton';

export default ChatSendButton;
