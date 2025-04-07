'use client';

import { SendHorizontal } from 'lucide-react';
import { forwardRef } from 'react';

import Button, { type ButtonProps } from '@/Button';

export interface MobileChatSendButtonProps extends Omit<ButtonProps, 'onClick'> {
  onSend?: ButtonProps['onClick'];
  onStop?: ButtonProps['onClick'];
}

const MobileChatSendButton = forwardRef<HTMLButtonElement, MobileChatSendButtonProps>(
  ({ loading, onStop, onSend, ...rest }, ref) => {
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
  },
);

MobileChatSendButton.displayName = 'MobileChatSendButton';

export default MobileChatSendButton;
