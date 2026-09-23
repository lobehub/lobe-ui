import type { ReactNode } from 'react';

export interface PageTab<Value extends string> {
  content: ReactNode;
  count?: ReactNode;
  label: string;
  value: Value;
}

export interface PageTabsProps<Value extends string> {
  label: string;
  onChange: (value: Value) => void;
  tabs: PageTab<Value>[];
  value: Value;
}
