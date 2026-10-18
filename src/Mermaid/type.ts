import type { CSSProperties, ReactNode, Ref } from 'react';

import type { ActionIconProps } from '@/ActionIcon';
import type { DivProps } from '@/types';

import type { MermaidThemeName } from './themes';

export interface SyntaxMermaidProps {
  animated?: boolean;
  children: string;
  className?: string;
  fallbackClassName?: string;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  theme?: MermaidProps['theme'];
  variant?: MermaidProps['variant'];
}

export interface MermaidProps extends DivProps {
  actionIconSize?: ActionIconProps['size'];
  actionsRender?: (props: {
    actionIconSize: ActionIconProps['size'];
    content: string;
    getContent: () => string;
    originalNode: ReactNode;
  }) => ReactNode;
  animated?: boolean;
  bodyRender?: (props: { content: string; originalNode: ReactNode }) => ReactNode;
  children: string;
  classNames?: {
    body?: string;
    content?: string;
    header?: string;
  };
  copyable?: boolean;
  defaultExpand?: boolean;
  fileName?: string;
  fullFeatured?: boolean;
  language?: string;
  shadow?: boolean;
  showLanguage?: boolean;
  styles?: {
    body?: CSSProperties;
    content?: CSSProperties;
    header?: CSSProperties;
  };
  theme?: MermaidThemeName;
  variant?: 'filled' | 'outlined' | 'borderless';
}
