'use client';

import { FileIcon } from 'lucide-react';
import { FC } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import Icon, { type IconProps } from '@/Icon';

export interface FileProps extends Omit<FlexboxProps, 'children'> {
  icon?: IconProps['icon'];
  name: string;
}

const File: FC<FileProps> = ({ name, icon = FileIcon, ...rest }) => {
  return (
    <Flexbox align={'center'} gap={4} horizontal {...rest}>
      <Icon icon={icon} />
      <span>{name}</span>
    </Flexbox>
  );
};

export default File;
