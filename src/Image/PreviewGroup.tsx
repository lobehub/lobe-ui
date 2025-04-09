'use client';

import { Image } from 'antd';
import { memo } from 'react';

import usePreview from './components/usePreview';
import { PreviewGroupProps } from './type';

const { PreviewGroup: AntdPreviewGroup } = Image;

const PreviewGroup = memo<PreviewGroupProps>(({ items, children, enable = true, preview }) => {
  const mergePreivew = usePreview(preview);

  if (!enable) return children;

  return (
    <AntdPreviewGroup items={items} preview={mergePreivew}>
      {children}
    </AntdPreviewGroup>
  );
});

PreviewGroup.displayName = 'PreviewGroup';

export default PreviewGroup;
