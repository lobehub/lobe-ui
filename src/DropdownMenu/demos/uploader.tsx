'use client';

import { DropdownMenu, type DropdownMenuProps, Icon } from '@lobehub/ui';
import { Upload, type UploadFile, type UploadProps } from 'antd';
import { createStaticStyles } from 'antd-style';
import { FileIcon, MoreHorizontal, UploadIcon, XIcon } from 'lucide-react';
import { useRef, useState } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  fileItem: css`
    display: flex;
    gap: 8px;
    align-items: center;

    padding-block: 8px;
    padding-inline: 12px;
    border-radius: 8px;

    font-size: 13px;

    background: ${cssVar.colorFillQuaternary};
  `,
  fileList: css`
    display: flex;
    flex-direction: column;
    gap: 8px;

    min-width: 200px;
    padding: 12px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;
  `,
  fileName: css`
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  fileSize: css`
    flex-shrink: 0;
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  header: css`
    font-size: 12px;
    font-weight: 500;
    color: ${cssVar.colorTextSecondary};
  `,
  removeBtn: css`
    cursor: pointer;

    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    padding: 2px;
    border-radius: 4px;

    color: ${cssVar.colorTextDescription};

    transition: all 150ms ${cssVar.motionEaseOut};

    &:hover {
      color: ${cssVar.colorError};
      background: ${cssVar.colorErrorBg};
    }
  `,
  trigger: css`
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 44px;
    height: 44px;
    padding: 0;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorBgElevated};

    transition: all 150ms ${cssVar.motionEaseOut};

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:active {
      transform: translateY(1px);
    }

    &[data-state='open'],
    &[aria-expanded='true'] {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
}));

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // 使用 actionsRef 来命令式关闭菜单（无需受控模式）
  const actionsRef = useRef<{ close: () => void; unmount: () => void } | null>(null);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setFileList((prev) => [
        ...prev,
        {
          name: file.name,
          size: file.size,
          status: 'done',
          uid: file.uid,
        },
      ]);
      // 业务逻辑完成后，通过 actionsRef 关闭菜单
      actionsRef.current?.close();
      return false;
    },
    fileList,
    showUploadList: false,
  };

  const handleRemoveFile = (uid: string) => {
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  };

  const items: DropdownMenuProps['items'] = [
    {
      // 关键：设置 closeOnClick: false 阻止菜单关闭
      // 这样 Upload 组件不会被卸载，文件选择后事件能正常触发
      closeOnClick: false,
      icon: <Icon icon={UploadIcon} />,
      key: 'upload',
      label: (
        <Upload {...uploadProps}>
          <span>Upload File</span>
        </Upload>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <DropdownMenu nativeButton actionsRef={actionsRef as any} items={items}>
        <button aria-label="Open menu" className={styles.trigger} type="button">
          <MoreHorizontal />
        </button>
      </DropdownMenu>

      {fileList.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.header}>Uploaded Files ({fileList.length})</div>
          {fileList.map((file) => (
            <div className={styles.fileItem} key={file.uid}>
              <Icon icon={FileIcon} size={16} />
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{formatFileSize(file.size || 0)}</span>
              <div className={styles.removeBtn} onClick={() => handleRemoveFile(file.uid)}>
                <Icon icon={XIcon} size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
