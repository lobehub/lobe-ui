export interface LoadingAnnouncerProps {
  className?: string;
  label: string;
}

export interface PageHeaderSkeletonProps {
  action?: boolean;
  className?: string;
}

export interface TableSkeletonProps {
  className?: string;
  framed?: boolean;
  /** First cell: two lines, a person, or a mark. */
  leading?: 'text' | 'avatar' | 'icon';
  rows?: number;
}

export interface PageLoadingProps {
  className?: string;
  header?: boolean;
  /** Announced to assistive tech. */
  label?: string;
  stats?: number;
}
