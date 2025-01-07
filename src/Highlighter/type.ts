import { ReactNode } from 'react';

import type { ActionIconProps } from '@/ActionIcon';
import type { CopyButtonProps } from '@/CopyButton';
import type { DivProps } from '@/types';

export interface HighlighterProps extends DivProps {
  actionsRender?: (props: {
    actionIconSize: ActionIconProps['size'];
    content: string;
    language: string;
    originalNode: ReactNode;
  }) => ReactNode;
  allowChangeLanguage?: boolean;
  bodyRender?: (props: { content: string; language: string; originalNode: ReactNode }) => ReactNode;
  /**
   * @description The code content to be highlighted
   */
  children: string;
  copyButtonSize?: CopyButtonProps['size'];
  /**
   * @description Whether to show the copy button
   * @default true
   */
  copyable?: boolean;
  /**
   * @description Whether to expand code blocks by default
   * @default true
   */
  defalutExpand?: boolean;
  enableTransformer?: boolean;
  fileName?: string;
  fullFeatured?: boolean;
  icon?: ReactNode;
  /**
   * @description The language of the code content
   */
  language: string;
  /**
   * @description Whether to show language tag
   * @default true
   */
  showLanguage?: boolean;
  /**
   * @description Whether add spotlight background
   * @default false
   */
  spotlight?: boolean;
  /**
   * @description The type of the code block
   * @default 'block'
   */
  type?: 'ghost' | 'block' | 'pure';
  wrap?: boolean;
}
