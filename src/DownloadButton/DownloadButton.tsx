'use client';

import { Check, Download } from 'lucide-react';
import React, { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { useCopied } from '@/hooks/useCopied';
import { downloadBlob } from '@/utils/downloadBlob';

import type { DownloadButtonProps } from './type';

const DownloadButton = memo<DownloadButtonProps>(
  ({
    active,
    blobUrl,
    size,
    icon,
    glass = true,
    onClick,
    fileName = 'download',
    fileType = 'svg',
    disabled = false,
    ...rest
  }) => {
    const { copied, setCopied } = useCopied();
    const Icon = icon || Download;

    const handleDownload = async (e: React.MouseEvent) => {
      if (!blobUrl || disabled) return;

      try {
        await downloadBlob(blobUrl, `${fileName}.${fileType}`);
        setCopied();
        onClick?.(e);
      } catch (error) {
        console.error('Download failed:', error);
      }
    };

    return (
      <ActionIcon
        disabled={disabled || !blobUrl}
        glass={glass}
        size={size}
        title={`Download ${fileType.toUpperCase()}`}
        {...rest}
        active={active || copied}
        icon={copied ? Check : Icon}
        onClick={handleDownload}
      />
    );
  },
);

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
