import React, { ReactNode } from 'react';

import { ActionIconSize } from '@/ActionIcon';

export interface DownloadButtonProps {
  active?: boolean;
  blobUrl?: string; // Blob URL，用于下载
  disabled?: boolean;
  fileName?: string; // 文件名（不包含扩展名）
  fileType?: string; // 文件类型/扩展名，如 'svg', 'png', 'pdf' 等
  glass?: boolean;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  size?: ActionIconSize;
}
