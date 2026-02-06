'use client';

import { cx } from 'antd-style';
import type { FC } from 'react';

import type { DivProps } from '@/types';

import { styles } from './style';

export type FileTreeProps = DivProps;

const FileTree: FC<FileTreeProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cx(styles.container, className)} {...rest}>
      {children}
    </div>
  );
};

FileTree.displayName = 'MdxFileTree';

export default FileTree;
