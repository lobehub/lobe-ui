import { type GroupPreviewConfig } from 'antd/es/image/PreviewGroup';
import { cx } from 'antd-style';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

import Icon from '@/Icon';

import { styles as componentStyles, styles } from '../style';
import { type PreviewGroupPreviewOptions } from '../type';
import Preview from './Preview';
import Toolbar from './Toolbar';

export const usePreview = (
  props: PreviewGroupPreviewOptions | boolean | undefined,
): GroupPreviewConfig | boolean => {
  const [visible, setVisible] = useState(false);

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
      onOpenChange: (open: boolean, info: { current: number }) => {
        setVisible(open);
        // 支持新的 onOpenChange
        onOpenChange?.(open, info);
        // 向后兼容旧的 onVisibleChange (注意参数差异)
        onVisibleChange?.(open, !open, info.current);
      },
      rootClassName: cx(styles.preview, rootClassName),
      ...rest,
    } satisfies GroupPreviewConfig;
  }, [props, visible, componentStyles]);
};

export default usePreview;
