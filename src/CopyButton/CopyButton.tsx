'use client';

import { Check, Copy } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { useCopied } from '@/hooks/useCopied';
import { copyToClipboard } from '@/utils/copyToClipboard';

import type { CopyButtonProps } from './type';

const CopyButton = memo<CopyButtonProps>(
  ({ active, content, size, icon, glass = true, onClick, ...rest }) => {
    const { copied, setCopied } = useCopied();
    const Icon = icon || Copy;

    return (
      <ActionIcon
        glass={glass}
        size={size}
        title={'Copy'}
        {...rest}
        active={active || copied}
        icon={copied ? Check : Icon}
        onClick={async (e) => {
          const resolvedContent = typeof content === 'function' ? content() : content;
          await copyToClipboard(resolvedContent);
          setCopied();
          onClick?.(e);
        }}
      />
    );
  },
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
