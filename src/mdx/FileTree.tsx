import { createStyles } from 'antd-style';
import { FileIcon, FolderIcon, FolderOpen } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon, { type IconProps } from '../Icon';

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-block: 0.75em;
      padding-inline: 1em;

      color: ${token.colorTextSecondary};

      border-radius: calc(var(--lobe-markdown-border-radius) * 1px);
      box-shadow: 0 0 0 1px var(--lobe-markdown-border-color);
    `,
    folder: css`
      cursor: pointer;

      &:hover {
        color: ${token.colorText};
      }
    `,
    folderChildren: css`
      padding-inline-start: 1em;
    `,
  };
});

export interface _FileTreeProps {
  children: ReactNode;
}

const _FileTree: FC<_FileTreeProps> = ({ children }) => {
  const { styles } = useStyles();
  return <div className={styles.container}>{children}</div>;
};

export interface FolderProps {
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: IconProps['icon'];
  name: string;
}

const Folder: FC<FolderProps> = ({ name, defaultOpen, icon = FolderIcon, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const { styles } = useStyles();
  return (
    <Flexbox>
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

export interface FileProps {
  icon?: IconProps['icon'];
  name: string;
}

const File: FC<FileProps> = ({ name, icon = FileIcon }) => {
  return (
    <Flexbox align={'center'} gap={4} horizontal>
      <Icon icon={icon} />
      <span>{name}</span>
    </Flexbox>
  );
};

export type FileTreeProps = typeof _FileTree & {
  File: typeof File;
  Folder: typeof Folder;
};

const FileTree = _FileTree as FileTreeProps;
FileTree.Folder = Folder;
FileTree.File = File;
export default FileTree;
