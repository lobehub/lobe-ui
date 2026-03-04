import { message } from 'antd';
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
import { type ToolbarRenderInfoType } from 'rc-image/lib/Preview';
import { memo, type ReactNode, useCallback, useRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';
import imageMessages from '@/i18n/resources/en/image';
import { useTranslation } from '@/i18n/useTranslation';
import { TooltipGroup } from '@/Tooltip';
import { getClipboardBlob } from '@/utils/blobToPng';
import { downloadBlob } from '@/utils/downloadBlob';

import { styles } from '../style';

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

export interface ToolbarProps {
  children?: ReactNode;
  info: Omit<ToolbarRenderInfoType, 'current' | 'total'>;
  maxScale: number;
  minScale: number;
}

const Toolbar = memo<ToolbarProps>(({ children, info, minScale, maxScale }) => {
  const { t } = useTranslation(imageMessages);
  const ref = useRef<HTMLElement>(null);
  const [copyLoading, setCopyLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const {
    transform: { scale },
    actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
    image: { url },
  } = info;

  const handleDownload = useCallback(async () => {
    setDownloadLoading(true);
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      let fileName = getFileNameFromUrl(url);
      const ext = getExtensionFromMimeType(blob.type);
      if (!fileName.includes('.')) {
        fileName = `${fileName}.${ext}`;
      } else if (fileName.endsWith('.svg+xml')) {
        fileName = fileName.replace(/\.svg\+xml$/i, '.svg');
      }
      await downloadBlob(blobUrl, fileName);
      URL.revokeObjectURL(blobUrl);
      message.success(t('image.downloadSuccess'));
    } catch {
      message.error(t('image.downloadFailed'));
    } finally {
      setDownloadLoading(false);
    }
  }, [url, t]);

  const handleCopy = useCallback(async () => {
    setCopyLoading(true);
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const clipboardBlob = await getClipboardBlob(blob);
      await navigator.clipboard.write([new ClipboardItem(clipboardBlob)]);
      message.success(t('image.copySuccess'));
    } catch {
      message.error(t('image.copyFailed'));
    } finally {
      setCopyLoading(false);
    }
  }, [url, t]);

  return (
    <TooltipGroup
      getPopupContainer={() => document.querySelector(`.ant-image-preview-mask`) as HTMLElement}
    >
      <Flexbox horizontal className={styles.toolbar} gap={4} ref={ref}>
        <ActionIcon icon={FlipHorizontal} title={t('image.flipHorizontal')} onClick={onFlipX} />
        <ActionIcon icon={FlipVertical} title={t('image.flipVertical')} onClick={onFlipY} />
        <ActionIcon icon={RotateCcw} title={t('image.rotateLeft')} onClick={onRotateLeft} />
        <ActionIcon icon={RotateCw} title={t('image.rotateRight')} onClick={onRotateRight} />
        <ActionIcon
          disabled={scale === minScale}
          icon={ZoomOut}
          title={t('image.zoomOut')}
          onClick={onZoomOut}
        />
        <ActionIcon
          disabled={scale === maxScale}
          icon={ZoomIn}
          title={t('image.zoomIn')}
          onClick={onZoomIn}
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
        {children}
      </Flexbox>
    </TooltipGroup>
  );
});

export default Toolbar;
