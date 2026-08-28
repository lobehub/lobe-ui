import type { ActionIconProps } from '@/base-ui/ActionIcon';

export interface DownloadButtonProps extends ActionIconProps {
  blobUrl?: string;
  fileName?: string;
  fileType?: string;
}
