import { ImageProps } from 'antd';
import { X } from 'lucide-react';
import type { ImagePreviewType } from 'rc-image';
import { type ReactNode, useMemo, useState } from 'react';

import Icon from '@/Icon';

import { useStyles } from '../style';
import Preview from './Preview';
import Toolbar from './Toolbar';

export interface PreviewOptions extends ImagePreviewType {
  toolbarAddon?: ReactNode;
}

export const usePreview = (props: PreviewOptions = {}): ImageProps['preview'] => {
  const [visible, setVisible] = useState(false);
  const { cx, styles } = useStyles();
  const {
    onVisibleChange,
    styles: previewStyle = {},
    minScale = 0.32,
    maxScale = 32,
    toolbarAddon,
    rootClassName,
    imageRender,
    toolbarRender,
    ...rest
  } = props;

  return useMemo(
    () => ({
      closeIcon: <Icon color={'#fff'} icon={X} />,
      imageRender: (originalNode, info) => {
        const node = <Preview visible={visible}>{originalNode}</Preview>;
        if (imageRender) return imageRender(node, info);
        return node;
      },
      maxScale,
      minScale,
      onVisibleChange: (visible: boolean, prevVisible: boolean) => {
        setVisible(visible);
        onVisibleChange?.(visible, prevVisible);
      },
      rootClassName: cx(styles.preview, rootClassName),
      styles: { mask: { backdropFilter: 'blur(8px)' }, ...previewStyle },
      toolbarRender: (_, info) => {
        const originalNode = (
          <Toolbar info={info} maxScale={maxScale} minScale={minScale}>
            {toolbarAddon}
          </Toolbar>
        );
        if (toolbarRender) return toolbarRender(originalNode, info);
        return originalNode;
      },
      ...rest,
    }),
    [props, visible, styles],
  );
};

export default usePreview;
