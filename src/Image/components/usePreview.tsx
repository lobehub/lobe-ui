import { ImageProps as AntdImageProps } from 'antd';
import { isObject } from 'lodash-es';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

import Icon from '@/Icon';

import { useStyles } from '../style';
import { ImageProps } from '../type';
import Preview from './Preview';
import Toolbar from './Toolbar';

export const usePreview = (props: ImageProps['preview']): AntdImageProps['preview'] => {
  const [visible, setVisible] = useState(false);
  const { cx, styles } = useStyles();

  return useMemo(() => {
    if (!isObject(props)) return props;

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

    return {
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
    };
  }, [props, visible, styles]);
};

export default usePreview;
