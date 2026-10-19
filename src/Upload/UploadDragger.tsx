'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { uploadDraggerClasses } from './stable';
import type { UploadProps } from './type';
import Upload from './Upload';

const UploadDragger = memo<UploadProps>(({ className, ...props }) => (
  <Upload dragger className={clsx(uploadDraggerClasses(), className)} {...props} />
));

UploadDragger.displayName = 'UploadDragger';

export default UploadDragger;
