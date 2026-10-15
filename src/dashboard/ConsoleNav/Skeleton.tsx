'use client';

import * as stylex from '@stylexjs/stylex';

import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { ConsoleNavGroup, ConsoleNavSkeletonProps } from './type';

const DEFAULT_GROUPS = [3, 6, 4, 3];

const Row = ({ group, index }: { group: number; index: number }) => (
  <div data-indent={0} {...stylex.props(styles.item, styles.skeletonRow)}>
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
    <div aria-hidden data-console-nav-skeleton="" {...styleProps(styles.nav, className)}>
      {Array.from({ length: items }, (_, index) => (
        <Row group={0} index={index} key={index} />
      ))}
      {counts.map((count, group) => (
        <div key={group} {...stylex.props(styles.skeletonGroup)}>
          <div data-level={0} {...stylex.props(styles.groupHeader, styles.skeletonRow)}>
            <Skeleton height={12} radius={4} width={64 + (group % 2) * 16} />
          </div>
          {Array.from({ length: count }, (_, index) => (
            <div
              data-indent={1}
              key={index}
              {...stylex.props(
                styles.item,
                styles.itemIndented,
                styles.itemIndent1,
                styles.skeletonRow,
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
export function ConsoleFooterSkeleton() {
  return (
    <div aria-hidden {...stylex.props(styles.skeletonFooter)}>
      <Skeleton height={32} radius={16} width={32} />
      <Skeleton height={14} radius={4} width={96} />
    </div>
  );
}

export default ConsoleNavSkeleton;
