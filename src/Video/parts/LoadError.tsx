'use client';

import { AlertTriangle, Download, RefreshCw } from 'lucide-react';

import videoMessages from '@/i18n/resources/en/video';
import { useTranslation } from '@/i18n/useTranslation';
import { styleProps } from '@/styles/stylex/props';

import { useVideoContext } from '../context';
import { styles } from '../style';
import { useVideo } from '../useVideo';

const LoadError = () => {
  const { config, media, store } = useVideoContext();
  const { t } = useTranslation(videoMessages);
  const failed = useVideo((state) => state.status === 'error');
  if (!failed) return null;

  return (
    <div role="alert" {...styleProps(styles.error)} onClick={(event) => event.stopPropagation()}>
      <AlertTriangle size={22} />
      <span>{t('video.loadFailed')}</span>
      <div {...styleProps(styles.errorActions)}>
        <button
          type="button"
          {...styleProps(styles.errorButton)}
          onClick={async () => {
            await config.onRetry?.();
            store.reload();
          }}
        >
          <RefreshCw size={14} />
          {t('video.reload')}
        </button>
        <a href={media.src} rel="noreferrer" target="_blank" {...styleProps(styles.errorButton)}>
          <Download size={14} />
          {t('video.download')}
        </a>
      </div>
    </div>
  );
};

LoadError.displayName = 'VideoLoadError';

export default LoadError;
