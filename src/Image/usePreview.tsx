import { ImageProps } from 'antd';
import {
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import Icon from '@/Icon';
import Preview from '@/Image/Preview';
import { useStyles } from '@/Image/style';

export type PreviewOptions = any & {
  toolbarAddon?: ReactNode;
};

export const usePreview = ({
  onVisibleChange,
  styles: previewStyle = {},
  minScale = 0.32,
  maxScale = 32,
  toolbarAddon,
  ...rest
}: PreviewOptions = {}): ImageProps['preview'] => {
  const [visible, setVisible] = useState(false);
  const { styles } = useStyles();

  return {
    closeIcon: <Icon icon={X} size={{ fontSize: 18, strokeWidth: 3 }} />,
    imageRender: (node) => <Preview visible={visible}>{node}</Preview>,
    maxScale,
    minScale,
    onVisibleChange: (e) => {
      setVisible(e);
      onVisibleChange?.(e);
    },

    styles: { mask: { backdropFilter: 'blur(2px)' }, ...previewStyle },
    toolbarRender: (
      _,
      {
        transform: { scale },
        actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
      },
    ) => (
      <Flexbox className={styles.toolbar} gap={4} horizontal>
        <ActionIcon color={'#fff'} icon={FlipHorizontal} onClick={onFlipX} />
        <ActionIcon color={'#fff'} icon={FlipVertical} onClick={onFlipY} />
        <ActionIcon color={'#fff'} icon={RotateCcw} onClick={onRotateLeft} />
        <ActionIcon color={'#fff'} icon={RotateCw} onClick={onRotateRight} />
        <ActionIcon
          color={'#fff'}
          disable={scale === minScale}
          icon={ZoomOut}
          onClick={onZoomOut}
        />
        <ActionIcon color={'#fff'} disable={scale === maxScale} icon={ZoomIn} onClick={onZoomIn} />
        {toolbarAddon}
      </Flexbox>
    ),
    // @ts-ignore
    ...rest,
  };
};

export default usePreview;
