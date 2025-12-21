'use client';

import { memo, useMemo } from 'react';

import { Center } from '@/Flex';

import FileIcon from './components/FileIcon';
import FolderIcon from './components/FolderIcon';
import { useStyles } from './style';
import type { FileTypeIconProps } from './type';

const FileTypeIcon = memo<FileTypeIconProps>(
  ({
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
    const { cx, styles, theme } = useStyles();
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
        isMono
          ? theme.isDarkMode
            ? theme.colorFill
            : theme.colorBgContainer
          : color || theme.geekblue,
      [isMono, theme.isDarkMode, theme.colorFill, theme.colorBgContainer, color],
    );

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
        />
      );

    if (!icon) return content;

    return (
      <Center
        className={cx(styles.container, className)}
        flex={'none'}
        height={size}
        ref={ref}
        style={style}
        width={size}
        {...rest}
      >
        <div
          className={styles.inner}
          style={{
            fontSize: size / 2.4,
            top: type === 'file' ? '20%' : '16%',
          }}
        >
          {icon}
        </div>
        {content}
      </Center>
    );
  },
);

FileTypeIcon.displayName = 'FileTypeIcon';

export default FileTypeIcon;
