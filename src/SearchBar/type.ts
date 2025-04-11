import { CSSProperties, Ref } from 'react';
import { FlexboxProps } from 'react-layout-kit';

import type { InputProps } from '@/Input';
import { AProps } from '@/types';

export interface SearchBarProps extends Omit<InputProps, 'styles' | 'classNames'> {
  classNames?: {
    input?: string;
    shortKey?: string;
  };
  defaultValue?: string;
  enableShortKey?: boolean;
  loading?: boolean;
  onInputChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  shortKey?: string;
  spotlight?: boolean;
  styles?: {
    input?: CSSProperties;
    shortKey?: CSSProperties;
  };
  value?: string;
}

export interface SearchResultItem {
  alt?: string;
  summary?: string;
  title?: string;
  url: string;
}

export interface SearchResultCardsProps extends FlexboxProps {
  dataSource: string[] | SearchResultItem[];
  ref?: Ref<HTMLDivElement>;
}

export interface SearchResultCardProps extends AProps {
  alt?: string;
  ref?: Ref<HTMLAnchorElement>;
  title?: string;
  url: string;
}
