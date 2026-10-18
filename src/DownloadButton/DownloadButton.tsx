'use client';

import clsx from 'clsx';
import { Download } from 'lucide-react';
import React, { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { downloadBlob } from '@/utils/downloadBlob';

import { downloadButtonClasses } from './stable';
import type { DownloadButtonProps } from './type';

const DownloadButton = memo<DownloadButtonProps>(
  ({ blobUrl, className, disabled = false, fileName = 'download', fileType = 'svg', ...rest }) => {
    const handleDownload = async () => {
      if (!blobUrl || disabled) return;
      try {
        await downloadBlob(blobUrl, `${fileName.replace(/\.[^./]+$/, '')}.${fileType}`);
      } catch (error) {
        console.error('Download failed:', error);
      }
    };
    return (
      <ActionIcon
        title={`Download ${fileType.toUpperCase()}`}
        {...rest}
        className={clsx(downloadButtonClasses(), className)}
        icon={Download}
        onClick={handleDownload}
      />
    );
  },
);

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
