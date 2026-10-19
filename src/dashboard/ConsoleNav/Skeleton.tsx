'use client';

import clsx from 'clsx';

import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';

import {
  dashboardConsoleFooterSkeletonClasses,
  dashboardConsoleNavSkeletonClasses,
} from './stable';
import { styles } from './style';
import type { ConsoleNavGroup, ConsoleNavSkeletonProps } from './type';

const DEFAULT_GROUPS = [3, 6, 4, 3];

const Row = ({ group, index }: { group: number; index: number }) => (
  <div
    data-indent={0}
    {...styleProps([styles.item, styles.skeletonRow], dashboardConsoleNavSkeletonClasses('item'))}
  >
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
    <div
      aria-hidden
      data-console-nav-skeleton=""
      {...styleProps(styles.nav, clsx(dashboardConsoleNavSkeletonClasses(), className))}
    >
      {Array.from({ length: items }, (_, index) => (
        <Row group={0} index={index} key={index} />
      ))}
      {counts.map((count, group) => (
        <div
          key={group}
          {...styleProps(styles.skeletonGroup, dashboardConsoleNavSkeletonClasses('group'))}
        >
          <div
            data-level={0}
            {...styleProps(
              [styles.groupHeader, styles.skeletonRow],
              dashboardConsoleNavSkeletonClasses('group-header'),
            )}
          >
            <Skeleton height={12} radius={4} width={64 + (group % 2) * 16} />
          </div>
          {Array.from({ length: count }, (_, index) => (
            <div
              data-indent={1}
              key={index}
              {...styleProps(
                [styles.item, styles.itemIndented, styles.itemIndent1, styles.skeletonRow],
                dashboardConsoleNavSkeletonClasses('item'),
              )}
            >
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
export function ConsoleFooterSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      {...styleProps(
        styles.skeletonFooter,
        clsx(dashboardConsoleFooterSkeletonClasses(), className),
      )}
    >
      <Skeleton height={32} radius={16} width={32} />
      <Skeleton height={14} radius={4} width={96} />
    </div>
  );
}

export default ConsoleNavSkeleton;
