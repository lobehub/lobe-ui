import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';

export type StatisticCardSlot =
  'root' | 'header' | 'title' | 'extra' | 'content' | 'value' | 'description';

export interface StatisticCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'prefix' | 'title'
> {
  classNames?: Partial<Record<StatisticCardSlot, string>>;
  description?: ReactNode;
  extra?: ReactNode;
  loading?: boolean;
  precision?: number;
  prefix?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  styles?: Partial<Record<StatisticCardSlot, CSSProperties>>;
  suffix?: ReactNode;
  title?: ReactNode;
  value?: ReactNode;
  variant?: 'filled' | 'outlined' | 'borderless';
}

export interface StatisticProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  ref?: Ref<HTMLDivElement>;
  title: ReactNode;
  value: ReactNode;
}

export interface TitleWithPercentageProps {
  count?: number;
  inverseColor?: boolean;
  prvCount?: number;
  title: string;
}
