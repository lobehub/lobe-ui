'use client';

import type { FileDiffOptions } from '@pierre/diffs';
import { PatchDiff as PierrePatchDiff } from '@pierre/diffs/react';
import { useThemeMode } from 'antd-style';
import { memo, useMemo } from 'react';

import { DiffPanel } from './DiffPanel';
import { getLobeDiffOptions, registerLobeDiffThemes } from './theme';
import type { PatchDiffProps } from './type';

registerLobeDiffThemes();

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
    defaultExpand = true,
    fullFeatured = true,
    variant = 'filled',
    className,
    classNames,
    styles: customStyles,
    actionsRender,
    diffOptions,
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();

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
      () => getLobeDiffOptions({ diffOptions, isDarkMode, viewMode }),
      [isDarkMode, viewMode, diffOptions],
    );

    return (
      <DiffPanel
        actions={actions}
        additions={additions}
        body={<PierrePatchDiff options={options} patch={patch} />}
        className={className}
        classNames={classNames}
        dataCodeType="patch-diff"
        defaultExpand={defaultExpand}
        deletions={deletions}
        displayName={displayName}
        fileName={fileName}
        fullFeatured={fullFeatured}
        showHeader={showHeader}
        styles={customStyles}
        variant={variant}
        {...rest}
      />
    );
  },
);

PatchDiff.displayName = 'PatchDiff';

export default PatchDiff;
