'use client';

import type { FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import type { DivProps } from '@/types';

import { styles } from './style';

export type FileTreeProps = DivProps;

const FileTree: FC<FileTreeProps> = ({ children, className, ...rest }) => {
  return (
    <div {...styleProps(styles.container, className)} {...rest}>
      {children}
    </div>
  );
};

FileTree.displayName = 'MdxFileTree';

export default FileTree;
