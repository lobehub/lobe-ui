'use client';

import { Check, Copy } from 'lucide-react';
import { memo } from 'react';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import { useCopied } from '@/hooks/useCopied';
import { copyToClipboard } from '@/utils/copyToClipboard';

export interface CopyButtonProps extends ActionIconProps {
  /**
   * @description The text content to be copied
   */
  content: string;
}

const CopyButton = memo<CopyButtonProps>(
  ({
    active,
    content,
    placement = 'right',
    size = 'site',
    icon,
    glass = true,
    onClick,
    ...rest
  }) => {
    const { copied, setCopied } = useCopied();
    const Icon = icon || Copy;

    return (
      <ActionIcon
        glass={glass}
        placement={placement}
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

export default CopyButton;
