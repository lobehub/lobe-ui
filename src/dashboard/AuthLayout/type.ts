import type { HTMLAttributes, ReactNode } from 'react';

export interface AuthLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional panel beside the form. Hidden below the laptop breakpoint. */
  aside?: ReactNode;
  /** Home mark rendered in the corner. Pass your own logo. */
  brand?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
  /** Corner actions, such as a theme switch. */
  tools?: ReactNode;
}
