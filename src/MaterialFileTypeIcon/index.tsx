'use client';

import { memo, useMemo } from 'react';
import { Center } from 'react-layout-kit';

import { useCdnFn } from '@/ConfigProvider';
import FileTypeIcon from '@/FileTypeIcon';
import Img from '@/Img';
import { DivProps } from '@/types';

import { getIconUrlForDirectoryPath, getIconUrlForFilePath } from './utils';

export interface MaterialFileTypeIconProps extends DivProps {
  fallbackUnknownType?: boolean;
  filename: string;
  open?: boolean;
  size?: number;
  type?: 'file' | 'folder';
  variant?: 'pure' | 'file' | 'folder';
}

const MaterialFileTypeIcon = memo<MaterialFileTypeIconProps>(
  ({
    fallbackUnknownType = true,
    filename,
    size = 48,
    variant = 'pure',
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
        <FileTypeIcon filetype={filename.split('.')[1]} size={size} type={type} variant={'mono'} />
      );

    if (variant === 'pure')
      return <Img height={size} src={iconUrl} style={style} width={size} {...rest} />;

    return (
      <Center
        flex={'none'}
        height={size}
        style={{ position: 'relative', ...style }}
        width={size}
        {...rest}
      >
        <FileTypeIcon size={size} type={variant} variant={'mono'} />
        <Img
          height={size / 2}
          src={iconUrl}
          style={{ position: 'absolute', top: size / 3 }}
          width={size / 2}
          {...rest}
        />
      </Center>
    );
  },
);

export default MaterialFileTypeIcon;
