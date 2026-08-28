'use client';

import { X } from 'lucide-react';
import type { MotionValue } from 'motion/react';
import { memo, type MouseEvent, type ReactNode, useCallback } from 'react';

import ActionIcon from '@/base-ui/ActionIcon';
import imageMessages from '@/i18n/resources/en/image';
import { useTranslation } from '@/i18n/useTranslation';

import { styles } from '../style';
import GalleryNav from './GalleryNav';
import type { Rect, Rotation, Size } from './geometry';
import Toolbar from './Toolbar';
import { useChromeIdle } from './useChromeIdle';

export interface ViewerChromeProps {
  canZoomIn: boolean;
  canZoomOut: boolean;
  chromeRef: (node: HTMLElement | null) => void;
  current: number;
  fitRect: Rect;
  flipHorizontal: () => void;
  flipVertical: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  natural: Size;
  next: () => void;
  onClose: () => void;
  onDownload?: (source: string) => void | Promise<void>;
  prev: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  rotation: Rotation;
  scale: MotionValue<number>;
  source: string;
  toggleActualSize: () => void;
  toolbarAddon?: ReactNode;
  total: number;
  zoomIn: () => void;
  zoomOut: () => void;
}

const ViewerChrome = memo<ViewerChromeProps>(
  ({ chromeRef, current, hasNext, hasPrev, next, onClose, prev, total, ...toolbarProps }) => {
    const { t } = useTranslation(imageMessages);
    const idle = useChromeIdle();

    const handleChromeClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    }, []);

    return (
      <div className={styles.viewerChrome} ref={chromeRef} onClick={handleChromeClick}>
        <div
          className={styles.viewerChromeIdle}
          data-idle-hidden={idle.hidden ? '' : undefined}
          ref={idle.ref}
        >
          <ActionIcon
            className={styles.viewerClose}
            icon={X}
            title={t('image.close')}
            onClick={onClose}
          />
          {total > 1 && (
            <GalleryNav
              current={current}
              hasNext={hasNext}
              hasPrev={hasPrev}
              next={next}
              prev={prev}
              total={total}
            />
          )}
          <Toolbar {...toolbarProps} onMoreOpenChange={idle.setHeld} />
        </div>
      </div>
    );
  },
);

ViewerChrome.displayName = 'ViewerChrome';

export default ViewerChrome;
