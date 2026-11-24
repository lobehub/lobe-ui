'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { diffStatClasses } from './stable';
import { styles } from './style';
import type { DiffStatKind, DiffStatProps } from './type';

const KIND_STYLES = {
  added: styles.kindAdded,
  deleted: styles.kindDeleted,
  modified: styles.kindModified,
  renamed: styles.kindRenamed,
} as const satisfies Record<DiffStatKind, unknown>;

/**
 * A git-style `+added −deleted` line stat, optionally led by a dot for the kind of
 * change. Renders nothing when there is neither a count nor a kind to show.
 */
const DiffStat: FC<DiffStatProps> = ({
  additions = 0,
  className,
  classNames,
  deletions = 0,
  hideZero = false,
  kind,
  ref,
  style,
  ...rest
}) => {
  const hasCounts = additions !== 0 || deletions !== 0;
  if (!hasCounts && !kind) return null;

  const showAdditions = hasCounts && (!hideZero || additions > 0);
  const showDeletions = hasCounts && (!hideZero || deletions > 0);

  return (
    <span
      ref={ref}
      {...styleProps(styles.root, clsx(diffStatClasses(), className), style)}
      {...toDataAttributes({ kind })}
      {...rest}
    >
      {kind && (
        <span
          aria-hidden
          {...styleProps(
            [styles.kind, KIND_STYLES[kind]],
            clsx(diffStatClasses('kind'), classNames?.kind),
          )}
        />
      )}
      {showAdditions && (
        <span
          {...styleProps(
            styles.additions,
            clsx(diffStatClasses('additions'), classNames?.additions),
          )}
        >
          +{additions}
        </span>
      )}
      {showDeletions && (
        <span
          {...styleProps(
            styles.deletions,
            clsx(diffStatClasses('deletions'), classNames?.deletions),
          )}
        >
          −{deletions}
        </span>
      )}
    </span>
  );
};

DiffStat.displayName = 'DiffStat';

export default DiffStat;
