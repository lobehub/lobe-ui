'use client';

import { FileIcon } from 'lucide-react';
import type { FC } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import Icon, { type IconProps } from '@/Icon';

export interface FileProps extends Omit<FlexboxProps, 'children'> {
  icon?: IconProps['icon'];
  name: string;
}

const File: FC<FileProps> = ({ name, icon = FileIcon, ...rest }) => {
  return (
    <Flexbox horizontal align={'center'} gap={4} {...rest}>
      <Icon icon={icon} />
      <span>{name}</span>
    </Flexbox>
  );
};

File.displayName = 'MdxFile';

export default File;
