'use client';

import { cx } from 'antd-style';

import Skeleton from '@/base-ui/Skeleton';

import { styles } from './style';
import type { ConsoleNavGroup, ConsoleNavSkeletonProps } from './type';

const DEFAULT_GROUPS = [3, 6, 4, 3];

const Row = ({ group, index }: { group: number; index: number }) => (
  <div className={cx(styles.item, styles.skeletonRow)} data-indent={0}>
    <Skeleton height={16} radius={4} width={16} />
    <Skeleton height={14} radius={4} width={56 + ((index + group) % 3) * 20} />
  </div>
);

/**
 * Placeholder for `ConsoleNav` while the session or menu loads. Rows use the nav's own item,
 * group header and indent metrics, so swapping in the real nav does not shift anything.
 */
function ConsoleNavSkeleton({
  className,
  groups = DEFAULT_GROUPS,
  items = 1,
}: ConsoleNavSkeletonProps) {
  const counts = groups.map((group: number | ConsoleNavGroup) =>
    typeof group === 'number' ? group : (group.items?.length ?? 0),
  );
  return (
    <div aria-hidden className={cx(styles.nav, className)} data-console-nav-skeleton="">
      {Array.from({ length: items }, (_, index) => (
        <Row group={0} index={index} key={index} />
      ))}
      {counts.map((count, group) => (
        <div className={styles.skeletonGroup} key={group}>
          <div className={cx(styles.groupHeader, styles.skeletonRow)} data-level={0}>
            <Skeleton height={12} radius={4} width={64 + (group % 2) * 16} />
          </div>
          {Array.from({ length: count }, (_, index) => (
            <div className={cx(styles.item, styles.skeletonRow)} data-indent={1} key={index}>
              <Skeleton height={14} radius={4} width={56 + ((index + group) % 3) * 20} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

ConsoleNavSkeleton.displayName = 'ConsoleNavSkeleton';

/** Footer placeholder matching an account row: avatar plus name. */
export function ConsoleFooterSkeleton() {
  return (
    <div aria-hidden className={styles.skeletonFooter}>
      <Skeleton height={32} radius={16} width={32} />
      <Skeleton height={14} radius={4} width={96} />
    </div>
  );
}

export default ConsoleNavSkeleton;
