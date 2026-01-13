'use client';

import type { FileDiffOptions } from '@pierre/diffs';
import { MultiFileDiff } from '@pierre/diffs/react';
import { cx } from 'antd-style';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';

import { headerVariants, prefix, styles, variants } from './style';
import type { CodeDiffProps } from './type';

const countContentChanges = (
  oldContent: string,
  newContent: string,
): { additions: number; deletions: number } => {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);

  let deletions = 0;
  let additions = 0;

  for (const line of oldLines) {
    if (!newSet.has(line)) {
      deletions++;
    }
  }

  for (const line of newLines) {
    if (!oldSet.has(line)) {
      additions++;
    }
  }

  return { additions, deletions };
};

export const CodeDiff = memo<CodeDiffProps>(
  ({
    oldContent,
    newContent,
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
      if (language) return language;
      return 'diff';
    }, [fileName, language]);

    const { additions, deletions } = useMemo(
      () => countContentChanges(oldContent, newContent),
      [oldContent, newContent],
    );

    const actions = useMemo(() => {
      if (!actionsRender) return null;
      return actionsRender({
        newContent,
        oldContent,
        originalNode: null,
      });
    }, [actionsRender, oldContent, newContent]);

    const oldFile = useMemo(
      () => ({
        contents: oldContent,
        lang: language as any,
        name: fileName || 'file',
      }),
      [oldContent, language, fileName],
    );

    const newFile = useMemo(
      () => ({
        contents: newContent,
        lang: language as any,
        name: fileName || 'file',
      }),
      [newContent, language, fileName],
    );

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
        data-code-type="code-diff"
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
          <MultiFileDiff newFile={newFile} oldFile={oldFile} options={options} />
        </div>
      </Flexbox>
    );
  },
);

CodeDiff.displayName = 'CodeDiff';

export default CodeDiff;
