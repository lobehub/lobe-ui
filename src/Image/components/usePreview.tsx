import type { ImageProps as AntdImageProps } from 'antd';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

import Icon from '@/Icon';

import { useStyles } from '../style';
import type { ImagePreviewOptions } from '../type';
import Preview from './Preview';
import Toolbar from './Toolbar';

export const usePreview = (
  props: ImagePreviewOptions | boolean | undefined,
): AntdImageProps['preview'] => {
  const [visible, setVisible] = useState(false);
  const { cx, styles } = useStyles();

  return useMemo(() => {
    if (props === false) return props;

    const {
      onVisibleChange,
      onOpenChange,
      minScale = 0.32,
      maxScale = 32,
      toolbarAddon,
      rootClassName,
      imageRender,
      toolbarRender,
      actionsRender,
      ...rest
    }: ImagePreviewOptions = (props === true ? {} : props || {}) as ImagePreviewOptions;

    return {
      actionsRender:
        actionsRender ||
        ((_, info) => {
          const originalNode = (
            <Toolbar info={info} maxScale={maxScale} minScale={minScale}>
              {toolbarAddon}
            </Toolbar>
          );
          // 向后兼容 toolbarRender
          if (toolbarRender) return toolbarRender(originalNode, info);
          return originalNode;
        }),
      closeIcon: <Icon color={'#fff'} icon={X} />,
      imageRender: (originalNode, info) => {
        const node = <Preview visible={visible}>{originalNode}</Preview>;
        if (imageRender) return imageRender(node, info);
        return node;
      },
      maxScale,
      minScale,
      onOpenChange: (open: boolean) => {
        setVisible(open);
        // 支持新的 onOpenChange
        onOpenChange?.(open);
        // 向后兼容旧的 onVisibleChange
        onVisibleChange?.(open, !open);
      },
      rootClassName: cx(styles.preview, rootClassName),
      styles: { mask: { backdropFilter: 'blur(8px)' } },
      ...rest,
    };
  }, [props, visible, styles]);
};

export default usePreview;
