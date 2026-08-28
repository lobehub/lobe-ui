import type { ActionIconProps } from '@/base-ui/ActionIcon';

export interface CopyButtonProps extends Omit<ActionIconProps, 'content'> {
  content: string | (() => string);
}
