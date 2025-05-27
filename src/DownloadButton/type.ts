import { ActionIconProps } from '@/ActionIcon';

export interface DownloadButtonProps extends ActionIconProps {
  blobUrl?: string;
  fileName?: string;
  fileType?: string;
}
