'use client';

import { Image } from 'antd';
import { cx } from 'antd-style';
import { memo } from 'react';

import usePreviewGroup from './components/usePreviewGroup';
import { styles } from './style';
import type { PreviewGroupProps } from './type';

const { PreviewGroup: AntdPreviewGroup } = Image;

const PreviewGroup = memo<PreviewGroupProps>(({ items, children, enable = true, preview }) => {
  const mergePreview = usePreviewGroup(preview);
  const rootClassName = typeof preview === 'object' && preview ? preview.rootClassName : undefined;

  if (!enable) return children;

  return (
    <AntdPreviewGroup
      classNames={{ popup: { root: cx(styles.preview, rootClassName) } }}
      items={items}
      preview={mergePreview}
    >
      {children}
    </AntdPreviewGroup>
  );
});

PreviewGroup.displayName = 'PreviewGroup';

export default PreviewGroup;
