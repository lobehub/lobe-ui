'use client';

import { FC } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export type FileTreeProps = DivProps;

const FileTree: FC<FileTreeProps> = ({ children, className, ...rest }) => {
  const { cx, styles } = useStyles();
  return (
    <div className={cx(styles.container, className)} {...rest}>
      {children}
    </div>
  );
};

FileTree.displayName = 'MdxFileTree';

export default FileTree;
