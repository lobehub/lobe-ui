'use client';

import { Play } from 'lucide-react';

import videoMessages from '@/i18n/resources/en/video';
import { useTranslation } from '@/i18n/useTranslation';
import { styleProps } from '@/styles/stylex/props';

import { useVideoContext } from '../context';
import { styles } from '../style';
import { useVideo } from '../useVideo';

const CenterPlay = () => {
  const { store } = useVideoContext();
  const { t } = useTranslation(videoMessages);
  const show = useVideo((state) => state.paused && state.status === 'ready' && state.time < 0.05);
  if (!show) return null;

  return (
    <button
      aria-label={t('video.play')}
      type="button"
      {...styleProps(styles.centerPlay)}
      onClick={(event) => {
        event.stopPropagation();
        void store.play();
      }}
    >
      <Play fill="currentColor" size={24} strokeWidth={0} />
    </button>
  );
};

CenterPlay.displayName = 'VideoCenterPlay';

export default CenterPlay;
