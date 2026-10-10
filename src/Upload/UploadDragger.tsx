'use client';

import { memo } from 'react';

import type { UploadProps } from './type';
import Upload from './Upload';

const UploadDragger = memo<UploadProps>((props) => <Upload dragger {...props} />);

UploadDragger.displayName = 'UploadDragger';

export default UploadDragger;
