import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

export interface StatisticProps extends Omit<ComponentProps<'div'>, 'title' | 'prefix'> {
  classNames?: { title?: string; value?: string };
  formatter?: (value: number | string | undefined) => ReactNode;
  loading?: boolean;
  precision?: number;
  prefix?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  styles?: { title?: CSSProperties; value?: CSSProperties };
  suffix?: ReactNode;
  title?: ReactNode;
  value?: number | string;
}
