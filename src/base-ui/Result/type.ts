import type { ComponentProps, ReactNode, Ref } from 'react';

export type ResultStatus = 'success' | 'error' | 'info' | 'warning';

export interface ResultProps extends Omit<ComponentProps<'section'>, 'title'> {
  extra?: ReactNode;
  icon?: ReactNode;
  ref?: Ref<HTMLElement>;
  status?: ResultStatus;
  subTitle?: ReactNode;
  title?: ReactNode;
}
