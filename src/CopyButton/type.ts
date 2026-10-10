import type { ActionIconProps } from '@/ActionIcon';

export interface CopyButtonProps extends Omit<ActionIconProps, 'content'> {
  content: string | (() => string);
}
