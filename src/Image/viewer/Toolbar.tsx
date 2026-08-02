'use client';

import {
  Copy,
  Download,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { MotionValue } from 'motion/react';
import { memo, type ReactNode, useCallback, useState, useSyncExternalStore } from 'react';

import ActionIcon from '@/ActionIcon';
import { toast } from '@/base-ui/Toast';
import { Center, Flexbox } from '@/Flex';
import imageMessages from '@/i18n/resources/en/image';
import { useTranslation } from '@/i18n/useTranslation';
import Tooltip, { TooltipGroup } from '@/Tooltip';
import { getClipboardBlob } from '@/utils/blobToPng';
import { downloadBlob } from '@/utils/downloadBlob';

import { styles } from '../style';
import { naturalScale, type Rect, type Rotation, type Size } from './geometry';

const getFileNameFromUrl = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\/([^/]+)$/);
    return match ? decodeURIComponent(match[1]) : 'image';
  } catch {
    return 'image';
  }
};

const getExtensionFromMimeType = (mimeType: string): string => {
  const map: Record<string, string> = {
    'image/svg+xml': 'svg',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return map[mimeType?.toLowerCase()] || mimeType?.split('/')[1]?.split('+')[0] || 'png';
};

const usePercentage = (scale: MotionValue<number>, matchScale: number): number => {
  const subscribe = useCallback((onChange: () => void) => scale.on('change', onChange), [scale]);
  const getSnapshot = useCallback(
    () => Math.round((scale.get() / matchScale) * 100),
    [matchScale, scale],
  );

  return useSyncExternalStore(subscribe, getSnapshot);
};

export interface ToolbarProps {
  canZoomIn: boolean;
  canZoomOut: boolean;
  fitRect: Rect;
  flipHorizontal: () => void;
  flipVertical: () => void;
  natural: Size;
  reset: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  rotation: Rotation;
  scale: MotionValue<number>;
  source: string;
  toolbarAddon?: ReactNode;
  zoomIn: () => void;
  zoomOut: () => void;
}

const Toolbar = memo<ToolbarProps>(
  ({
    canZoomIn,
    canZoomOut,
    fitRect,
    flipHorizontal,
    flipVertical,
    natural,
    reset,
    rotateLeft,
    rotateRight,
    rotation,
    scale,
    source,
    toolbarAddon,
    zoomIn,
    zoomOut,
  }) => {
    const { t } = useTranslation(imageMessages);
    const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
    const [copyLoading, setCopyLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const matchScale = naturalScale(natural, fitRect, rotation);
    const percentage = usePercentage(scale, matchScale);

    const handleDownload = useCallback(async () => {
      setDownloadLoading(true);
      try {
        const response = await fetch(source, { mode: 'cors' });
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        let fileName = getFileNameFromUrl(source);
        const ext = getExtensionFromMimeType(blob.type);
        if (!fileName.includes('.')) {
          fileName = `${fileName}.${ext}`;
        } else if (fileName.endsWith('.svg+xml')) {
          fileName = fileName.replace(/\.svg\+xml$/i, '.svg');
        }
        await downloadBlob(blobUrl, fileName);
        URL.revokeObjectURL(blobUrl);
        toast.success(t('image.downloadSuccess'));
      } catch {
        toast.error(t('image.downloadFailed'));
      } finally {
        setDownloadLoading(false);
      }
    }, [source, t]);

    const handleCopy = useCallback(async () => {
      setCopyLoading(true);
      try {
        const response = await fetch(source, { mode: 'cors' });
        const blob = await response.blob();
        const clipboardBlob = await getClipboardBlob(blob);
        await navigator.clipboard.write([new ClipboardItem(clipboardBlob)]);
        toast.success(t('image.copySuccess'));
      } catch {
        toast.error(t('image.copyFailed'));
      } finally {
        setCopyLoading(false);
      }
    }, [source, t]);

    return (
      <TooltipGroup popupContainer={containerEl ?? undefined}>
        <Flexbox horizontal align="center" className={styles.toolbar} gap={4} ref={setContainerEl}>
          <ActionIcon
            icon={FlipHorizontal}
            title={t('image.flipHorizontal')}
            onClick={flipHorizontal}
          />
          <ActionIcon icon={FlipVertical} title={t('image.flipVertical')} onClick={flipVertical} />
          <ActionIcon icon={RotateCcw} title={t('image.rotateLeft')} onClick={rotateLeft} />
          <ActionIcon icon={RotateCw} title={t('image.rotateRight')} onClick={rotateRight} />
          <ActionIcon
            disabled={!canZoomOut}
            icon={ZoomOut}
            title={t('image.zoomOut')}
            onClick={zoomOut}
          />
          <Tooltip title={t('image.zoomReset')}>
            <Center
              horizontal
              className={styles.toolbarPercentage}
              role="button"
              tabIndex={0}
              onClick={reset}
            >
              {percentage}%
            </Center>
          </Tooltip>
          <ActionIcon
            disabled={!canZoomIn}
            icon={ZoomIn}
            title={t('image.zoomIn')}
            onClick={zoomIn}
          />
          <ActionIcon
            icon={Copy}
            loading={copyLoading}
            title={t('image.copy')}
            onClick={handleCopy}
          />
          <ActionIcon
            icon={Download}
            loading={downloadLoading}
            title={t('image.download')}
            onClick={handleDownload}
          />
          {toolbarAddon}
        </Flexbox>
      </TooltipGroup>
    );
  },
);

Toolbar.displayName = 'Toolbar';

export default Toolbar;
