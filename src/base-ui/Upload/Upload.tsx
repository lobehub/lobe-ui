'use client';

import { cx } from 'antd-style';
import { Upload as UploadIcon } from 'lucide-react';
import type { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent, Ref } from 'react';
import { memo, useCallback, useRef, useState } from 'react';

import Icon from '@/Icon';

import { filterFilesByAccept } from './helpers';
import { styles } from './style';
import type { UploadProps } from './type';

const resolveAcceptedFiles = async (
  files: File[],
  beforeUpload: UploadProps['beforeUpload'],
): Promise<File[]> => {
  if (!beforeUpload) return files;

  const accepted: File[] = [];
  for (const file of files) {
    let result: boolean | void;
    try {
      result = await beforeUpload(file, files);
    } catch {
      result = false;
    }
    if (result !== false) accepted.push(file);
  }
  return accepted;
};

const Upload = memo<UploadProps>(
  ({
    accept,
    beforeUpload,
    children,
    className,
    description,
    directory,
    disabled,
    dragger,
    maxCount,
    multiple,
    onChange,
    onFiles,
    openFileDialogOnClick = true,
    ref,
    style,
    title,
    ...rest
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFiles = useCallback(
      async (rawFiles: File[]) => {
        const filtered = filterFilesByAccept(rawFiles, accept);
        const accepted = await resolveAcceptedFiles(filtered, beforeUpload);
        const sliced = maxCount ? accepted.slice(0, maxCount) : accepted;

        if (sliced.length === 0) return;

        onFiles?.(sliced);
        for (const file of sliced) onChange?.({ file, fileList: sliced });
      },
      [accept, beforeUpload, maxCount, onFiles, onChange],
    );

    const openDialog = useCallback(() => {
      if (disabled) return;
      inputRef.current?.click();
    }, [disabled]);

    const handleInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? [...event.target.files] : [];
        event.target.value = '';
        if (files.length > 0) void handleFiles(files);
      },
      [handleFiles],
    );

    const handleClick = useCallback(
      (event: MouseEvent) => {
        if (event.target === inputRef.current) return;
        if (disabled || !openFileDialogOnClick) return;
        openDialog();
      },
      [disabled, openFileDialogOnClick, openDialog],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (disabled || !openFileDialogOnClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDialog();
        }
      },
      [disabled, openFileDialogOnClick, openDialog],
    );

    const handleDragOver = useCallback((event: DragEvent) => {
      event.preventDefault();
    }, []);

    const handleDragEnter = useCallback(
      (event: DragEvent) => {
        event.preventDefault();
        if (!disabled) setIsDragOver(true);
      },
      [disabled],
    );

    const handleDragLeave = useCallback((event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (event: DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
        if (disabled) return;
        const files = event.dataTransfer.files ? [...event.dataTransfer.files] : [];
        if (files.length > 0) void handleFiles(files);
      },
      [disabled, handleFiles],
    );

    const directoryProps: Record<string, string> = directory ? { webkitdirectory: '' } : {};

    const inputEl = (
      <input
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        ref={inputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleInputChange}
        {...directoryProps}
      />
    );

    if (dragger) {
      return (
        <div
          aria-disabled={disabled}
          className={cx(styles.dragger, isDragOver && styles.draggerOver, className)}
          ref={ref as Ref<HTMLDivElement>}
          role="button"
          style={style}
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {inputEl}
          {children ?? (
            <>
              <Icon className={styles.draggerIcon} icon={UploadIcon} size={24} />
              <b className={styles.draggerTitle}>
                {title ?? 'Click or drag file to this area to upload'}
              </b>
              {description && <span className={styles.draggerDescription}>{description}</span>}
            </>
          )}
        </div>
      );
    }

    return (
      <span
        aria-disabled={disabled}
        className={cx(styles.trigger, className)}
        ref={ref as Ref<HTMLSpanElement>}
        role="button"
        style={style}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {inputEl}
        {children}
      </span>
    );
  },
);

Upload.displayName = 'Upload';

export default Upload;
