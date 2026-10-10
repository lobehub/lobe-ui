'use client';

import * as stylex from '@stylexjs/stylex';

import Skeleton from '@/Skeleton';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { styles as surfaceStyles } from '../Surface/style';
import { styles } from './style';
import type {
  LoadingAnnouncerProps,
  PageHeaderSkeletonProps,
  PageLoadingProps,
  TableSkeletonProps,
} from './type';

const bone = { height: undefined, width: undefined };
const tagBone = { ...bone, borderRadius: cssVar.borderRadiusSM };
const lineWidths = [
  ['68%', '36%'],
  ['52%', '28%'],
  ['76%', '42%'],
  ['58%', '32%'],
] as const;

function LoadingAnnouncer({ label }: LoadingAnnouncerProps) {
  return (
    <output aria-live="polite" {...stylex.props(styles.srOnly)}>
      {label}
    </output>
  );
}

LoadingAnnouncer.displayName = 'LoadingAnnouncer';

function PageHeaderSkeleton({ action = true }: PageHeaderSkeletonProps) {
  return (
    <div aria-hidden {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.headerCopy)}>
        <Skeleton className={stylex.props(styles.title).className} style={bone} />
        <Skeleton.Text fontSize={14} width="46%" />
      </div>
      {action ? <Skeleton className={stylex.props(styles.action).className} style={bone} /> : null}
    </div>
  );
}

PageHeaderSkeleton.displayName = 'PageHeaderSkeleton';

function TableSkeleton({ framed = true, leading = 'text', rows = 6 }: TableSkeletonProps) {
  const head = [96, 72, 64, 48];
  return (
    <div aria-hidden {...stylex.props(styles.table, framed && surfaceStyles.card)}>
      <div {...stylex.props(styles.thead)}>
        {head.map((width, index) => (
          <Skeleton
            className={stylex.props(styles.theadCell).className}
            key={index}
            style={{ ...bone, width }}
          />
        ))}
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div {...stylex.props(styles.row)} key={index}>
          {leading === 'avatar' ? <Skeleton.Avatar shape="circle" size={24} /> : null}
          {leading === 'icon' ? <Skeleton.Avatar shape="square" size={24} /> : null}
          <div {...stylex.props(styles.copy)}>
            <Skeleton.Text
              fontSize={14}
              rows={2}
              width={[...lineWidths[index % lineWidths.length]]}
            />
          </div>
          <Skeleton className={stylex.props(styles.tag).className} style={tagBone} />
          <Skeleton className={stylex.props(styles.cell).className} style={bone} />
        </div>
      ))}
    </div>
  );
}

TableSkeleton.displayName = 'TableSkeleton';

function StatCardSkeleton() {
  return (
    <div aria-hidden {...stylex.props(styles.stat, surfaceStyles.card)}>
      <Skeleton.Text fontSize={14} width={72} />
      <Skeleton className={stylex.props(styles.statValue).className} style={bone} />
      <Skeleton.Text fontSize={14} width="68%" />
    </div>
  );
}

StatCardSkeleton.displayName = 'StatCardSkeleton';

function PageLoading({ header = true, label = 'Loading', stats = 4 }: PageLoadingProps) {
  return (
    <div aria-busy="true" {...stylex.props(styles.page)}>
      <LoadingAnnouncer label={label} />
      {header ? <PageHeaderSkeleton /> : null}
      <section aria-hidden {...stylex.props(styles.statGrid)}>
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
