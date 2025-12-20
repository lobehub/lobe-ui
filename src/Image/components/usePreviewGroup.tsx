import type { GroupPreviewConfig } from 'antd/es/image/PreviewGroup';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

import Icon from '@/Icon';

import { useStyles } from '../style';
import type { PreviewGroupPreviewOptions } from '../type';
import Preview from './Preview';
import Toolbar from './Toolbar';

export const usePreview = (
  props: PreviewGroupPreviewOptions | boolean | undefined,
): GroupPreviewConfig | boolean => {
  const [visible, setVisible] = useState(false);
  const { cx, styles: componentStyles } = useStyles();

  return useMemo(() => {
    if (props === false) return props;

    const {
      onVisibleChange,
      minScale = 0.32,
      maxScale = 32,
      toolbarAddon,
      rootClassName,
      imageRender,
      toolbarRender,
      ...rest
    }: PreviewGroupPreviewOptions = (
      props === true ? {} : props || {}
    ) as PreviewGroupPreviewOptions;

    return {
      actionsRender: (_, info) => {
        const originalNode = (
          <Toolbar info={info} maxScale={maxScale} minScale={minScale}>
            {toolbarAddon}
          </Toolbar>
        );
        if (toolbarRender) return toolbarRender(originalNode, info);
        return originalNode;
      },
      closeIcon: <Icon color={'#fff'} icon={X} />,
      imageRender: (originalNode, info) => {
        const node = <Preview visible={visible}>{originalNode}</Preview>;
        if (imageRender) return imageRender(node, info);
        return node;
      },
      maxScale,
      minScale,
      onVisibleChange: (visible: boolean, prevVisible: boolean, current: number) => {
        setVisible(visible);
        onVisibleChange?.(visible, prevVisible, current);
      },
      rootClassName: cx(componentStyles.preview, rootClassName),
      ...rest,
    };
  }, [props, visible, componentStyles]);
};

export default usePreview;
