import type { ActionIconProps } from '@/ActionIcon';

export interface TokenTagProps extends ActionIconProps {
  maxValue: number;
  mode?: 'remained' | 'used';
  showInfo?: boolean;
  text?: {
    overload?: string;
    remained?: string;
    used?: string;
  };
  value: number;
}
