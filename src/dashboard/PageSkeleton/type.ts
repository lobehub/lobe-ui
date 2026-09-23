export interface LoadingAnnouncerProps {
  label: string;
}

export interface PageHeaderSkeletonProps {
  action?: boolean;
}

export interface TableSkeletonProps {
  framed?: boolean;
  /** First cell: two lines, a person, or a mark. */
  leading?: 'text' | 'avatar' | 'icon';
  rows?: number;
}

export interface PageLoadingProps {
  header?: boolean;
  /** Announced to assistive tech. */
  label?: string;
  stats?: number;
}
