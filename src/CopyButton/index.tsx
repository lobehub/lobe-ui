'use client';

import { Check, Copy } from 'lucide-react';
import { forwardRef } from 'react';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import { useCopied } from '@/hooks/useCopied';
import { copyToClipboard } from '@/utils/copyToClipboard';

export interface CopyButtonProps extends ActionIconProps {
  content: string;
}

const CopyButton = forwardRef<HTMLDivElement, CopyButtonProps>(
  ({ active, content, size, icon, glass = true, onClick, ...rest }, ref) => {
    const { copied, setCopied } = useCopied();
    const Icon = icon || Copy;

    return (
      <ActionIcon
        glass={glass}
        ref={ref}
        size={size}
        title={'Copy'}
        {...rest}
        active={active || copied}
        icon={copied ? Check : Icon}
        onClick={async (e) => {
          await copyToClipboard(content);
          setCopied();
          onClick?.(e);
        }}
      />
    );
  },
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
