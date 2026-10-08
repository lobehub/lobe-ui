'use client';

import * as stylex from '@stylexjs/stylex';
import { FolderIcon, FolderOpen } from 'lucide-react';
import { type FC, useState } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import Icon, { type IconProps } from '@/Icon';

import { styles } from './style';

export interface FolderProps extends FlexboxProps {
  defaultOpen?: boolean;
  icon?: IconProps['icon'];
  name: string;
}

const Folder: FC<FolderProps> = ({ name, defaultOpen, icon = FolderIcon, children, ...rest }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Flexbox {...rest}>
      <Flexbox
        horizontal
        align={'center'}
        {...stylex.props(styles.folder)}
        gap={4}
        onClick={() => setOpen(!open)}
      >
        <Icon icon={open ? FolderOpen : icon} />
        <span>{name}</span>
      </Flexbox>
      {open && <Flexbox {...stylex.props(styles.folderChildren)}>{children}</Flexbox>}
    </Flexbox>
  );
};

Folder.displayName = 'MdxFolder';

export default Folder;
