'use client';

import clsx from 'clsx';
import { type FC, useMemo } from 'react';

import { Center } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';

import FileIcon from './components/FileIcon';
import FolderIcon from './components/FolderIcon';
import { fileTypeIconClasses } from './stable';
import { styles } from './style';
import type { FileTypeIconProps } from './type';

const FileTypeIcon: FC<FileTypeIconProps> = ({
  icon,
  color,
  filetype,
  type = 'file',
  size = 48,
  style,
  variant,
  className,
  ref,
  ...rest
}) => {
  const { isDarkMode } = useThemeMode();
  const isMono = variant === 'mono';

  const filetypeShort = useMemo(
    () => (filetype && filetype.length > 4 ? filetype.slice(0, 4) : filetype),
    [filetype],
  );

  const fontSize = useMemo(() => {
    if (filetypeShort && filetypeShort.length > 3) {
      return 24 / (4 + (filetypeShort.length - 3));
    }
    return 6;
  }, [filetypeShort]);

  const iconColor = useMemo(
    () =>
      isMono ? (isDarkMode ? cssVar.colorFill : cssVar.colorBgContainer) : color || cssVar.geekblue,
    [isMono, isDarkMode, color],
  );

  const contentClassName = icon
    ? fileTypeIconClasses('shape')
    : clsx(fileTypeIconClasses(), className);
  const content =
    type === 'file' ? (
      <FileIcon
        filetypeShort={filetypeShort}
        fontSize={fontSize}
        hasIcon={!!icon}
        iconColor={iconColor}
        isMono={isMono}
        size={size}
        {...rest}
        className={contentClassName}
      />
    ) : (
      <FolderIcon
        filetype={filetype}
        fontSize={fontSize}
        hasIcon={!!icon}
        iconColor={iconColor}
        isMono={isMono}
        size={size}
        {...rest}
        className={contentClassName}
      />
    );

  if (!icon) return content;

  return (
    <Center
      flex={'none'}
      height={size}
      ref={ref}
      width={size}
      {...rest}
      {...styleProps(styles.container, clsx(fileTypeIconClasses(), className), style)}
    >
      <div
        {...styleProps(styles.inner, fileTypeIconClasses('icon'), {
          fontSize: size / 2.4,
          top: type === 'file' ? '20%' : '16%',
        })}
      >
        {icon}
      </div>
      {content}
    </Center>
  );
};

FileTypeIcon.displayName = 'FileTypeIcon';

export default FileTypeIcon;
