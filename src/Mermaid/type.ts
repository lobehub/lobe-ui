import type { MermaidConfig } from 'mermaid/dist/config.type';
import { ReactNode } from 'react';

import type { ActionIconProps } from '@/ActionIcon';
import { DivProps } from '@/types';

export interface MermaidProps extends DivProps {
  actionIconSize?: ActionIconProps['size'];
  actionsRender?: (props: {
    actionIconSize: ActionIconProps['size'];
    content: string;
    originalNode: ReactNode;
  }) => ReactNode;
  bodyRender?: (props: { content: string; originalNode: ReactNode }) => ReactNode;
  children: string;
  copyable?: boolean;
  defaultExpand?: boolean;
  enablePanZoom?: boolean;
  fileName?: string;
  fullFeatured?: boolean;
  language?: string;
  shadow?: boolean;
  showLanguage?: boolean;
  theme?: 'lobe-theme' | MermaidConfig['theme'];
  variant?: 'filled' | 'outlined' | 'borderless';
}
