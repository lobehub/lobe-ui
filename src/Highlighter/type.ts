import { ReactNode, type Ref } from 'react';
import { FlexboxProps } from 'react-layout-kit';
import type { BuiltinTheme } from 'shiki';

import type { ActionIconProps } from '@/ActionIcon';
import { DivProps } from '@/types';

export interface SyntaxHighlighterProps extends DivProps {
  children: string;
  enableTransformer?: HighlighterProps['enableTransformer'];
  language: HighlighterProps['language'];
  ref?: Ref<HTMLDivElement>;
  theme?: HighlighterProps['theme'];
  variant?: HighlighterProps['variant'];
}

export interface HighlighterProps extends Omit<FlexboxProps, 'children' | 'wrap'> {
  actionIconSize?: ActionIconProps['size'];
  actionsRender?: (props: {
    actionIconSize: ActionIconProps['size'];
    content: string;
    language: string;
    originalNode: ReactNode;
  }) => ReactNode;
  allowChangeLanguage?: boolean;
  bodyRender?: (props: { content: string; language: string; originalNode: ReactNode }) => ReactNode;
  children: string;
  copyable?: boolean;
  defaultExpand?: boolean;
  enableTransformer?: boolean;
  fileName?: string;
  fullFeatured?: boolean;
  icon?: ReactNode;
  language: string;
  shadow?: boolean;
  showLanguage?: boolean;
  theme?: 'lobe-theme' | BuiltinTheme;
  variant?: 'filled' | 'outlined' | 'borderless';
  wrap?: boolean;
}
