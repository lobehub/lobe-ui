import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import type { ToolbarRenderInfoType } from 'rc-image/lib/Preview';
import { type ReactNode, memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';

import { styles } from '../style';

export interface ToolbarProps {
  children?: ReactNode;
  info: Omit<ToolbarRenderInfoType, 'current' | 'total'>;
  maxScale: number;
  minScale: number;
}

const Toolbar = memo<ToolbarProps>(({ children, info, minScale, maxScale }) => {
  const {
    transform: { scale },
    actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
  } = info;

  return (
    <Flexbox className={styles.toolbar} gap={4} horizontal>
      <ActionIcon icon={FlipHorizontal} onClick={onFlipX} />
      <ActionIcon icon={FlipVertical} onClick={onFlipY} />
      <ActionIcon icon={RotateCcw} onClick={onRotateLeft} />
      <ActionIcon icon={RotateCw} onClick={onRotateRight} />
      <ActionIcon disabled={scale === minScale} icon={ZoomOut} onClick={onZoomOut} />
      <ActionIcon disabled={scale === maxScale} icon={ZoomIn} onClick={onZoomIn} />
      {children}
    </Flexbox>
  );
});

export default Toolbar;
