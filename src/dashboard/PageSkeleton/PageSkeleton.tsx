'use client';

import Skeleton from '@/base-ui/Skeleton';

import { styles as surfaceStyles } from '../Surface/style';
import { styles } from './style';
import type {
  LoadingAnnouncerProps,
  PageHeaderSkeletonProps,
  PageLoadingProps,
  TableSkeletonProps,
} from './type';

const bone = { height: undefined, width: undefined };
const lineWidths = [
  ['68%', '36%'],
  ['52%', '28%'],
  ['76%', '42%'],
  ['58%', '32%'],
] as const;

function LoadingAnnouncer({ label }: LoadingAnnouncerProps) {
  return (
    <output aria-live="polite" className={styles.srOnly}>
      {label}
    </output>
  );
}

LoadingAnnouncer.displayName = 'LoadingAnnouncer';

function PageHeaderSkeleton({ action = true }: PageHeaderSkeletonProps) {
  return (
    <div aria-hidden className={styles.header}>
      <div className={styles.headerCopy}>
        <Skeleton className={styles.title} style={bone} />
        <Skeleton.Text fontSize={14} width="46%" />
      </div>
      {action ? <Skeleton className={styles.action} style={bone} /> : null}
    </div>
  );
}

PageHeaderSkeleton.displayName = 'PageHeaderSkeleton';

function TableSkeleton({ framed = true, leading = 'text', rows = 6 }: TableSkeletonProps) {
  const head = [96, 72, 64, 48];
  return (
    <div aria-hidden className={framed ? `${styles.table} ${surfaceStyles.card}` : styles.table}>
      <div className={styles.thead}>
        {head.map((width, index) => (
          <Skeleton className={styles.theadCell} key={index} style={{ ...bone, width }} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div className={styles.row} key={index}>
          {leading === 'avatar' ? <Skeleton.Avatar shape="circle" size={24} /> : null}
          {leading === 'icon' ? <Skeleton.Avatar shape="square" size={24} /> : null}
          <div className={styles.copy}>
            <Skeleton.Text
              fontSize={14}
              rows={2}
              width={[...lineWidths[index % lineWidths.length]]}
            />
          </div>
          <Skeleton className={styles.tag} style={bone} />
          <Skeleton className={styles.cell} style={bone} />
        </div>
      ))}
    </div>
  );
}

TableSkeleton.displayName = 'TableSkeleton';

function StatCardSkeleton() {
  return (
    <div aria-hidden className={`${styles.stat} ${surfaceStyles.card}`}>
      <Skeleton.Text fontSize={14} width={72} />
      <Skeleton className={styles.statValue} style={bone} />
      <Skeleton.Text fontSize={14} width="68%" />
    </div>
  );
}

StatCardSkeleton.displayName = 'StatCardSkeleton';

function PageLoading({ header = true, label = 'Loading', stats = 4 }: PageLoadingProps) {
  return (
    <div aria-busy="true" className={styles.page}>
      <LoadingAnnouncer label={label} />
      {header ? <PageHeaderSkeleton /> : null}
      <section aria-hidden className={styles.statGrid}>
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
