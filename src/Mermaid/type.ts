import { ReactNode } from 'react';

import type { ActionIconProps } from '@/ActionIcon';
import type { CopyButtonProps } from '@/CopyButton';
import { DivProps } from '@/types';

export interface MermaidProps extends DivProps {
  actionsRender?: (props: {
    actionIconSize: ActionIconProps['size'];
    content: string;
    originalNode: ReactNode;
  }) => ReactNode;
  bodyRender?: (props: { content: string; originalNode: ReactNode }) => ReactNode;
  children: string;
  copyButtonSize?: CopyButtonProps['size'];
  copyable?: boolean;
  fullFeatured?: boolean;
  showLanguage?: boolean;
  type?: 'ghost' | 'block' | 'pure';
}
