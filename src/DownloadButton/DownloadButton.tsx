'use client';

import { Download } from 'lucide-react';
import React, { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { downloadBlob } from '@/utils/downloadBlob';

import type { DownloadButtonProps } from './type';

const DownloadButton = memo<DownloadButtonProps>(
  ({ fileName = 'download', fileType = 'svg', disabled = false, blobUrl, ...rest }) => {
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
        icon={Download}
        onClick={handleDownload}
      />
    );
  },
);

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
