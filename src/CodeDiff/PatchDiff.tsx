'use client';

import type { FileDiffOptions } from '@pierre/diffs';
import { PatchDiff as PierrePatchDiff } from '@pierre/diffs/react';
import { cx } from 'antd-style';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';

import { headerVariants, prefix, styles, variants } from './style';
import type { PatchDiffProps } from './type';

const countPatchChanges = (patch: string): { additions: number; deletions: number } => {
  const lines = patch.split('\n');
  let additions = 0;
  let deletions = 0;

  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      additions++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      deletions++;
    }
  }

  return { additions, deletions };
};

export const PatchDiff = memo<PatchDiffProps>(
  ({
    patch,
    language,
    fileName,
    viewMode = 'split',
    showHeader = true,
    variant = 'filled',
    className,
    classNames,
    styles: customStyles,
    actionsRender,
    diffOptions,
    ...rest
  }) => {
    const displayName = useMemo(() => {
      if (fileName) return fileName;
      // Try to extract filename from patch header
      const match = patch.match(/^(?:-{3}|\+{3})\s+(?:a\/|b\/)?(.+?)(?:\t|$)/m);
      if (match?.[1]) return match[1];
      if (language) return language;
      return 'patch';
    }, [fileName, patch, language]);

    const { additions, deletions } = useMemo(() => countPatchChanges(patch), [patch]);

    const actions = useMemo(() => {
      if (!actionsRender) return null;
      return actionsRender({
        originalNode: null,
        patch,
      });
    }, [actionsRender, patch]);

    const options = useMemo<FileDiffOptions<string>>(
      () => ({
        diffStyle: viewMode,
        disableFileHeader: true,
        ...diffOptions,
      }),
      [viewMode, diffOptions],
    );

    return (
      <Flexbox
        className={cx(variants({ variant }), className)}
        data-code-type="patch-diff"
        {...rest}
      >
        {showHeader && (
          <div
            className={cx(headerVariants({ variant }), classNames?.header)}
            style={customStyles?.header}
          >
            <Flexbox align="center" gap={8} horizontal>
              <MaterialFileTypeIcon filename={fileName || displayName} size={18} type="file" />
              <span>{displayName}</span>
            </Flexbox>
            <Flexbox align="center" gap={8} horizontal>
              {(deletions > 0 || additions > 0) && (
                <Flexbox className={styles.stats} gap={8} horizontal>
                  {deletions > 0 && <span className={styles.deletions}>-{deletions}</span>}
                  {additions > 0 && <span className={styles.additions}>+{additions}</span>}
                </Flexbox>
              )}
              {actions && (
                <Flexbox align="center" className={cx(`${prefix}-actions`, styles.actions)} gap={4}>
                  {actions}
                </Flexbox>
              )}
            </Flexbox>
          </div>
        )}
        <div className={cx(styles.body, classNames?.body)} style={customStyles?.body}>
          <PierrePatchDiff options={options} patch={patch} />
        </div>
      </Flexbox>
    );
  },
);

PatchDiff.displayName = 'PatchDiff';

export default PatchDiff;
