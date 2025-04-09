import type { DivProps } from '@/types';

import iconMap from './icon-map.json';

export type FileNamesKey = keyof (typeof iconMap)['fileNames'];
export type FolderNamesKey = keyof (typeof iconMap)['folderNames'];
export type FileExtensionsKey = keyof (typeof iconMap)['fileExtensions'];

export interface MaterialFileTypeIconProps extends DivProps {
  fallbackUnknownType?: boolean;
  filename: string;
  open?: boolean;
  size?: number;
  type?: 'file' | 'folder';
  variant?: 'pure' | 'file' | 'folder';
}
