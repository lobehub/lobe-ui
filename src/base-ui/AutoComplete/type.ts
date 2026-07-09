import type { Autocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import type { InputProps } from '@/base-ui/Input';

export interface AutoCompleteOption {
  disabled?: boolean;
  label?: ReactNode;
  value: string;
}

type BaseAutocompleteProps = Omit<
  ComponentProps<typeof Autocomplete.Root>,
  'className' | 'style' | 'render' | 'children' | 'items' | 'onValueChange' | 'mode'
>;

export interface AutoCompleteProps extends BaseAutocompleteProps {
  allowClear?: boolean;
  className?: string;
  classNames?: {
    input?: string;
    item?: string;
    popup?: string;
  };
  disabled?: boolean;
  emptyText?: ReactNode;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  options?: (string | AutoCompleteOption)[];
  placeholder?: string;
  prefix?: InputProps['prefix'];
  shadow?: boolean;
  size?: InputProps['size'];
  style?: CSSProperties;
  styles?: {
    input?: CSSProperties;
    item?: CSSProperties;
    popup?: CSSProperties;
  };
  suffix?: InputProps['suffix'];
  variant?: InputProps['variant'];
}
