'use client';

import clsx from 'clsx';

import Skeleton from '@/Skeleton';
import { SkeletonImpl } from '@/Skeleton/Skeleton';
import { styleProps } from '@/styles/stylex/props';

import { useSurfaceCardStyles } from '../Surface/link';
import {
  dashboardLoadingAnnouncerClasses,
  dashboardPageHeaderSkeletonClasses,
  dashboardPageLoadingClasses,
  dashboardStatCardSkeletonClasses,
  dashboardTableSkeletonClasses,
} from './stable';
import { styles } from './style';
import type {
  LoadingAnnouncerProps,
  PageHeaderSkeletonProps,
  PageLoadingProps,
  TableSkeletonProps,
} from './type';

const lineWidths = [
  ['68%', '36%'],
  ['52%', '28%'],
  ['76%', '42%'],
  ['58%', '32%'],
] as const;

function LoadingAnnouncer({ className, label }: LoadingAnnouncerProps) {
  return (
    <output
      aria-live="polite"
      {...styleProps(styles.srOnly, clsx(dashboardLoadingAnnouncerClasses(), className))}
    >
      {label}
    </output>
  );
}

LoadingAnnouncer.displayName = 'LoadingAnnouncer';

function PageHeaderSkeleton({ action = true, className }: PageHeaderSkeletonProps) {
  const classes = dashboardPageHeaderSkeletonClasses;
  return (
    <div aria-hidden {...styleProps(styles.header, clsx(classes(), className))}>
      <div {...styleProps(styles.headerCopy, classes('copy'))}>
        <SkeletonImpl className={classes('title')} xstyle={styles.title} />
        <Skeleton.Text className={classes('description')} fontSize={14} width="46%" />
      </div>
      {action ? <SkeletonImpl className={classes('action')} xstyle={styles.action} /> : null}
    </div>
  );
}

PageHeaderSkeleton.displayName = 'PageHeaderSkeleton';

function TableSkeleton({
  className,
  framed = true,
  leading = 'text',
  rows = 6,
}: TableSkeletonProps) {
  const classes = dashboardTableSkeletonClasses;
  const cardStyles = useSurfaceCardStyles();
  const head = [96, 72, 64, 48];
  return (
    <div
      aria-hidden
      {...styleProps([styles.table, framed && cardStyles], clsx(classes(), className))}
    >
      <div {...styleProps(styles.thead, classes('head'))}>
        {head.map((width, index) => (
          <SkeletonImpl
            className={classes('head-cell')}
            key={index}
            style={{ width }}
            xstyle={styles.theadCell}
          />
        ))}
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} {...styleProps(styles.row, classes('row'))}>
          {leading === 'avatar' ? (
            <Skeleton.Avatar className={classes('leading')} shape="circle" size={24} />
          ) : null}
          {leading === 'icon' ? (
            <Skeleton.Avatar className={classes('leading')} shape="square" size={24} />
          ) : null}
          <div {...styleProps(styles.copy, classes('copy'))}>
            <Skeleton.Text
              fontSize={14}
              rows={2}
              width={[...lineWidths[index % lineWidths.length]]}
            />
          </div>
          <SkeletonImpl className={classes('tag')} xstyle={styles.tag} />
          <SkeletonImpl className={classes('cell')} xstyle={styles.cell} />
        </div>
      ))}
    </div>
  );
}

TableSkeleton.displayName = 'TableSkeleton';

function StatCardSkeleton({ className }: { className?: string }) {
  const cardStyles = useSurfaceCardStyles();
  const classes = dashboardStatCardSkeletonClasses;
  return (
    <div aria-hidden {...styleProps([styles.stat, cardStyles], clsx(classes(), className))}>
      <Skeleton.Text className={classes('label')} fontSize={14} width={72} />
      <SkeletonImpl className={classes('value')} xstyle={styles.statValue} />
      <Skeleton.Text className={classes('hint')} fontSize={14} width="68%" />
    </div>
  );
}

StatCardSkeleton.displayName = 'StatCardSkeleton';

function PageLoading({ className, header = true, label = 'Loading', stats = 4 }: PageLoadingProps) {
  return (
    <div
      aria-busy="true"
      {...styleProps(styles.page, clsx(dashboardPageLoadingClasses(), className))}
    >
      <LoadingAnnouncer label={label} />
      {header ? <PageHeaderSkeleton /> : null}
      <section
        aria-hidden
        {...styleProps(styles.statGrid, dashboardPageLoadingClasses('stat-grid'))}
      >
        {Array.from({ length: stats }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </section>
      <TableSkeleton />
    </div>
  );
}

PageLoading.displayName = 'PageLoading';

export { LoadingAnnouncer, PageHeaderSkeleton, StatCardSkeleton, TableSkeleton };
export default PageLoading;
