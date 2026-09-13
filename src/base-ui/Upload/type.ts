import type { ComponentProps, ReactNode, Ref } from 'react';

export interface UploadChangeInfo {
  file: File;
  fileList: File[];
}

export interface UploadProps extends Omit<ComponentProps<'span'>, 'onChange' | 'title'> {
  accept?: string;
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean | void> | void;
  description?: ReactNode;
  directory?: boolean;
  disabled?: boolean;
  dragger?: boolean;
  maxCount?: number;
  multiple?: boolean;
  onChange?: (info: UploadChangeInfo) => void;
  onFiles?: (files: File[]) => void;
  openFileDialogOnClick?: boolean;
  ref?: Ref<HTMLElement>;
  title?: ReactNode;
}
