'use client';

import clsx from 'clsx';
import { type FC, useMemo } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import FileTypeIcon from '@/FileTypeIcon';
import { Center } from '@/Flex';
import Img from '@/Img';

import { materialFileTypeIconClasses } from './stable';
import type { MaterialFileTypeIconProps } from './type';
import { getIconUrlForDirectoryPath, getIconUrlForFilePath } from './utils';

const MaterialFileTypeIcon: FC<MaterialFileTypeIconProps> = ({
  fallbackUnknownType = true,
  filename,
  size = 48,
  variant = 'raw',
  type,
  style,
  open,
  ...rest
}) => {
  const genCdnUrl = useCdnFn();
  const ICONS_URL = genCdnUrl({
    path: 'assets',
    pkg: '@lobehub/assets-fileicon',
    version: '1.0.0',
  });

  const iconUrl: string = useMemo(() => {
    return type === 'file'
      ? getIconUrlForFilePath({ fallbackUnknownType, iconsUrl: ICONS_URL, path: filename })
      : getIconUrlForDirectoryPath({
          fallbackUnknownType,
          iconsUrl: ICONS_URL,
          open,
          path: filename,
        });
  }, [ICONS_URL, type, filename, open]);

  if (!iconUrl)
    return (
      <FileTypeIcon
        className={clsx(materialFileTypeIconClasses(), rest.className)}
        filetype={filename.split('.')[1]}
        size={size}
        type={type}
        variant={'mono'}
      />
    );

  if (variant === 'raw')
    return (
      <Img
        alt={filename}
        height={size}
        src={iconUrl}
        style={style}
        width={size}
        {...rest}
        className={clsx(materialFileTypeIconClasses(), rest.className)}
      />
    );

  return (
    <Center
      flex={'none'}
      height={size}
      style={{ position: 'relative', ...style }}
      width={size}
      {...rest}
      className={clsx(materialFileTypeIconClasses(), rest.className)}
    >
      <FileTypeIcon size={size} type={variant} variant={'mono'} />
      <Img
        alt={filename}
        height={size / 2}
        src={iconUrl}
        style={{ position: 'absolute', top: size / 3 }}
        width={size / 2}
        {...rest}
        className={clsx(materialFileTypeIconClasses('img'), rest.className)}
      />
    </Center>
  );
};

MaterialFileTypeIcon.displayName = 'MaterialFileTypeIcon';

export default MaterialFileTypeIcon;
