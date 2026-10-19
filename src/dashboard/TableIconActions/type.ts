import type { LucideIcon } from 'lucide-react';
import type { MouseEventHandler, ReactNode } from 'react';

export interface TableIconActionsProps {
  children?: ReactNode;
  className?: string;
}

export interface TableIconActionProps {
  className?: string;
  danger?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  /** Accessible name and tooltip. Required: the button has no visible text. */
  label: string;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}
