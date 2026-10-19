'use client';

import clsx from 'clsx';
import { FileIcon } from 'lucide-react';
import type { FC } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import Icon, { type IconProps } from '@/Icon';

import { mdxFileTreeClasses } from './stable';

export interface FileProps extends Omit<FlexboxProps, 'children'> {
  icon?: IconProps['icon'];
  name: string;
}

const File: FC<FileProps> = ({ name, icon = FileIcon, className, ...rest }) => {
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={clsx(mdxFileTreeClasses('file'), className)}
      gap={4}
      {...rest}
    >
      <Icon className={mdxFileTreeClasses('icon')} icon={icon} />
      <span className={mdxFileTreeClasses('name')}>{name}</span>
    </Flexbox>
  );
};

File.displayName = 'MdxFile';

export default File;
