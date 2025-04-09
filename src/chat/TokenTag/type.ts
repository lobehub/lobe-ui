import type { Ref } from 'react';

import type { ButtonProps } from '@/Button';

export interface TokenTagProps extends ButtonProps {
  hideText?: boolean;
  maxValue: number;
  mode?: 'remained' | 'used';
  ref?: Ref<HTMLButtonElement>;
  text?: {
    overload?: string;
    remained?: string;
    used?: string;
  };
  unoptimized?: boolean;
  value: number;
}
