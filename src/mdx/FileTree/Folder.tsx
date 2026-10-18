'use client';

import clsx from 'clsx';
import { FolderIcon, FolderOpen } from 'lucide-react';
import { type FC, useState } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import Icon, { type IconProps } from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { mdxFileTreeClasses } from './stable';
import { styles } from './style';

export interface FolderProps extends FlexboxProps {
  defaultOpen?: boolean;
  icon?: IconProps['icon'];
  name: string;
}

const Folder: FC<FolderProps> = ({
  name,
  defaultOpen,
  icon = FolderIcon,
  children,
  className,
  ...rest
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Flexbox
      className={clsx(mdxFileTreeClasses('folder'), className)}
      {...toDataAttributes({ open })}
      {...rest}
    >
      <Flexbox
        horizontal
        align={'center'}
        {...styleProps(styles.folder, mdxFileTreeClasses('folder-label'))}
        gap={4}
        onClick={() => setOpen(!open)}
      >
        <Icon className={mdxFileTreeClasses('icon')} icon={open ? FolderOpen : icon} />
        <span className={mdxFileTreeClasses('name')}>{name}</span>
      </Flexbox>
      {open && (
        <Flexbox className={mdxFileTreeClasses('folder-children')} paddingInline={'1em 0'}>
          {children}
        </Flexbox>
      )}
    </Flexbox>
  );
};

Folder.displayName = 'MdxFolder';

export default Folder;
