import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import type { ToolbarRenderInfoType } from 'rc-image/lib/Preview';
import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';

import { useStyles } from '../style';

export interface ToolbarProps {
  children?: ReactNode;
  info: Omit<ToolbarRenderInfoType, 'current' | 'total'>;
  maxScale: number;
  minScale: number;
}

const Toolbar = memo<ToolbarProps>(({ children, info, minScale, maxScale }) => {
  const { styles } = useStyles();
  const {
    transform: { scale },
    actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
  } = info;

  return (
    <Flexbox className={styles.toolbar} gap={4} horizontal>
      <ActionIcon color={'#fff'} icon={FlipHorizontal} onClick={onFlipX} />
      <ActionIcon color={'#fff'} icon={FlipVertical} onClick={onFlipY} />
      <ActionIcon color={'#fff'} icon={RotateCcw} onClick={onRotateLeft} />
      <ActionIcon color={'#fff'} icon={RotateCw} onClick={onRotateRight} />
      <ActionIcon color={'#fff'} disabled={scale === minScale} icon={ZoomOut} onClick={onZoomOut} />
      <ActionIcon color={'#fff'} disabled={scale === maxScale} icon={ZoomIn} onClick={onZoomIn} />
      {children}
    </Flexbox>
  );
});

export default Toolbar;
