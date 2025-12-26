'use client';

import { FolderIcon, FolderOpen } from 'lucide-react';
import { FC, useState } from 'react';

import { Flexbox, FlexboxProps } from '@/Flex';
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
        align={'center'}
        className={styles.folder}
        gap={4}
        horizontal
        onClick={() => setOpen(!open)}
      >
        <Icon icon={open ? FolderOpen : icon} />
        <span>{name}</span>
      </Flexbox>
      {open && <Flexbox className={styles.folderChildren}>{children}</Flexbox>}
    </Flexbox>
  );
};

Folder.displayName = 'MdxFolder';

export default Folder;
