'use client';

import type { FileDiffOptions } from '@pierre/diffs';
import { MultiFileDiff } from '@pierre/diffs/react';
import { useThemeMode } from 'antd-style';
import { memo, useMemo } from 'react';

import { DiffPanel } from './DiffPanel';
import { getLobeDiffOptions, registerLobeDiffThemes } from './theme';
import type { CodeDiffProps } from './type';

registerLobeDiffThemes();

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
      () => getLobeDiffOptions({ diffOptions, isDarkMode, viewMode }),
      [isDarkMode, viewMode, diffOptions],
    );

    return (
      <DiffPanel
        actions={actions}
        additions={additions}
        body={<MultiFileDiff newFile={newFile} oldFile={oldFile} options={options} />}
        className={className}
        classNames={classNames}
        dataCodeType="code-diff"
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

CodeDiff.displayName = 'CodeDiff';

export default CodeDiff;
